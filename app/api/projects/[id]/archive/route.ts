import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function POST(
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

    // העברה לארכיון
    const archivedProject = await queries.archiveProject(projectId);

    // יצירת פעילות
    await queries.createActivity({
      action: 'project_archived',
      description: `פרויקט הועבר לארכיון: ${existingProject.name}`,
      project_id: projectId,
      metadata: { project_name: existingProject.name }
    });

    return NextResponse.json({ 
      message: 'הפרויקט הועבר לארכיון בהצלחה',
      project: archivedProject 
    });

  } catch (error) {
    console.error('Error archiving project:', error);
    return NextResponse.json(
      { error: 'שגיאה בהעברת הפרויקט לארכיון' },
      { status: 500 }
    );
  }
}

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

    // בדיקה שהפרויקט קיים בארכיון
    const existingProject = await queries.getProjectById(projectId);
    if (!existingProject) {
      return NextResponse.json(
        { error: 'פרויקט לא נמצא' },
        { status: 404 }
      );
    }

    if (!existingProject.archived) {
      return NextResponse.json(
        { error: 'הפרויקט לא נמצא בארכיון' },
        { status: 400 }
      );
    }

    // החזרה מהארכיון
    const unarchivedProject = await queries.unarchiveProject(projectId);

    // יצירת פעילות
    await queries.createActivity({
      action: 'project_unarchived',
      description: `פרויקט הוחזר מהארכיון: ${existingProject.name}`,
      project_id: projectId,
      metadata: { project_name: existingProject.name }
    });

    return NextResponse.json({ 
      message: 'הפרויקט הוחזר מהארכיון בהצלחה',
      project: unarchivedProject 
    });

  } catch (error) {
    console.error('Error unarchiving project:', error);
    return NextResponse.json(
      { error: 'שגיאה בהחזרת הפרויקט מהארכיון' },
      { status: 500 }
    );
  }
}
