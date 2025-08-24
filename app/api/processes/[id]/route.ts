import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'מזהה תהליך לא תקין' },
        { status: 400 }
      );
    }

    const process = await queries.getProcessById(id);
    if (!process) {
      return NextResponse.json(
        { error: 'תהליך לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(process);
  } catch (error) {
    console.error('Error fetching process:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת התהליך' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'מזהה תהליך לא תקין' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // ולידציה בסיסית
    if (!body.name) {
      return NextResponse.json(
        { error: 'שם התהליך חובה' },
        { status: 400 }
      );
    }

    if (!body.steps || !Array.isArray(body.steps)) {
      return NextResponse.json(
        { error: 'שלבי התהליך חובה' },
        { status: 400 }
      );
    }

    const process = await queries.updateProcess(id, {
      name: body.name,
      description: body.description,
      steps: body.steps
    });

    if (!process) {
      return NextResponse.json(
        { error: 'תהליך לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(process);
  } catch (error) {
    console.error('Error updating process:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון התהליך' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'מזהה תהליך לא תקין' },
        { status: 400 }
      );
    }

    const process = await queries.deleteProcess(id);
    if (!process) {
      return NextResponse.json(
        { error: 'תהליך לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'תהליך נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting process:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת התהליך' },
      { status: 500 }
    );
  }
}
