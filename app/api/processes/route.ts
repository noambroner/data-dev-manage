import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const processes = await queries.getAllProcesses();
    return NextResponse.json(processes);
  } catch (error) {
    console.error('Error fetching processes:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת התהליכים' },
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

    const process = await queries.createProcess({
      name: body.name,
      description: body.description,
      steps: body.steps
    });

    return NextResponse.json(process, { status: 201 });
  } catch (error) {
    console.error('Error creating process:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת התהליך' },
      { status: 500 }
    );
  }
}
