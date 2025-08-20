import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
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

    // יצירת פעילות
    await queries.createActivity({
      action: 'project_created',
      description: `פרויקט חדש נוצר: ${body.name}`,
      project_id: project.id,
      metadata: { project_type: body.type }
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
