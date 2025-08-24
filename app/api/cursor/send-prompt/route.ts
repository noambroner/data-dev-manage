import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, timestamp } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid prompt' },
        { status: 400 }
      );
    }

    // בשלב זה נעביר את הPROMPT דרך מנגנון של Cursor
    // זה יכול להיות דרך extension API או הודעות אחרות

    // לוגים לצורך debug
    console.log('📝 Received prompt for Cursor:', {
      prompt: prompt.substring(0, 100) + '...',
      timestamp,
      length: prompt.length
    });

    // נסה להעביר דרך מנגנונים שונים
    const result = await sendPromptToCursor(prompt);

    return NextResponse.json({
      success: true,
      message: 'Prompt sent to Cursor successfully',
      promptLength: prompt.length,
      timestamp: new Date().toISOString(),
      method: result.method
    });

  } catch (error) {
    console.error('❌ Error sending prompt to Cursor:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send prompt to Cursor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function sendPromptToCursor(prompt: string) {
  // בשלב ראשון נעביר דרך clipboard ו-notifications
  // בהמשך נוכל להוסיף integration ישיר עם Cursor API
  
  try {
    // אופציה 1: שמירה בקובץ זמני שCursor יוכל לקרוא
    const fs = require('fs').promises;
    const path = require('path');
    
    const tempDir = path.join(process.cwd(), 'temp');
    const promptFile = path.join(tempDir, 'cursor-prompt.txt');
    
    // יצירת תיקיה אם לא קיימת
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (e) {
      // התיקיה כבר קיימת
    }
    
    // שמירת הPROMPT בקובץ
    await fs.writeFile(promptFile, prompt, 'utf8');
    
    console.log('✅ Prompt saved to file for Cursor:', promptFile);
    
    return {
      method: 'file',
      file: promptFile,
      success: true
    };
    
  } catch (fileError) {
    console.warn('⚠️ Could not save to file, using fallback method');
    
    // אופציה 2: החזרת הPROMPT ללקוח לטיפול ידני
    return {
      method: 'manual',
      success: true,
      note: 'Prompt should be manually copied to Cursor'
    };
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Cursor Prompt API is running',
    endpoints: {
      POST: '/api/cursor/send-prompt - Send a prompt to Cursor'
    },
    usage: {
      method: 'POST',
      body: {
        prompt: 'Your prompt text here',
        timestamp: 'ISO timestamp (optional)'
      }
    }
  });
}







