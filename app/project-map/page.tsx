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
  TreePine
} from 'lucide-react';

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

const pages: PageDocumentation[] = [
  {
    id: 'root',
    name: 'פלטפורמת הפיתוח',
    path: '/',
    description: 'שורש הפלטפורמה - נקודת הכניסה הראשית',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
    components: ['RootLayout', 'Sidebar'],
    level: 0,
    type: 'section',
    children: ['home', 'projects-section', 'development-section', 'database-section', 'team-section', 'project-map', 'guide-for-ai', 'settings-section']
  },
  {
    id: 'home',
    name: 'דף הבית',
    path: '/',
    description: 'דף הכניסה הראשי לפלטפורמה עם הודעת ברוך הבא ותכונות מרכזיות',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    components: ['Layout', 'HomePage', 'FeatureCards', 'CTAButton'],
    parent: 'root',
    level: 1,
    type: 'page'
  },
  {
    id: 'projects-section',
    name: 'ניהול פרויקטים',
    path: '/projects',
    description: 'סקציה לניהול וארגון פרויקטים',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    components: ['ProjectCard', 'SearchFilter', 'ProjectStats', 'ViewModeToggle'],
    parent: 'root',
    level: 1,
    type: 'section',
    children: ['projects-list', 'project-create', 'project-details']
  },
  {
    id: 'projects-list',
    name: 'רשימת פרויקטים',
    path: '/projects',
    description: 'תצוגת כל הפרויקטים הפעילים והארכיון עם חיפוש וסינון',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Lucide React'],
    components: ['ProjectCard', 'SearchBar', 'StatusFilter', 'ViewModeToggle', 'ProgressBar'],
    parent: 'projects-section',
    level: 2,
    type: 'page'
  },
  {
    id: 'project-create',
    name: 'יצירת פרויקט חדש',
    path: '/projects/create',
    description: 'טופס ליצירת פרויקט חדש עם כל ההגדרות',
    status: 'planned',
    lastModified: '2025-08-20',
    technologies: ['React Hook Form', 'Validation', 'File Upload'],
    components: ['CreateProjectForm', 'TechnologySelector', 'GitIntegration'],
    parent: 'projects-section',
    level: 2,
    type: 'page'
  },
  {
    id: 'project-details',
    name: 'פרטי פרויקט',
    path: '/projects/[id]',
    description: 'דף פרטים מפורט לפרויקט ספציפי',
    status: 'planned',
    lastModified: '2025-08-20',
    technologies: ['Dynamic Routes', 'Charts', 'Real-time Updates'],
    components: ['ProjectDetails', 'TaskBoard', 'Analytics'],
    parent: 'projects-section',
    level: 2,
    type: 'page'
  },
  {
    id: 'development-section',
    name: 'כלי פיתוח',
    path: '/development',
    description: 'סקציה לכלי פיתוח ובדיקות',
    status: 'planned',
    lastModified: '2025-08-20',
    technologies: ['Code Editor', 'Terminal', 'Git'],
    components: ['CodeEditor', 'Terminal', 'GitManager'],
    parent: 'root',
    level: 1,
    type: 'section'
  },
  {
    id: 'database-section',
    name: 'ניהול בסיס נתונים',
    path: '/database',
    description: 'ממשק לניהול וצפייה בבסיס הנתונים',
    status: 'in-progress',
    lastModified: '2025-08-20',
    technologies: ['SQLite', 'Database Viewer', 'Query Builder'],
    components: ['DatabaseViewer', 'QueryBuilder', 'TableManager'],
    parent: 'root',
    level: 1,
    type: 'section'
  },
  {
    id: 'team-section',
    name: 'ניהול צוות',
    path: '/team',
    description: 'ניהול חברי צוות והרשאות',
    status: 'planned',
    lastModified: '2025-08-20',
    technologies: ['User Management', 'Permissions', 'Authentication'],
    components: ['TeamList', 'UserProfile', 'PermissionsMatrix'],
    parent: 'root',
    level: 1,
    type: 'section'
  },
  {
    id: 'project-map',
    name: 'מפת הפרוייקט',
    path: '/project-map',
    description: 'דף תיעוד ומפת ניווט של כל הדפים והתכונות בפלטפורמה',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    components: ['ProjectMap', 'PageCard', 'StatusBadge', 'TechnologyTag', 'TreeView'],
    parent: 'root',
    level: 1,
    type: 'page'
  },
  {
    id: 'guide-for-ai',
    name: 'המדריך ל-AI',
    path: '/guide-for-ai',
    description: 'מדריך מקיף לסוכני AI עם session continuity, troubleshooting, ומבנה הפרויקט המעודכן',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Clipboard API'],
    components: ['GuideForAI', 'SectionCard', 'CopyButton', 'ExpandableContent'],
    parent: 'root',
    level: 1,
    type: 'page'
  },
  {
    id: 'settings-section',
    name: 'הגדרות מערכת',
    path: '/settings',
    description: 'הגדרות כלליות ותצורת המערכת',
    status: 'planned',
    lastModified: '2025-08-20',
    technologies: ['Configuration', 'Themes', 'User Preferences'],
    components: ['SettingsPanel', 'ThemeSelector', 'UserPreferences'],
    parent: 'root',
    level: 1,
    type: 'section'
  }
];

