import Link from 'next/link';
import { queries } from '@/lib/db';
import { AlertCircle } from 'lucide-react';
import ProjectsClientComponent from './ProjectsClientComponent';

// ממשק הפרויקט
interface Project {
  id: number;
  name: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  progress: number;
  team: string[];
  start_date?: string;
  due_date?: string;
  technologies: string[];
  repository_url?: string;
  path?: string;
  created_at: string;
  updated_at: string;
}

// Server Component - קוראים נתונים ישירות מה-DB
export default async function ProjectsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  console.log('🔍 Server Component - Loading projects from DB...');
  
  try {
    // קריאה ישירה לDB במקום API
    const projects = await queries.getAllProjects();
    console.log('🔍 Server Component - Projects loaded:', projects.length);
    
    return <ProjectsClientComponent initialProjects={projects} />;
  } catch (error) {
    console.error('🚨 Server Component error:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2" dir="rtl">שגיאה בטעינת פרויקטים</h2>
          <p className="text-gray-600 mb-4" dir="rtl">אירעה שגיאה בטעינת רשימת הפרויקטים</p>
        </div>
      </div>
    );
  }
}