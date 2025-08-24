import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // קבלת כל הפרויקטים מהמסד נתונים
    const allProjects = await queries.getAllProjects();
    const archivedProjects = await queries.getArchivedProjects();
    
    // יצירת פרויקטים דינמיים לעץ
    const dynamicActiveProjects = allProjects.map(project => ({
      id: `active-project-${project.id}`,
      name: project.name,
      path: `/projects/${project.id}`,
      description: project.description || 'פרויקט פעיל',
      status: 'completed' as const,
      lastModified: new Date(project.updated_at).toISOString().split('T')[0],
      technologies: project.technologies || [],
      components: ['ProjectDetails', 'ProjectCard', 'ProgressBar'],
      parent: 'projects-list',
      level: 3,
      type: 'page' as const
    }));
    
    const dynamicArchivedProjects = archivedProjects.map(project => ({
      id: `archived-project-${project.id}`,
      name: `${project.name} (ארכיון)`,
      path: `/projects/${project.id}`,
      description: project.description || 'פרויקט בארכיון',
      status: 'completed' as const,
      lastModified: new Date(project.updated_at).toISOString().split('T')[0],
      technologies: project.technologies || [],
      components: ['ArchivedProjectCard', 'ProjectDetails'],
      parent: 'projects-archive',
      level: 3,
      type: 'page' as const
    }));
    
    return NextResponse.json({
      message: 'מיפוי הפרויקט עודכן בהצלחה',
      activeProjects: allProjects.length,
      archivedProjects: archivedProjects.length,
      totalUpdated: allProjects.length + archivedProjects.length,
      dynamicProjects: {
        active: dynamicActiveProjects,
        archived: dynamicArchivedProjects
      }
    });
    
  } catch (error) {
    console.error('Error updating project map:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון מיפוי הפרויקט' },
      { status: 500 }
    );
  }
}
