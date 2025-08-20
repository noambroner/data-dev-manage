'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2,
  FileText,
  Zap,
  ChevronLeft
} from 'lucide-react';

export default function DevelopmentPage() {
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

  const tools = [
    {
      id: 'specification',
      title: 'אפיון',
      description: 'כלי לאפיון ותיעוד דרישות פרויקטים',
      icon: <FileText className="w-6 h-6" />,
      href: '/development/specification',
      color: 'blue',
      status: 'available'
    }
  ];

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
          <div className="flex items-center space-x-4 mb-6" dir="ltr">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Code2 className="text-white w-8 h-8" />
            </div>
            <div className="text-right" dir="rtl">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">מחלקת פיתוח</h1>
              <p className="text-gray-600 text-lg">כלים מתקדמים לפיתוח, אפיון וניהול פרויקטים טכנולוגיים</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'כלי פיתוח זמינים', value: tools.length, color: 'blue', icon: Code2 },
              { label: 'פרויקטים פעילים', value: 5, color: 'green', icon: Zap },
              { label: 'כלים בפיתוח', value: 3, color: 'purple', icon: FileText }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="text-right" dir="rtl">
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Development Tools Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-3 mb-6" dir="ltr">
            <Zap className="text-indigo-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-800">כלי פיתוח</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Tool Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-${tool.color}-100`}>
                    <div className={`text-${tool.color}-600`}>
                      {tool.icon}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2" dir="ltr">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tool.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tool.status === 'available' ? 'זמין' : 'בפיתוח'}
                    </span>
                  </div>
                </div>

                {/* Tool Content */}
                <div className="text-right" dir="rtl">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{tool.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tool.description}</p>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-${tool.color}-600 hover:bg-${tool.color}-700 text-white rounded-lg font-medium transition-colors`}
                  dir="ltr"
                >
                  <span dir="rtl">{tool.title}</span>
                  <ChevronLeft size={16} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="text-center py-8">
            <div className="flex items-center justify-center space-x-3 mb-4" dir="ltr">
              <Zap className="text-purple-600 w-8 h-8" />
              <h3 className="text-2xl font-bold text-gray-800">בקרוב</h3>
            </div>
            <p className="text-gray-600 mb-6" dir="rtl">
              כלים נוספים בפיתוח: עורך קוד מתקדם, מנהל Git, טרמינל משולב ועוד...
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { name: 'עורך קוד', icon: '💻' },
                { name: 'מנהל Git', icon: '🔀' },
                { name: 'טרמינל', icon: '⚡' }
              ].map((upcoming, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{upcoming.icon}</div>
                  <p className="text-sm text-gray-600 font-medium" dir="rtl">{upcoming.name}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
