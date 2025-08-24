import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    // אם יש קוד ספציפי, מחזיר את הפרויקט הספציפי
    if (code) {
      const projects = await queries.getAllProjects();
      const project = projects.find(p => p.code === code);
      if (!project) {
        return NextResponse.json(
          { error: 'פרויקט לא נמצא' },
          { status: 404 }
        );
      }
      return NextResponse.json([project]); // מחזיר מערך עם פרויקט אחד כמו שהדף הדינמי מצפה
    }
    
    // אחרת מחזיר את כל הפרויקטים
    const projects = await queries.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרויקטים' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // ולידציה בסיסית
    if (!body.name) {
      return NextResponse.json(
        { error: 'שם הפרויקט חובה' },
        { status: 400 }
      );
    }

    const project = await queries.createProject({
      name: body.name,
      description: body.description,
      type: body.type || 'web',
      status: body.status || 'planning',
      priority: body.priority || 'medium',
      team: body.team || [],
      start_date: body.start_date,
      due_date: body.due_date,
      technologies: body.technologies || [],
      repository_url: body.repository_url,
      path: body.path,
      settings: body.settings || {}
    });

    // יצירת תיקיית פרויקט אם נדרש
    if (body.createFolder && body.code) {
      try {
        const projectsDir = path.join(process.cwd(), 'projects');
        const projectDir = path.join(projectsDir, body.code);
        
        // יצירת תיקיית projects אם לא קיימת
        try {
          await fs.access(projectsDir);
        } catch {
          await fs.mkdir(projectsDir, { recursive: true });
        }
        
        // יצירת תיקיית הפרויקט
        await fs.mkdir(projectDir, { recursive: true });
        
        // יצירת קבצי בסיס
        await fs.writeFile(
          path.join(projectDir, 'README.md'),
          `# ${body.name}\n\n${body.description || 'תיאור הפרויקט'}\n\n## סטטוס\nתכנון\n\n## צוות\n${body.team ? body.team.join(', ') : 'לא הוגדר'}\n\n## טכנולוגיות\n${body.technologies ? body.technologies.join(', ') : 'לא הוגדרו'}\n`
        );
        
        await fs.writeFile(
          path.join(projectDir, 'project.json'),
          JSON.stringify({
            id: project.id,
            name: body.name,
            code: body.code,
            type: body.type,
            created_at: new Date().toISOString(),
            description: body.description,
            team: body.team,
            technologies: body.technologies
          }, null, 2)
        );
        
        console.log(`✅ נוצרה תיקיית פרויקט: ${projectDir}`);
      } catch (error) {
        console.error('שגיאה ביצירת תיקיית פרויקט:', error);
        // לא נכשיל את כל הפעולה בגלל שגיאה ביצירת תיקייה
      }
    }

    // יצירת פעילות
    await queries.createActivity({
      action: 'project_created',
      description: `פרויקט חדש נוצר: ${body.name}`,
      project_id: project.id,
      metadata: { 
        project_type: body.type,
        folder_created: body.createFolder,
        project_code: body.code
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הפרויקט' },
      { status: 500 }
    );
  }
}