export default function ProjectMapPage() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

  const filteredPages = pages.filter(page =>
    page.name.includes(searchTerm) ||
    page.description.includes(searchTerm) ||
    page.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // בניית עץ הירארכי
  const buildTree = (): TreeNode[] => {
    const nodeMap: Record<string, TreeNode> = {};
    
    // יצירת כל הצמתים
    pages.forEach(page => {
      nodeMap[page.id] = {
        id: page.id,
        name: page.name,
        path: page.path,
        type: page.type,
        status: page.status,
        level: page.level,
        children: [],
        expanded: expandedNodes.has(page.id)
      };
    });

    // בניית ההירארכיה
    const rootNodes: TreeNode[] = [];
    pages.forEach(page => {
      const node = nodeMap[page.id];
      if (page.parent) {
        const parent = nodeMap[page.parent];
        if (parent) {
          parent.children.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  };

  const tree = buildTree();

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'section': return <Folder className="w-4 h-4" />;
      case 'page': return <File className="w-4 h-4" />;
      case 'api': return <Code2 className="w-4 h-4" />;
      case 'component': return <Layout className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'הושלם';
      case 'in-progress': return 'בפיתוח';
      case 'planned': return 'מתוכנן';
      default: return 'לא ידוע';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-4 mb-4" dir="ltr">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <GitBranch className="text-white w-8 h-8" />
            </div>
            <div className="text-right" dir="rtl">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">מפת הפרוייקט</h1>
              <p className="text-gray-600 text-lg">תיעוד מפורט של כל דפי הפלטפורמה והמבנה הטכני</p>
            </div>
          </div>

                  {/* Search and View Toggle */}
        <div className="flex items-center space-x-4" dir="ltr">
          <div className="relative">
            <input
              type="text"
              placeholder="חיפוש דפים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              dir="rtl"
            />
            <Map className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 flex items-center space-x-2 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="text-sm font-medium">כרטיסים</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-3 flex items-center space-x-2 transition-all ${
                viewMode === 'tree' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TreePine className="w-4 h-4" />
              <span className="text-sm font-medium">עץ</span>
            </button>
          </div>
        </div>
        </motion.div>

        {/* Statistics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'סך הכל דפים', value: pages.length, icon: FileText, color: 'blue' },
            { label: 'דפים פעילים', value: pages.filter(p => p.status === 'completed').length, icon: Eye, color: 'green' },
            { label: 'בפיתוח', value: pages.filter(p => p.status === 'in-progress').length, icon: Code2, color: 'yellow' },
            { label: 'מתוכננים', value: pages.filter(p => p.status === 'planned').length, icon: FolderOpen, color: 'purple' }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="text-right" dir="rtl">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Area */}
        {viewMode === 'grid' ? (
          /* Pages Grid */
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
            <motion.div
              key={page.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer transition-all hover:shadow-xl"
              onClick={() => setSelectedPage(selectedPage === page.id ? null : page.id)}
            >
              {/* Page Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3" dir="ltr">
                  <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(page.status)}`}></span>
                  <span className="text-sm font-medium text-gray-500">{getStatusLabel(page.status)}</span>
                </div>
                <Home className="text-gray-400 w-5 h-5" />
              </div>

              {/* Page Info */}
              <div className="text-right" dir="rtl">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{page.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{page.description}</p>
                <p className="text-xs text-gray-500 mb-4">נתיב: {page.path}</p>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4" dir="rtl">
                {page.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {page.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                    +{page.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Expanded Content */}
              {selectedPage === page.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4 mt-4"
                >
                  <div className="text-right" dir="rtl">
                    <h4 className="font-semibold text-gray-800 mb-2">רכיבים:</h4>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {page.components.map((component) => (
                        <span
                          key={component}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                        >
                          {component}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-semibold text-gray-800 mb-2">כל הטכנולוגיות:</h4>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {page.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex space-x-3 pt-2" dir="ltr">
                      <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <FileText className="w-4 h-4" />
                        <span>תיעוד</span>
                      </button>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <ExternalLink className="w-4 h-4" />
                        <span>לדף</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Last Modified */}
              <div className="text-xs text-gray-400 mt-4 text-right" dir="rtl">
                עודכן לאחרונה: {page.lastModified}
              </div>
            </motion.div>
          ))}
          </motion.div>
        ) : (
          /* Tree View */
          <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6" dir="ltr">
              <TreePine className="text-blue-600 w-6 h-6" />
              <h3 className="text-xl font-bold text-gray-800">עץ היררכיית הדפים</h3>
            </div>
            
            <div className="space-y-1">
              {tree.map((node) => (
                <TreeNodeComponent
                  key={node.id}
                  node={node}
                  onToggle={toggleNode}
                  onSelect={setSelectedPage}
                  selectedId={selectedPage}
                  getIcon={getIconForType}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-right" dir="rtl">מקרא</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { status: 'completed', label: 'דף הושלם ופעיל', color: 'green' },
              { status: 'in-progress', label: 'דף בפיתוח', color: 'yellow' },
              { status: 'planned', label: 'דף מתוכנן לעתיד', color: 'blue' }
            ].map((item) => (
              <div key={item.status} className="flex items-center space-x-3" dir="ltr">
                <span className={`w-3 h-3 rounded-full bg-${item.color}-500`}></span>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// רכיב עץ הירארכי
interface TreeNodeProps {
  node: TreeNode;
  onToggle: (nodeId: string) => void;
  onSelect: (nodeId: string) => void;
  selectedId: string | null;
  getIcon: (type: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

function TreeNodeComponent({ node, onToggle, onSelect, selectedId, getIcon, getStatusColor }: TreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = node.expanded;
  const isSelected = selectedId === node.id;

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50 border border-blue-200' : ''
        }`}
        style={{ paddingRight: `${node.level * 20 + 12}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* Expand/Collapse Button */}
        <div className="w-5 h-5 mr-2 flex items-center justify-center">
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
              className="w-4 h-4 rounded hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Icon */}
        <div className="mr-2 text-gray-500">
          {getIcon(node.type)}
        </div>

        {/* Status Indicator */}
        <div className={`w-2 h-2 rounded-full mr-3 ${getStatusColor(node.status)}`}></div>

        {/* Name and Path */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate" dir="rtl">
            {node.name}
          </div>
          {node.path !== '/' && (
            <div className="text-xs text-gray-500 truncate" dir="ltr">
              {node.path}
            </div>
          )}
        </div>

        {/* Type Badge */}
        <div className={`px-2 py-1 rounded-md text-xs font-medium ml-2 ${
          node.type === 'section' ? 'bg-purple-100 text-purple-800' :
          node.type === 'page' ? 'bg-blue-100 text-blue-800' :
          node.type === 'api' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {node.type === 'section' ? 'סקציה' :
           node.type === 'page' ? 'דף' :
           node.type === 'api' ? 'API' : 'רכיב'}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
              getIcon={getIcon}
              getStatusColor={getStatusColor}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
