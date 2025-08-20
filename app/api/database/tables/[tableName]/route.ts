import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { tableName: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || undefined;

    const tableName = params.tableName;
    
    // בדיקת תקינות שם הטבלה (למניעת SQL injection)
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
      return NextResponse.json(
        { error: 'שם טבלה לא תקין' },
        { status: 400 }
      );
    }

    // קבלת מידע על הטבלה
    const tableInfo = await queries.getTableInfo(tableName);
    if (tableInfo.length === 0) {
      return NextResponse.json(
        { error: 'טבלה לא נמצאה' },
        { status: 404 }
      );
    }

    // קבלת הנתונים
    const data = await queries.getTableData(tableName, limit, offset, search);
    const totalRows = await queries.getTableRowCount(tableName);

    return NextResponse.json({
      table_name: tableName,
      columns: tableInfo,
      data: data,
      pagination: {
        limit,
        offset,
        total: totalRows,
        has_more: offset + limit < totalRows
      },
      search_term: search
    });
  } catch (error) {
    console.error(`Error fetching table data for ${params.tableName}:`, error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת נתוני הטבלה' },
      { status: 500 }
    );
  }
}
