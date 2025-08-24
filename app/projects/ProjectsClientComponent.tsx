'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Plus, 
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
  Archive,
  Map,
  Folder
} from 'lucide-react';

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
  created_at: string;
  updated_at: string;
}

interface ProjectsClientComponentProps {
  initialProjects: Project[];
}

export default function ProjectsClientComponent({ initialProjects }: ProjectsClientComponentProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <Link href={`/projects/${project.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${getPriorityColor(project.priority)} hover:shadow-xl transition-all duration-200 cursor-pointer`}
        >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3" dir="ltr">
            <div className={`p-2 rounded-lg ${PROJECT_TYPES[project.type as keyof typeof PROJECT_TYPES]?.color || 'bg-gray-500'} text-white`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800" dir="rtl">{project.name}</h3>
              {project.description && (
                <p className="text-gray-600 text-sm mt-1" dir="rtl">{project.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2" dir="ltr">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.color || 'bg-gray-500'} text-white`}>
              <StatusIcon className="w-4 h-4" />
              <span dir="rtl">{PROJECT_STATUS[project.status as keyof typeof PROJECT_STATUS]?.label || project.status}</span>
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                archiveProject(project.id);
              }}
              className="p-2 rounded-lg bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
              title="העבר לארכיון"
            >
              <Archive className="w-4 h-4" />
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
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2" dir="ltr">
            <Calendar className="w-4 h-4" />
            <span dir="rtl">נוצר: {new Date(project.created_at).toLocaleDateString('he-IL')}</span>
          </div>
          <div className="flex items-center space-x-2" dir="ltr">
            <Users className="w-4 h-4" />
            <span dir="rtl">צוות: {project.team?.length || 0}</span>
          </div>
        </div>
        </motion.div>
      </Link>
    );
  };

  // יצירת פרויקט חדש
  const createProject = async (formData: any) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('שגיאה ביצירת הפרויקט');
      }

      const newProject = await response.json();
      setProjects(prev => [newProject, ...prev]);
      setShowCreateModal(false);
      
      // רענון הדף לאחר יצירת פרויקט
      window.location.reload();
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת הפרויקט');
    }
  };

  // העברת פרויקט לארכיון
  const archiveProject = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('שגיאה בהעברת הפרויקט לארכיון');
      }

      // הסרת הפרויקט מהרשימה
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error archiving project:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בהעברת הפרויקט לארכיון');
    }
  };

  // עדכון מיפוי הפרויקט
  const updateProjectMap = async () => {
    try {
      const response = await fetch('/api/project-map/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('שגיאה בעדכון מיפוי הפרויקט');
      }

      const result = await response.json();
      console.log('Project map updated:', result);
      alert('מיפוי הפרויקט עודכן בהצלחה!');
    } catch (err) {
      console.error('Error updating project map:', err);
      setError(err instanceof Error ? err.message : 'שגיאה בעדכון מיפוי הפרויקט');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2" dir="rtl">ניהול פרויקטים</h1>
            <p className="text-gray-600 text-lg" dir="rtl">נהל את כל הפרויקטים שלך במקום אחד</p>
          </div>
          
          <div className="flex items-center space-x-4" dir="ltr">
            {/* כפתור עדכון מיפוי הפרויקט */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={updateProjectMap}
              className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
              dir="ltr"
            >
              <Map className="w-5 h-5" />
              <span dir="rtl">עדכן את מיפוי הפרויקט</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200"
              dir="ltr"
            >
              <Plus className="w-5 h-5" />
              <span dir="rtl">פרויקט חדש</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800" dir="rtl">חיפוש וסינון</h2>
            <div className="flex items-center space-x-2" dir="ltr">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חפש פרויקטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                dir="rtl"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                dir="rtl"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="planning">תכנון</option>
                <option value="development">פיתוח</option>
                <option value="testing">בדיקות</option>
                <option value="completed">הושלם</option>
                <option value="paused">מושהה</option>
              </select>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-gray-600" dir="rtl">סה"כ פרויקטים:</span>
              <span className="font-semibold text-blue-600">{filteredProjects.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List */}
        <div className={`gap-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}`}>
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Folder className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2" dir="rtl">אין פרויקטים להצגה</h3>
            <p className="text-gray-400 mb-6" dir="rtl">
              {searchTerm || filterStatus !== 'all' 
                ? 'נסה לשנות את קריטריוני החיפוש' 
                : 'התחל על ידי יצירת פרויקט חדש'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                צור פרויקט ראשון
              </button>
            )}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-md"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span dir="rtl">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Create Project Modal - נוסיף את זה מאוחר יותר */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4" dir="rtl">צור פרויקט חדש</h3>
            <p className="text-gray-600 mb-4" dir="rtl">פונקציונליות יתווסף בהמשך...</p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
