'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  FolderOpen, 
  Settings, 
  Code, 
  Database, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Map,
  GitBranch,
  Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'דף הבית',
    icon: <Home size={20} />,
    href: '/',
  },
  {
    id: 'projects',
    label: 'פרויקטים',
    icon: <FolderOpen size={20} />,
    href: '/projects',
    badge: 3,
  },
  {
    id: 'archived',
    label: 'ארכיון',
    icon: <Archive size={20} />,
    href: '/archived',
  },
  {
    id: 'development',
    label: 'פיתוח',
    icon: <Code size={20} />,
    href: '/development',
  },
  {
    id: 'database',
    label: 'בסיס נתונים',
    icon: <Database size={20} />,
    href: '/database',
  },
  {
    id: 'team',
    label: 'צוות',
    icon: <Users size={20} />,
    href: '/team',
  },
  {
    id: 'project-map',
    label: 'מפת הפרוייקט',
    icon: <GitBranch size={20} />,
    href: '/project-map',
  },
  {
    id: 'guide-for-ai',
    label: 'המדריך ל-AI',
    icon: <Code size={20} />,
    href: '/guide-for-ai',
  },
  {
    id: 'settings',
    label: 'הגדרות',
    icon: <Settings size={20} />,
    href: '/settings',
  },
];

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  // עדכון activeItem בהתאם לנתיב הנוכחי
  useEffect(() => {
    const currentItem = menuItems.find(item => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.id);
    }
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarVariants = {
    expanded: {
      width: isMobile ? '100vw' : '280px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: isMobile ? '0px' : '80px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className={`
          fixed top-0 left-0 h-full bg-sidebar-bg border-r border-gray-700 
          z-50 flex flex-col shadow-2xl overflow-hidden
          ${isMobile ? 'md:relative' : 'relative'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="text-white" size={16} />
                </div>
                <div>
                  <h1 className="text-sidebar-text font-bold text-lg">Dev Platform</h1>
                  <p className="text-gray-400 text-xs">bflow.co.il</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
          >
            {isMobile ? (
              isCollapsed ? <Menu className="text-sidebar-text" size={20} /> : <X className="text-sidebar-text" size={20} />
            ) : (
              isCollapsed ? <ChevronRight className="text-sidebar-text" size={20} /> : <ChevronLeft className="text-sidebar-text" size={20} />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                router.push(item.href);
              }}
              className={`
                w-full flex items-center p-3 rounded-lg transition-all duration-200
                ${activeItem === item.id 
                  ? 'bg-sidebar-accent text-white shadow-lg' 
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                }
                ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="flex items-center justify-between w-full"
                  >
                    <span className="font-medium text-right" dir="rtl">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="text-center"
              >
                <p className="text-gray-400 text-xs" dir="rtl">
                  פלטפורמת פיתוח מתקדמת
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  v1.0.0
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
