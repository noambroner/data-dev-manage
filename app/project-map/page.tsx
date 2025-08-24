import React from 'react';
import { queries } from '@/lib/db';
import ProjectMapClient from './ProjectMapClient';

// כפיית Dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server Component - קורא נתונים מהDB
export default async function ProjectMapPage() {
  console.log('🔍 ProjectMapPage Server Component - Loading projects from DB...');
  
  try {
    // קריאה ישירה לDB
    const activeProjects = await queries.getAllProjects();
    const archivedProjects = await queries.getArchivedProjects();
    
    console.log('🔍 Server Component - Active projects:', activeProjects.length);
    console.log('🔍 Server Component - Archived projects:', archivedProjects.length);
    
    return <ProjectMapClient 
      initialActiveProjects={activeProjects} 
      initialArchivedProjects={archivedProjects}
    />;
  } catch (error) {
    console.error('🚨 ProjectMapPage Server Component error:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2" dir="rtl">שגיאה בטעינת מפת הפרויקט</h2>
          <p className="text-gray-600 mb-4" dir="rtl">אירעה שגיאה בטעינת הנתונים</p>
        </div>
      </div>
    );
  }
}