'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <html lang="he" dir="rtl">
      <head>
        <title>Dev Platform - bflow.co.il</title>
        <meta name="description" content="פלטפורמת פיתוח מתקדמת עבור dev.bflow.co.il" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="overflow-hidden">
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <Sidebar 
            isCollapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />
          
          {/* Main Content */}
          <main 
            className={`
              flex-1 overflow-auto transition-all duration-300 ease-in-out
              ${sidebarCollapsed 
                ? 'md:ml-20' 
                : 'md:ml-[280px]'
              }
              ml-0
            `}
          >
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

