import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // החזרת מערך ריק בינתיים עד לתיקון החיבור ל-PostgreSQL
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרויקטים' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'שם הפרויקט חובה' },
        { status: 400 }
      );
    }

    // החזרת פרויקט דמה בינתיים
    const mockProject = {
      id: Date.now(),
      name: body.name,
      description: body.description || '',
      created_at: new Date().toISOString()
    };

    return NextResponse.json(mockProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הפרויקט' },
      { status: 500 }
    );
  }
}
