import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const archivedProjects = await queries.getArchivedProjects();
    return NextResponse.json(archivedProjects);
  } catch (error) {
    console.error('Error fetching archived projects:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הפרויקטים המארכבים' },
      { status: 500 }
    );
  }
}
