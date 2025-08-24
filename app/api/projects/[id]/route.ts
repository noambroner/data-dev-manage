import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'מזהה פרויקט לא תקין' },
        { status: 400 }
      );
    }

    // בדיקה שהפרויקט קיים
    const existingProject = await queries.getProjectById(projectId);
    if (!existingProject) {
      return NextResponse.json(
        { error: 'פרויקט לא נמצא' },
        { status: 404 }
      );
    }

    // מחיקת הפרויקט
    await queries.deleteProject(projectId);

    // יצירת פעילות
    await queries.createActivity({
      action: 'project_deleted',
      description: `פרויקט נמחק: ${existingProject.name}`,
      project_id: projectId,
      metadata: { project_name: existingProject.name }
    });

    return NextResponse.json({ 
      message: 'הפרויקט נמחק בהצלחה',
      deletedProject: existingProject 
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הפרויקט' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'מזהה פרויקט לא תקין' },
        { status: 400 }
      );
    }

    const project = await queries.getProjectById(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'פרויקט לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרויקט' },
      { status: 500 }
    );
  }
}
