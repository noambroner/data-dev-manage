import { NextRequest, NextResponse } from 'next/server';
import { queries } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const tables = await queries.getAllTables();
    
    // הוספת מידע נוסף לכל טבלה
    const tablesWithInfo = await Promise.all(
      tables.map(async (table) => {
        try {
          const rowCount = await queries.getTableRowCount(table.name);
          const columns = await queries.getTableInfo(table.name);
          
          return {
            ...table,
            row_count: rowCount,
            column_count: columns.length,
            columns: columns
          };
        } catch (error) {
          console.error(`Error getting info for table ${table.name}:`, error);
          return {
            ...table,
            row_count: 0,
            column_count: 0,
            columns: []
          };
        }
      })
    );

    return NextResponse.json(tablesWithInfo);
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת טבלאות בסיס הנתונים' },
      { status: 500 }
    );
  }
}
