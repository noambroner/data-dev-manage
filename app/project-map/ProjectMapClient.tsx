'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  GitBranch, 
  FileText, 
  Code2, 
  Home,
  FolderOpen,
  Eye,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Globe,
  Layout,
  Database,
  Settings,
  Users,
  TreePine,
  RefreshCw
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: string;
  type: string;
  technologies: string[];
}

interface PageDocumentation {
  id: string;
  name: string;
  path: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  lastModified: string;
  technologies: string[];
  components: string[];
  parent?: string;
  children?: string[];
  level: number;
  type: 'page' | 'section' | 'api' | 'component';
}

interface TreeNode {
  id: string;
  name: string;
  path: string;
  type: 'page' | 'section' | 'api' | 'component';
  status: 'completed' | 'in-progress' | 'planned';
  level: number;
  children: TreeNode[];
  expanded?: boolean;
}

interface ProjectMapClientProps {
  initialActiveProjects: Project[];
  initialArchivedProjects: Project[];
}

export default function ProjectMapClient({ initialActiveProjects, initialArchivedProjects }: ProjectMapClientProps) {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('tree');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'projects-section']));
  const [activeProjects, setActiveProjects] = useState<Project[]>(initialActiveProjects);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>(initialArchivedProjects);

  // רשימת דפים סטטית + דינמית
  const getStaticPages = (): PageDocumentation[] => [
    {
      id: 'root',
      name: 'פלטפורמת פיתוח',
      path: '/',
      description: 'דף הבית של הפלטפורמה',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
      components: ['Sidebar', 'MainLayout', 'Navigation'],
      level: 0,
      type: 'page',
      children: ['projects-section', 'development', 'database', 'team', 'project-map', 'guide-for-ai', 'settings']
    },
    {
      id: 'projects-section',
      name: 'ניהול פרויקטים',
      path: '/projects',
      description: 'מערכת ניהול פרויקטים מתקדמת עם PostgreSQL, מערכת ארכיון מלאה, יצירת פרויקטים אוטומטית ותמיכה בצוותים',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion', 'Real-time Data', 'Archive System'],
      components: ['ProjectCard', 'SearchFilter', 'ProjectStats', 'ViewModeToggle', 'DataLoader', 'ErrorBoundary', 'ArchiveButton'],
      parent: 'root',
      level: 1,
      type: 'section',
      children: ['projects-list', 'projects-archive', 'project-details', 'projects-api', 'projects-archive-api', 'projects-archive-action-api']
    },
    {
      id: 'projects-list',
      name: 'רשימת פרויקטים',
      path: '/projects',
      description: 'תצוגת כל הפרויקטים הפעילים עם חיפוש וסינון, כולל כפתורי העברה לארכיון לכל פרויקט, מקבלת נתונים מ-PostgreSQL בזמן אמת',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Server Components', 'Client Components', 'Real-time Data'],
      components: ['ProjectCard', 'ProjectList', 'SearchFilter', 'StatusFilter', 'ViewModeToggle', 'ProjectStats', 'ArchiveButton', 'UpdateMapButton'],
      parent: 'projects-section',
      level: 2,
      type: 'page'
    },
    {
      id: 'projects-archive',
      name: 'ארכיון פרויקטים',
      path: '/archived',
      description: 'תצוגת כל הפרויקטים המועברים לארכיון עם אפשרות שחזור, מערכת ארכיון מלאה עם PostgreSQL',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js 14', 'TypeScript', 'PostgreSQL', 'Archive System', 'Real-time Data'],
      components: ['ArchivedProjectCard', 'ArchiveList', 'UnarchiveButton', 'ArchiveStats'],
      parent: 'projects-section',
      level: 2,
      type: 'page'
    },
    {
      id: 'projects-api',
      name: 'API פרויקטים',
      path: '/api/projects',
      description: 'API מלא לניהול פרויקטים - יצירה, עריכה, מחיקה וקריאת נתונים מ-PostgreSQL',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js API Routes', 'PostgreSQL', 'TypeScript', 'Database Queries'],
      components: ['DatabaseQueries', 'ProjectValidation', 'ErrorHandling'],
      parent: 'projects-section',
      level: 2,
      type: 'api'
    },
    {
      id: 'projects-archive-api',
      name: 'API ארכיון פרויקטים',
      path: '/api/projects/archived',
      description: 'API ייעודי לקבלת פרויקטים מועברים לארכיון עם cache busting',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js API Routes', 'PostgreSQL', 'Cache Busting'],
      components: ['ArchivedProjectsQuery', 'CacheBusting'],
      parent: 'projects-section',
      level: 2,
      type: 'api'
    },
    {
      id: 'projects-archive-action-api',
      name: 'API פעולות ארכיון',
      path: '/api/projects/[id]/archive',
      description: 'API להעברת פרויקט לארכיון ושחזור מהארכיון',
      status: 'completed',
      lastModified: '2025-08-22',
      technologies: ['Next.js Dynamic Routes', 'PostgreSQL', 'Archive System'],
      components: ['ArchiveAction', 'UnarchiveAction'],
      parent: 'projects-section',
      level: 2,
      type: 'api'
    }
  ];

  // יצירת פרויקטים דינמיים
  const getDynamicProjectPages = (): PageDocumentation[] => {
    const dynamicPages: PageDocumentation[] = [];

    // פרויקטים פעילים
    activeProjects.forEach(project => {
      dynamicPages.push({
        id: `active-project-${project.id}`,
        name: project.name,
        path: `/projects/${project.id}`,
        description: project.description || 'פרויקט פעיל',
        status: 'completed',
        lastModified: new Date(project.updated_at).toISOString().split('T')[0],
        technologies: project.technologies || [],
        components: ['ProjectDetails', 'ProjectCard', 'ProgressBar'],
        parent: 'projects-list',
        level: 3,
        type: 'page'
      });
    });

    // פרויקטים בארכיון
    archivedProjects.forEach(project => {
      dynamicPages.push({
        id: `archived-project-${project.id}`,
        name: `${project.name} (ארכיון)`,
        path: `/projects/${project.id}`,
        description: project.description || 'פרויקט בארכיון',
        status: 'completed',
        lastModified: new Date(project.updated_at).toISOString().split('T')[0],
        technologies: project.technologies || [],
        components: ['ArchivedProjectCard', 'ProjectDetails'],
        parent: 'projects-archive',
        level: 3,
        type: 'page'
      });
    });

    return dynamicPages;
  };

  // שילוב דפים סטטיים ודינמיים
  const getAllPages = (): PageDocumentation[] => {
    return [...getStaticPages(), ...getDynamicProjectPages()];
  };

  const pages = getAllPages();

  const filteredPages = pages.filter(page =>
    page.name.includes(searchTerm) ||
    page.description.includes(searchTerm) ||
    page.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const buildTree = (pages: PageDocumentation[]): TreeNode[] => {
    const pageMap: { [key: string]: PageDocumentation } = {};
    pages.forEach(page => pageMap[page.id] = page);

    const tree: TreeNode[] = [];
    const addedNodes = new Set<string>();

    const createNode = (page: PageDocumentation): TreeNode => ({
      id: page.id,
      name: page.name,
      path: page.path,
      type: page.type,
      status: page.status,
      level: page.level,
      children: [],
      expanded: expandedNodes.has(page.id)
    });

    // בניית עץ היררכי
    const addChildrenRecursively = (node: TreeNode, allPages: PageDocumentation[]) => {
      const children = allPages.filter(p => p.parent === node.id);
      node.children = children
        .map(createNode)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      node.children.forEach(child => {
        addedNodes.add(child.id);
        addChildrenRecursively(child, allPages);
      });
    };

    // התחלה מהשורש
    const rootPages = pages.filter(p => !p.parent || p.parent === 'root');
    rootPages.forEach(page => {
      if (!addedNodes.has(page.id)) {
        const node = createNode(page);
        addChildrenRecursively(node, pages);
        tree.push(node);
        addedNodes.add(page.id);
      }
    });

    return tree;
  };

  const tree = buildTree(filteredPages);

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // רענון נתונים מה-API
  const refreshProjectData = async () => {
    try {
      const response = await fetch('/api/project-map/update', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.dynamicProjects) {
          // עדכון רק אם יש נתונים חדשים
          window.location.reload(); // רענון הדף כדי לקבל נתונים חדשים מהServer Component
        }
      }
    } catch (error) {
      console.error('Error refreshing project data:', error);
    }
  };

  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    
    const getIcon = () => {
      switch (node.type) {
        case 'page': return <FileText className="w-4 h-4" />;
        case 'section': return <Folder className="w-4 h-4" />;
        case 'api': return <Code2 className="w-4 h-4" />;
        case 'component': return <Layout className="w-4 h-4" />;
        default: return <File className="w-4 h-4" />;
      }
    };

    const getStatusColor = () => {
      switch (node.status) {
        case 'completed': return 'text-green-600';
        case 'in-progress': return 'text-yellow-600';
        case 'planned': return 'text-gray-400';
        default: return 'text-gray-600';
      }
    };

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`flex items-center py-2 px-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 ${
            selectedPage === node.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
          style={{ paddingLeft: `${node.level * 20 + 12}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(node.id);
            }
            setSelectedPage(node.id);
          }}
        >
          {hasChildren && (
            <button className="mr-2 p-1 hover:bg-gray-200 rounded">
              {isExpanded ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          )}
          {!hasChildren && <div className="w-6 h-6 mr-2" />}
          
          <div className={`mr-2 ${getStatusColor()}`}>
            {getIcon()}
          </div>
          
          <span className="text-sm font-medium text-gray-700 flex-1" dir="rtl">
            {node.name}
          </span>
          
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()} bg-opacity-10`}>
            {node.status === 'completed' ? 'הושלם' : 
             node.status === 'in-progress' ? 'בתהליך' : 'מתוכנן'}
          </span>
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {node.children.map(child => renderTreeNode(child))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const selectedPageData = selectedPage ? pages.find(p => p.id === selectedPage) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Map className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800" dir="rtl">מפת הפרויקט</h1>
          </div>
          <p className="text-xl text-gray-600" dir="rtl">
            תיעוד מקיף של כל הדפים, רכיבים ו-APIs בפלטפורמה
          </p>
          <p className="text-sm text-green-600 mt-2" dir="rtl">
            ✅ פרויקטים פעילים: {activeProjects.length} | ארכיון: {archivedProjects.length}
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <TreePine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חפש דפים, רכיבים או טכנולוגיות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={refreshProjectData}
                className="p-3 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                title="רענן נתוני פרויקטים"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Layout className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`p-3 rounded-lg transition-colors ${viewMode === 'tree' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <TreePine className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tree View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center" dir="rtl">
                <TreePine className="w-5 h-5 mr-2" />
                עץ היררכית הדפים
              </h2>
              <div className="max-h-[600px] overflow-y-auto">
                {tree.map(node => renderTreeNode(node))}
              </div>
            </div>
          </motion.div>

          {/* Details Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              {selectedPageData ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800" dir="rtl">
                      {selectedPageData.name}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPageData.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedPageData.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPageData.status === 'completed' ? 'הושלם' : 
                       selectedPageData.status === 'in-progress' ? 'בתהליך' : 'מתוכנן'}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2" dir="rtl">תיאור</h3>
                      <p className="text-gray-600 leading-relaxed" dir="rtl">
                        {selectedPageData.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2" dir="rtl">נתב</h3>
                        <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono">
                          {selectedPageData.path}
                        </code>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2" dir="rtl">עדכון אחרון</h3>
                        <p className="text-gray-600">{selectedPageData.lastModified}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3" dir="rtl">טכנולוגיות</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPageData.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-700 mb-3" dir="rtl">רכיבים</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPageData.components.map((component, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                          >
                            {component}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedPageData.path && (
                      <div className="pt-4 border-t border-gray-200">
                        <a
                          href={selectedPageData.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span dir="rtl">פתח דף</span>
                        </a>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2" dir="rtl">
                    בחר פריט מהעץ
                  </h3>
                  <p className="text-gray-400" dir="rtl">
                    לחץ על פריט בעץ כדי לראות את הפרטים שלו
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
