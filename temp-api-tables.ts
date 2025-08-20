import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // החזרת מערך ריק בינתיים עד לתיקון החיבור ל-PostgreSQL
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת טבלאות בסיס הנתונים' },
      { status: 500 }
    );
  }
}
