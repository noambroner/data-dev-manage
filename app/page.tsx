'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Rocket, 
  Code2, 
  Zap,
  ArrowLeft,
  Heart 
} from 'lucide-react';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute top-40 right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '4s' }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        {/* Welcome Message */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Sparkles className="text-yellow-400 w-16 h-16" />
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
          dir="rtl"
        >
          ברוך הבא!
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-2 mb-8"
          dir="rtl"
        >
          <Heart className="text-red-400 w-6 h-6" />
          <p className="text-2xl md:text-3xl text-blue-200 font-light">
            לפלטפורמת הפיתוח המתקדמת
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12 border border-white/20 shadow-2xl max-w-2xl"
        >
          <div className="flex items-center justify-center space-x-4 mb-6" dir="ltr">
            <Code2 className="text-blue-400 w-8 h-8" />
            <span className="text-white text-2xl font-semibold">dev.bflow.co.il</span>
            <Rocket className="text-purple-400 w-8 h-8" />
          </div>
          
          <p className="text-blue-100 text-lg leading-relaxed" dir="rtl">
            פלטפורמה חדשנית לניהול פרויקטים, פיתוח קוד, וניהול צוותים. 
            <br />
            כל מה שאתה צריך למסע הפיתוח שלך במקום אחד.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-blue-300/30 shadow-xl"
          >
            <Code2 className="text-blue-400 w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-white font-semibold text-lg mb-2" dir="rtl">פיתוח מתקדם</h3>
            <p className="text-blue-200 text-sm" dir="rtl">כלים מתקדמים לפיתוח ועריכת קוד</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-300/30 shadow-xl"
          >
            <Rocket className="text-purple-400 w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-white font-semibold text-lg mb-2" dir="rtl">ניהול פרויקטים</h3>
            <p className="text-purple-200 text-sm" dir="rtl">מעקב ושליטה מלאה על הפרויקטים</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-lg rounded-xl p-6 border border-indigo-300/30 shadow-xl"
          >
            <Zap className="text-indigo-400 w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-white font-semibold text-lg mb-2" dir="rtl">ביצועים מהירים</h3>
            <p className="text-indigo-200 text-sm" dir="rtl">טכנולוגיות מתקדמות לביצועים מעולים</p>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="mt-12"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
            dir="rtl"
          >
            <span>התחל עכשיו</span>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Version Info */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <p className="text-white/60 text-sm" dir="rtl">
            גרסה 1.0.0 • פותח עם ❤️ בישראל
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

