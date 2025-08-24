'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Calendar, 
  User, 
  Code, 
  Target, 
  FileText,
  Folder,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  ExternalLink
} from 'lucide-react';

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

const PROJECT_TYPES = {
  web: { label: 'אתר אינטרנט', color: 'bg-blue-500', icon: Code },
  mobile: { label: 'אפליקציה', color: 'bg-green-500', icon: Target },
  desktop: { label: 'תוכנה', color: 'bg-purple-500', icon: FileText },
  other: { label: 'אחר', color: 'bg-gray-500', icon: Star }
};

const PROJECT_STATUS = {
  planning: { label: 'תכנון', color: 'bg-yellow-500', icon: Clock },
  active: { label: 'פעיל', color: 'bg-blue-500', icon: AlertCircle },
  completed: { label: 'הושלם', color: 'bg-green-500', icon: CheckCircle },
  on_hold: { label: 'בהמתנה', color: 'bg-gray-500', icon: Clock }
};

const PRIORITY_COLORS = {
  low: 'border-green-400',
  medium: 'border-yellow-400', 
  high: 'border-red-400'
};

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        
        // קבלת כל הפרויקטים ומציאת הספציפי
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('שגיאה בטעינת הפרויקטים');
        }
        
        const projects = await response.json();
        const projectData = projects.find((p: Project) => p.id.toString() === projectId);
        
        if (!projectData) {
          throw new Error('פרויקט לא נמצא');
        }
        
        setProject(projectData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'שגיאה בטעינת הפרויקט');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="h-12 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2" dir="rtl">
              {error || 'פרויקט לא נמצא'}
            </h3>
            <Link 
              href="/projects"
              className="text-blue-500 hover:text-blue-600 underline"
              dir="rtl"
            >
              חזרה לרשימת פרויקטים
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const TypeIcon = PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES]?.icon || Star;
  const StatusIcon = PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.icon || Clock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link 
            href="/projects"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            dir="ltr"
          >
            <ArrowRight className="w-5 h-5" />
            <span dir="rtl">חזרה לפרויקטים</span>
          </Link>
        </motion.div>

        {/* Main Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 ${PRIORITY_COLORS[project.priority as keyof typeof PRIORITY_COLORS]}`}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4" dir="ltr">
              <div className={`p-3 rounded-lg ${PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES]?.color || 'bg-gray-500'} text-white`}>
                <TypeIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2" dir="rtl">{project.name}</h1>
                <p className="text-gray-600 text-lg" dir="rtl">{project.description || 'אין תיאור'}</p>
                <div className="flex items-center space-x-2 mt-2" dir="ltr">
                  <span className="text-sm text-gray-500">מזהה פרויקט:</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">#{project.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3" dir="ltr">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.color || 'bg-gray-500'} text-white`}>
                <StatusIcon className="w-4 h-4" />
                <span dir="rtl">{PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.label || project.status}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700" dir="rtl">התקדמות פרויקט</span>
              <span className="text-lg font-bold text-blue-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-blue-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-gray-500" dir="rtl">תאריך יצירה</div>
              <div className="font-semibold" dir="rtl">
                {new Date(project.created_at).toLocaleDateString('he-IL')}
              </div>
            </div>
            
            <div className="text-center">
              <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-gray-500" dir="rtl">עדכון אחרון</div>
              <div className="font-semibold" dir="rtl">
                {new Date(project.updated_at).toLocaleDateString('he-IL')}
              </div>
            </div>
            
            <div className="text-center">
              <Code className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-gray-500" dir="rtl">סוג פרויקט</div>
              <div className="font-semibold" dir="rtl">
                {PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES]?.label || project.type}
              </div>
            </div>
            
            <div className="text-center">
              <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-gray-500" dir="rtl">צוות</div>
              <div className="font-semibold" dir="rtl">
                {project.team?.length > 0 ? `${project.team.length} חברים` : 'לא הוגדר'}
              </div>
            </div>
          </div>

          {/* Team Details */}
          {project.team && project.team.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3" dir="rtl">צוות הפרויקט</h3>
              <div className="flex flex-wrap gap-2">
                {project.team.map((member, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3" dir="rtl">טכנולוגיות</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repository Link */}
          {project.repository_url && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <a
                href={project.repository_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                dir="ltr"
              >
                <ExternalLink className="w-5 h-5" />
                <span dir="rtl">קישור למאגר הקוד</span>
              </a>
            </div>
          )}
        </motion.div>

        {/* Project Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6" dir="ltr">
            <Target className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800" dir="rtl">פרטי פרויקט נוספים</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.start_date && (
              <div>
                <div className="text-sm text-gray-500 mb-1" dir="rtl">תאריך התחלה</div>
                <div className="font-medium" dir="rtl">
                  {new Date(project.start_date).toLocaleDateString('he-IL')}
                </div>
              </div>
            )}
            
            {project.due_date && (
              <div>
                <div className="text-sm text-gray-500 mb-1" dir="rtl">תאריך יעד</div>
                <div className="font-medium" dir="rtl">
                  {new Date(project.due_date).toLocaleDateString('he-IL')}
                </div>
              </div>
            )}
            
            <div>
              <div className="text-sm text-gray-500 mb-1" dir="rtl">עדיפות</div>
              <div className="font-medium" dir="rtl">
                {project.priority === 'high' && 'גבוהה'}
                {project.priority === 'medium' && 'בינונית'}
                {project.priority === 'low' && 'נמוכה'}
                {!['high', 'medium', 'low'].includes(project.priority) && project.priority}
              </div>
            </div>
            
            {project.path && (
              <div>
                <div className="text-sm text-gray-500 mb-1" dir="rtl">נתיב פרויקט</div>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded" dir="ltr">
                  {project.path}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
