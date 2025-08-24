'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive,
  ArchiveRestore,
  Search, 
  Filter, 
  Grid, 
  List, 
  Calendar,
  Users,
  Code,
  Database,
  Globe,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// סוגי פרויקטים וסטטוסים
const PROJECT_TYPES = {
  web: { label: 'אתר אינטרנט', icon: Globe, color: 'bg-blue-500' },
  mobile: { label: 'אפליקציה', icon: Code, color: 'bg-green-500' },
  backend: { label: 'שרת', icon: Database, color: 'bg-purple-500' },
  other: { label: 'אחר', icon: Star, color: 'bg-orange-500' }
};

const PROJECT_STATUS = {
  planning: { label: 'תכנון', icon: Clock, color: 'bg-yellow-500' },
  development: { label: 'פיתוח', icon: Code, color: 'bg-blue-500' },
  testing: { label: 'בדיקות', icon: AlertCircle, color: 'bg-orange-500' },
  completed: { label: 'הושלם', icon: CheckCircle, color: 'bg-green-500' },
  paused: { label: 'מושהה', icon: Pause, color: 'bg-gray-500' }
};

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
  archived: boolean;
  archived_at: string;
  created_at: string;
  updated_at: string;
}

export default function ArchivedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // טעינת פרויקטים מארכבים מבסיס הנתונים
  const loadArchivedProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/projects/archived');
      if (!response.ok) {
        throw new Error('שגיאה בטעינת הפרויקטים המארכבים');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה לא ידועה');
      console.error('Error loading archived projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    loadArchivedProjects();
  }, []);

  // החזרה מארכיון
  const unarchiveProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/archive`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('שגיאה בהחזרת הפרויקט מהארכיון');
      }

      // הסרת הפרויקט מהרשימה
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
    } catch (error) {
      console.error('Error unarchiving project:', error);
      alert('שגיאה בהחזרת הפרויקט מהארכיון');
    }
  };

  // פילטור פרויקטים
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const TypeIcon = PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES]?.icon || Star;
    const StatusIcon = PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.icon || Clock;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${getPriorityColor(project.priority)} hover:shadow-xl transition-all duration-200 opacity-75`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3" dir="ltr">
            <div className={`p-2 rounded-lg ${PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES]?.color || 'bg-gray-500'} text-white`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800" dir="rtl">{project.name}</h3>
              <p className="text-gray-600 text-sm" dir="rtl">{project.description || 'אין תיאור'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.color || 'bg-gray-500'} text-white`} dir="ltr">
              <StatusIcon className="w-4 h-4" />
              <span dir="rtl">{PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.label || project.status}</span>
            </div>
            <button
              onClick={() => unarchiveProject(project.id)}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs"
              dir="ltr"
            >
              <ArchiveRestore className="w-4 h-4" />
              <span dir="rtl">החזר מארכיון</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700" dir="rtl">התקדמות</span>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Team */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-2" dir="ltr">
            <Users className="w-4 h-4" />
            <span dir="rtl">צוות: {project.team?.length ? project.team.join(', ') : 'לא הוגדר'}</span>
          </div>
          {project.archived_at && (
            <div className="flex items-center space-x-2" dir="ltr">
              <Archive className="w-4 h-4" />
              <span dir="rtl">ארכיון: {new Date(project.archived_at).toLocaleDateString('he-IL')}</span>
            </div>
          )}
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.length > 0 ? (
            project.technologies.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">אין טכנולוגיות מוגדרות</span>
          )}
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-400 text-right" dir="rtl">
          נוצר: {new Date(project.created_at).toLocaleDateString('he-IL')}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <p className="ml-4 text-gray-600 text-lg" dir="rtl">טוען פרויקטים מארכבים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2" dir="rtl">שגיאה בטעינת הנתונים</h2>
          <p className="text-gray-600 mb-4" dir="rtl">{error}</p>
          <button
            onClick={loadArchivedProjects}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
            dir="ltr"
          >
            <RefreshCw className="w-4 h-4" />
            <span dir="rtl">נסה שוב</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div dir="rtl">
              <div className="flex items-center space-x-4 mb-4" dir="ltr">
                <Link 
                  href="/projects" 
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  dir="ltr"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span dir="rtl">חזרה לפרויקטים</span>
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center space-x-3" dir="ltr">
                <Archive className="w-10 h-10 text-gray-700" />
                <span dir="rtl">ארכיון פרויקטים</span>
              </h1>
              <p className="text-gray-600">פרויקטים שהועברו לארכיון</p>
            </div>
            <div className="flex items-center space-x-4" dir="ltr">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadArchivedProjects}
                className="bg-gray-500 text-white px-4 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition-all duration-200"
                dir="ltr"
              >
                <RefreshCw className="w-5 h-5" />
                <span dir="rtl">רענן</span>
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חיפוש פרויקטים מארכבים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-4" dir="ltr">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dir="rtl"
                >
                  <option value="all">כל הסטטוסים</option>
                  {Object.entries(PROJECT_STATUS).map(([key, status]) => (
                    <option key={key} value={key}>{status.label}</option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} hover:bg-blue-100 transition-colors`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'} hover:bg-blue-100 transition-colors`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2" dir="rtl">
              {projects.length === 0 ? 'אין פרויקטים בארכיון' : 'לא נמצאו פרויקטים'}
            </h3>
            <p className="text-gray-500 mb-4" dir="rtl">
              {projects.length === 0 ? 'פרויקטים שיועברו לארכיון יופיעו כאן' : 'נסה לשנות את החיפוש או הפילטרים'}
            </p>
          </motion.div>
        )}

        {/* Stats */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">{projects.length}</div>
              <div className="text-gray-600" dir="rtl">סך הכל בארכיון</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-gray-600" dir="rtl">הושלמו</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {projects.filter(p => p.status === 'development').length}
              </div>
              <div className="text-gray-600" dir="rtl">בפיתוח</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length) : 0}%
              </div>
              <div className="text-gray-600" dir="rtl">התקדמות ממוצעת</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
