'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code2, 
  Folder, 
  GitBranch, 
  Zap, 
  Database,
  Globe,
  Terminal,
  FileText,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Settings
} from 'lucide-react';

export default function GuideForAI() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['session-continuity', 'when-to-stop', 'overview', 'structure', 'next14-architecture', 'troubleshooting', 'sidebar', 'common-mistakes']));

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
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

  const sections = [
    {
      id: 'session-continuity',
      title: '🚨 התמשכות בין Sessions - חובה לקרוא!',
      icon: <AlertTriangle className="w-5 h-5" />,
              content: `
# 🚨 התמשכות בין Sessions - מדריך קריטי!

## 🛑 STOP! קרא את זה לפני כל פעולה!

**🚨 כלל זהב #1: אל תעשה שינויים גדולים בלי אישור מפורש!**
**🚨 כלל זהב #2: אם יש בעיה - עצור ושאל, אל תנסה לתקן בכוח!**
**🚨 כלל זהב #3: כל שינוי = שאלה ראשונה: "זה יכול לשבור משהו?"**

## ⚠️ אזהרה קריטית - לפני כל עבודה!

**כשאתה מתחיל session חדש, תמיד תבדוק מה הסטטוס הנוכחי!**
**אל תניח שאתה יודע מה קיים - תמיד תבדוק!**

## 1. צעדים חובה לפני תחילת עבודה:

\`\`\`bash
# 1. בדיקת מצב האתר הנוכחי - תמיד ראשון!
curl -I https://dev.bflow.co.il
curl -I https://dev.bflow.co.il/projects
curl -I https://dev.bflow.co.il/project-map
curl -I https://dev.bflow.co.il/guide-for-ai

# 2. בדיקת מה רץ על השרת היעד  
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "ps aux | grep node"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "systemctl status nginx"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "netstat -tlnp | grep :3000"

# 3. בדיקת מבנה פרויקט נוכחי
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "ls -la /home/ploi/dev.bflow.co.il/"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "ls -la /home/ploi/dev.bflow.co.il/app/"

# 4. בדיקת לוגים לפני שינויים
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "tail -20 /tmp/nextjs.log"

# 5. יצירת BACKUP מלא לפני שינויים
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "tar -czf /tmp/backup-\$(date +%Y%m%d-%H%M%S).tar.gz /home/ploi/dev.bflow.co.il/"

# 6. רק אחרי הבדיקות - התחל לעבוד
\`\`\`

## 2. בדיקת מה כבר קיים בפרויקט:

**בדוק את מפת הפרויקט:** https://dev.bflow.co.il/project-map

\`\`\`bash
ls -la app/              # אילו דפים כבר קיימים
ls -la components/       # אילו רכיבים כבר יש
git log --oneline -10    # מה השינויים האחרונים
\`\`\`

## 3. זיהוי סוג האתר הקיים:

- **🔍 Next.js App:** יש תיקיית \`app/\` עם \`layout.tsx\`
- **🔍 אתר סטטי:** יש \`index.html\` בתיקיית root
- **🔍 React SPA:** יש \`public/index.html\` ו-\`src/\`
- **🔍 וורדפרס:** יש \`wp-config.php\`

**⚠️ אל תחליף סוג אתר בלי אישור מפורש!**

## 4. תהליך deployment בטוח:

1. **✅ צ'ק 1:** יצירת backup מלא
2. **✅ צ'ק 2:** בדיקה שהשינוי עובד מקומית
3. **✅ צ'ק 3:** העלאה לתיקיית staging קודם
4. **✅ צ'ק 4:** בדיקה שהאתר עובד אחרי העלאה
5. **✅ צ'ק 5:** רק אז החלפה ל-production

## 📋 Check List לפני deployment:

- ☐ בדקתי מה קיים כרגע באתר
- ☐ יצרתי backup מלא
- ☐ בדקתי שהשינוי עובד מקומית
- ☐ וידאתי שאני לא הורס מה שקיים
- ☐ יש לי תוכנית rollback אם משהו ישתבש

## 🔥 דוגמאות לטעויות חמורות:

❌ **לא לעשות:** "אני אתחיל דף projects חדש"
✅ **כן לעשות:** "אבדוק אם כבר יש דף projects, ואוסיף עליו"

❌ **לא לעשות:** להעלות Next.js על אתר סטטי בלי לשאול
✅ **כן לעשות:** לשאול "רואה שיש index.html, לעדכן אותו או ליצור Next.js?"

❌ **לא לעשות:** deployment ישיר לproduction
✅ **כן לעשות:** backup → staging → בדיקה → production
`
    },
    {
      id: 'overview',
      title: 'סקירה כללית של הפרויקט',
      icon: <BookOpen className="w-5 h-5" />,
      content: `
# פלטפורמת הפיתוח dev.bflow.co.il

## מטרת הפרויקט
פלטפורמה מתקדמת לניהול פרויקטים ופיתוח, הבנויה עם Next.js 14 ו-TypeScript.
הפלטפורמה מתמחה בכלי פיתוח, ניהול צוותים, ותיעוד מקיף.

## כתובת האתר
- Production: https://dev.bflow.co.il
- מפת הפרויקט: https://dev.bflow.co.il/project-map

## תכונות עיקריות
- ממשק משתמש מתקדם עם תמיכה מלאה בעברית (RTL)
- מערכת ניווט דינמית עם sidebar מתקפל
- **דף ניהול פרויקטים** - מלא! עם חיפוש, סינון, סטטיסטיקות וארכיון
- **מפת פרויקט דינמית** - קוראת נתונים מ-PostgreSQL בזמן אמת
- **מערכת ארכיון מלאה** - פרויקטים ארכיביים בדף נפרד
- **כפתור עדכון מיפוי** - מעדכן את מפת הפרויקט מהDB
- מדריך מקיף לסוכני AI עם troubleshooting
- בסיס נתונים SQLite מובנה  
- אנימציות מתקדמות עם Framer Motion
- עיצוב רספונסיבי מושלם
`
    },
    {
      id: 'structure',
      title: 'מבנה הפרויקט',
      icon: <Folder className="w-5 h-5" />,
      content: `
# מבנה תיקיות וקבצים

\`\`\`
cursor-plugin/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout ראשי עם Sidebar
│   ├── page.tsx                 # דף הבית
│   ├── projects/                # 🔥 ניהול פרויקטים - Server+Client!
│   │   ├── page.tsx            #   Server Component (Dynamic)
│   │   ├── ProjectsClientComponent.tsx  # Client Component
│   │   └── [id]/page.tsx       #   דף פרויקט יחיד (Dynamic route)
│   ├── archived/                # 🆕 דף פרויקטים בארכיון
│   │   └── page.tsx            #   הצגת פרויקטים ארכיביים
│   ├── project-map/             # 🔥 מפת פרויקט דינמית
│   │   ├── page.tsx            #   Server Component (קורא מ-PostgreSQL)
│   │   └── ProjectMapClient.tsx #   Client Component
│   ├── guide-for-ai/            # המדריך הזה
│   │   └── page.tsx
│   └── api/                     # 🆕 API Routes - PostgreSQL Integration
│       ├── projects/            #   APIs לניהול פרויקטים
│       │   ├── route.ts        #   GET/POST לכל הפרויקטים
│       │   ├── [id]/route.ts   #   GET/PUT/DELETE לפרויקט יחיד
│       │   ├── [id]/archive/   #   API להעברה לארכיון
│       │   │   └── route.ts
│       │   └── archived/       #   API לפרויקטים בארכיון
│       │       └── route.ts
│       └── project-map/         #   API עדכון מפת פרויקט
│           └── update/
│               └── route.ts    #   מעדכן מפה עם נתונים מה-DB
├── components/                   # רכיבי React
│   ├── Sidebar.tsx              # תפריט ניווט (+ קישור ארכיון)
│   ├── ProjectCard.tsx          # כרטיס פרויקט
│   └── CreateProjectForm.tsx    # טופס יצירת פרויקט
├── lib/                         # 🔥 PostgreSQL Integration
│   ├── db.ts                    # PostgreSQL queries (queries object)
│   └── types.ts                 # TypeScript definitions
├── styles/                      # סטיילים
│   └── globals.css              # CSS גלובלי + Tailwind
├── project-map/                 # תיעוד הפרויקט
│   ├── home/
│   │   ├── purpose.md           # מטרת דף הבית
│   │   └── technical.md         # תיעוד טכני
│   ├── projects/                # 🔥 תיעוד מעודכן
│   │   ├── purpose.md           # כולל ארכיון ומיפוי
│   │   └── technical.md         # Server+Client ארכיטקטורה
│   ├── project-map/
│   │   ├── purpose.md
│   │   └── technical.md
│   └── guide-for-ai/
│       ├── purpose.md
│       └── technical.md
├── scripts/                    # סקריפטי deployment
│   ├── deploy.sh               # פריסה לשרת
│   └── setup-ssh.sh            # הגדרת SSH (noamp14_bflow)
└── public/                     # קבצים סטטיים

# 🔥 מאפיינים מתקדמים:
- Server Components קוראים ישירות מ-PostgreSQL
- Client Components מטפלים ב-UI ואינטראקציות
- export const dynamic = 'force-dynamic' בכל הדפים הדינמיים
- מערכת ארכיון מלאה עם APIs ייעודיים
- כפתור "עדכן מיפוי פרויקט" מעדכן מה-DB
\`\`\`
`
    },
    {
      id: 'technologies',
      title: 'טכנולוגיות ותלויות',
      icon: <Zap className="w-5 h-5" />,
      content: `
# סטק טכנולוגי

## Core Framework
- **Next.js 14.2.32** - Framework ראשי עם App Router
- **React 18.2.0** - ספריית UI
- **TypeScript 5.3.3** - Type safety מלא

## Styling & UI
- **Tailwind CSS 3.4.0** - Framework CSS utility-first
- **Framer Motion 10.16.16** - אנימציות מתקדמות
- **Lucide React 0.295.0** - ספריית איקונים מודרנית

## Database
- **PostgreSQL** - בסיס נתונים ראשי (production)
- **Connection:** Environment variables ב-.env.local
- **Schema:** projects (עם מערכת ארכיון מלאה), users, activities
- **Archive System:** archived, archived_at columns
- **Dynamic Data:** Server Components קוראים ישירות מהDB

## Development Tools
- **PostCSS 8.4.32** - מעבד CSS
- **Autoprefixer 10.4.16** - תמיכה בדפדפנים
- **ESLint** - בדיקת קוד

## Deployment
- **PM2** - ניהול תהליכים
- **Nginx** - Web server עם HTTP/2
- **Let's Encrypt** - SSL certificates
- **PLOI** - ניהול שרת
`
    },
    {
      id: 'sidebar',
      title: 'הוספת פריטים לסיידבר',
      icon: <GitBranch className="w-5 h-5" />,
      content: `
# איך להוסיף פריט חדש לתפריט הצידי

## דוגמה מלאה: הוספת "אפיון דף"

### שלב 1: יבוא האייקון
ערוך את הקובץ \`components/Sidebar.tsx\` והוסף יבוא חדש:

\`\`\`typescript
import { 
  Home, 
  FolderOpen, 
  Users,
  Settings,
  GitBranch,
  Code,
  FileText,    // <-- הוסף את זה לאפיון דף
  // ... שאר האייקונים
} from 'lucide-react';
\`\`\`

### שלב 2: הוספה למערך menuItems
מצא את המערך \`menuItems\` והוסף פריט חדש:

\`\`\`typescript
const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'דף הבית',
    icon: <Home size={20} />,
    href: '/',
  },
  // ... פריטים קיימים
  {
    id: 'page-spec',           // מזהה ייחודי
    label: 'אפיון דף',         // שם בעברית
    icon: <FileText size={20} />, // האייקון החדש
    href: '/page-spec',        // נתיב הדף
  },
  {
    id: 'settings',
    label: 'הגדרות',
    icon: <Settings size={20} />,
    href: '/settings',
  },
];
\`\`\`

### שלב 3: יצירת הדף החדש
צור תיקייה \`app/page-spec/\` ובתוכה \`page.tsx\`:

\`\`\`typescript
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PageSpec() {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6" dir="rtl">
          אפיון דף
        </h1>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4" dir="rtl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור הדף
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows={6}
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תמונה
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              dir="ltr"
            >
              שמור אפיון
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
\`\`\`

### שלב 4: הוספה למפת הפרויקט
עדכן את \`app/project-map/page.tsx\` והוסף את הדף החדש:

\`\`\`typescript
{
  id: 'page-spec',
  name: 'אפיון דף',
  path: '/page-spec',
  description: 'כלי לאפיון ותיעוד דפים עם טקסט ותמונות',
  status: 'completed',
  lastModified: '2025-08-20',
  technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
  components: ['PageSpecForm', 'FileUpload'],
  parent: 'root',
  level: 1,
  type: 'page'
},
\`\`\`

### ⚠️ כללים חובה:
1. **עקוב אחר המבנה הקיים** - אל תשנה שמות או מבנה
2. **השתמש באותם צבעים ופונטים** - Tailwind classes קיימים
3. **הוסף אנימציות Framer Motion** - motion.div עם fade-in
4. **תמיכה RTL מלאה** - dir="rtl" לעברית
5. **רספונסיבי** - max-w-4xl mx-auto וכו'
`
    },
    {
      id: 'pages',
      title: 'יצירת דף חדש',
      icon: <FileText className="w-5 h-5" />,
      content: `
# איך ליצור דף חדש

## שלב 1: יצירת התיקייה
\`\`\`bash
mkdir -p app/new-page-name
\`\`\`

## שלב 2: יצירת קובץ הדף
צור קובץ \`app/new-page-name/page.tsx\`:

\`\`\`typescript
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function NewPageName() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-6" dir="rtl">
          כותרת הדף
        </h1>
        {/* תוכן הדף */}
      </motion.div>
    </div>
  );
}
\`\`\`

## שלב 3: הוספה לסיידבר
עקב אחר ההוראות בסעיף "הוספת פריטים לסיידבר"

## שלב 4: תיעוד
צור תיקייה \`project-map/new-page-name/\` ובתוכה:
- \`purpose.md\` - מטרת הדף
- \`technical.md\` - תיעוד טכני
`
    },
    {
      id: 'project-map',
      title: 'מפת הפרויקט',
      icon: <Globe className="w-5 h-5" />,
      content: `
# מפת הפרויקט - מרכז המידע

## גישה למפה
**חובה לכל סוכן AI:** בקר ב-https://dev.bflow.co.il/project-map לפני עבודה על הפרויקט!

## מה תמצא במפת הפרויקט:
- **סקירה כוללת** של כל הדפים והסקציות
- **תצוגת עץ הירארכי** - מבנה מלא של הפלטפורמה
- **סטטוס פיתוח** - מה הושלם, בפיתוח, או מתוכנן
- **טכנולוגיות** - רשימת כל הטכנולוגיות לכל דף
- **רכיבים** - כל הרכיבים בשימוש
- **חיפוש מתקדם** - מצא כל מידע במהירות

## תצוגות זמינות:
1. **תצוגת כרטיסים** - פרטים מפורטים לכל דף
2. **תצוגת עץ** - מבנה הירארכי מלא

## איך להשתמש:
1. לחץ על "עץ" למבנה הירארכי
2. השתמש בחיפוש למציאת דפים ספציפיים
3. לחץ על כל פריט לפרטים נוספים
`
    },
    {
      id: 'deployment',
      title: 'deployment ופריסה',
      icon: <Terminal className="w-5 h-5" />,
      content: `
# פריסה לשרת

## שרת Production
- **כתובת:** 95.179.254.156
- **משתמש:** ploi
- **SSH Key:** ~/.ssh/noamp14_bflow (לא ploi_dev_bflow!)
- **ניהול:** PLOI platform
- **SSL:** Let's Encrypt (אוטומטי)
- **Database:** PostgreSQL (לא SQLite!)

## פקודות פריסה מהירה:

### בנייה מקומית:
\`\`\`bash
npm run build
\`\`\`

### פריסה לשרת:
\`\`\`bash
./scripts/deploy.sh
\`\`\`

### הגדרת SSH (פעם אחת):
\`\`\`bash
./scripts/setup-ssh.sh
\`\`\`

## ניהול PM2 בשרת:
\`\`\`bash
# התחברות לשרת
ssh ploi@95.179.254.156

# סטטוס האפליקציה
pm2 list

# הפעלה מחדש
pm2 restart dev-platform

# לוגים
pm2 logs dev-platform
\`\`\`

## מבנה השרת:
- **אפליקציה:** /home/ploi/dev.bflow.co.il/app/
- **לוגים:** /home/ploi/dev.bflow.co.il/logs/
- **נתונים:** /home/ploi/dev.bflow.co.il/app/data/
`
    },
    {
      id: 'common-mistakes',
      title: 'טעויות נפוצות - אל תעשה את זה!',
      icon: <ExternalLink className="w-5 h-5" />,
      content: `
# טעויות נפוצות שסוכני AI עושים

## ❌ טעויות חמורות להימנע מהן:

### 1. **לא קריאת מפת הפרויקט**
- ❌ מתחילים לעבוד בלי לבקר ב-/project-map
- ✅ **תמיד קודם בקר במפת הפרויקט!**

### 2. **המצאת טכנולוגיות חדשות**
- ❌ מציעים Prisma, MongoDB, Redux
- ✅ **השתמש רק ב-SQLite + better-sqlite3**

### 3. **שינוי מבנה קבצים**
- ❌ יוצרים תיקיות lib/components חדשות
- ✅ **עקוב אחר המבנה הקיים: app/, components/, lib/**

### 4. **התעלמות מ-RTL**
- ❌ שוכחים dir="rtl" לעברית
- ✅ **כל טקסט עברי צריך dir="rtl"**

### 5. **שינוי מוסכמות עיצוב**
- ❌ מציעים צבעים או פונטים חדשים
- ✅ **השתמש בכיתות Tailwind הקיימות**

### 6. **לא מעדכנים מפת הפרויקט**
- ❌ יוצרים דף חדש ושוכחים להוסיף למפה
- ✅ **כל דף חדש חייב להיות במפת הפרויקט**

### 7. **התעלמות מאנימציות**
- ❌ יוצרים דפים סטטיים ללא motion
- ✅ **תמיד הוסף Framer Motion animations**

## ✅ דוגמאות לתשובות נכונות:

### כשנשאל "איך להוסיף פריט לסיידבר":
**טוב:** "אערוך את components/Sidebar.tsx ואוסיף פריט למערך menuItems..."
**רע:** "אציע לך כמה מסלולים שונים לפיתוח..."

### כשנשאל על בסיס נתונים:
**טוב:** "נשתמש ב-SQLite עם better-sqlite3 כמו שכבר מוגדר"
**רע:** "אני ממליץ על MongoDB או Prisma..."

### כשנשאל על עיצוב:
**טוב:** "נשתמש ב-Tailwind classes: bg-gradient-to-br from-slate-50 to-blue-50"
**רע:** "נוסיף CSS custom או נשנה את הצבעים..."

## 🎯 אלגוריתם עבודה נכון:

1. **קרא את השאלה** 
2. **בדוק במפת הפרויקט** אם יש דף דומה
3. **חפש במדריך** את הסעיף הרלוונטי  
4. **עקוב אחר הדוגמה** בדיוק
5. **אל תמציא דברים חדשים!**

## 📋 רשימת בדיקה לפני תשובה:

- [ ] קראתי את מפת הפרויקט?
- [ ] השתמשתי רק בטכנולוגיות קיימות?
- [ ] עקבתי אחר מבנה הקבצים?
- [ ] הוספתי dir="rtl" לעברית?
- [ ] השתמשתי ב-Framer Motion?
- [ ] עדכנתי את מפת הפרויקט?
- [ ] נתתי תשובה ספציפית לשאלה?

## 🚨 אם אתה לא בטוח:
**עצור ובקש הבהרה במקום להמציא!**
`
    },
    {
      id: 'next14-architecture',
      title: '🏗️ Next.js 14 - Server + Client Components',
      icon: <Database className="w-5 h-5" />,
      content: `
# Next.js 14 ארכיטקטורה מתקדמת - החדשנות שלנו!

## 🚨 בעיית Static Rendering ופתרון מהפכני

### הבעיה שפתרנו:
❌ **דפים נבנו כסטטיים** ולא הציגו נתונים דינמיים:
\`\`\`
○ /projects     (Static)   - לא עובד!
○ /project-map  (Static)   - לא מעודכן!
\`\`\`

### הפתרון המהפכני:
✅ **Server + Client Components Architecture:**
\`\`\`
ƒ /projects     (Dynamic)  - עובד מושלם!
ƒ /project-map  (Dynamic)  - נתונים חיים!
\`\`\`

## 🏗️ המבנה החדש - Server + Client:

### Server Component (page.tsx):
\`\`\`typescript
import { queries } from '@/lib/db';
import ProjectsClientComponent from './ProjectsClientComponent';

// כפיית Dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server Component - קורא נתונים מהDB
export default async function ProjectsPage() {
  console.log('🔍 Server Component - Loading from DB...');
  
  try {
    // קריאה ישירה לDB במקום API
    const projects = await queries.getAllProjects();
    console.log('🔍 Server Component - Projects loaded:', projects.length);
    
    return <ProjectsClientComponent initialProjects={projects} />;
  } catch (error) {
    console.error('🚨 Server Component error:', error);
    return <ErrorComponent />;
  }
}
\`\`\`

### Client Component (ProjectsClientComponent.tsx):
\`\`\`typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectsClientComponentProps {
  initialProjects: Project[];
}

export default function ProjectsClientComponent({ initialProjects }: ProjectsClientComponentProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  
  // כל ה-UI והאינטראקציות כאן
  return (
    <motion.div>
      {/* UI components */}
    </motion.div>
  );
}
\`\`\`

## 🎯 יתרונות הארכיטקטורה החדשה:

1. **נתונים בזמן אמת** - Server קורא מהDB בכל טעינת דף
2. **ביצועים מעולים** - נתונים ראשוניים מגיעים מהשרת
3. **UI אינטראקטיבי** - Client Component מטפל באינטראקציות
4. **טעינה מהירה** - SSR עם hydration חכמה

## ⚡ כללי זהב לפיתוח עם Next.js 14:

### 1. כפיית Dynamic Rendering:
\`\`\`typescript
// בכל דף שצריך נתונים דינמיים
export const dynamic = 'force-dynamic';
export const revalidate = 0;
\`\`\`

### 2. חלוקת אחריות נכונה:
- **Server Component:** נתונים מ-DB, לוגיקה עסקית
- **Client Component:** UI, state management, אירועים

### 3. העברת נתונים:
\`\`\`typescript
// Server → Client דרך props
return <ClientComponent initialData={serverData} />;
\`\`\`

### 4. בדיקת Build Output:
\`\`\`bash
npm run build
# חפש:
ƒ /your-page    - טוב! (Dynamic)
○ /your-page    - רע! (Static)
\`\`\`

## 🚨 טעויות שתמנע:

❌ **לא לעשות:** רק Client Component עם useEffect
\`\`\`typescript
// זה לא יעבוד טוב
'use client';
export default function Page() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data').then(/* ... */);
  }, []);
  // ...
}
\`\`\`

✅ **כן לעשות:** Server + Client Combo
\`\`\`typescript
// Server Component
export default async function Page() {
  const data = await getDataFromDB();
  return <ClientComponent initialData={data} />;
}
\`\`\`

## 🔧 Troubleshooting Next.js 14:

### בעיה: דף לא מציג נתונים
\`\`\`bash
# בדיקה 1: האם זה Dynamic?
npm run build | grep "your-page"

# אם ○ (Static) - הוסף:
export const dynamic = 'force-dynamic';
\`\`\`

### בעיה: שגיאות hydration
\`\`\`bash
# כנראה יש מיקס של Server/Client rendering
# וודא ש-'use client' בקובץ הנכון
\`\`\`

### בעיה: נתונים לא מעודכנים
\`\`\`bash
# אולי עדיין cached - הוסף:
export const revalidate = 0;
\`\`\`

## 📋 Template לדף חדש דינמי:

\`\`\`typescript
import { queries } from '@/lib/db';
import YourClientComponent from './YourClientComponent';

// כפיית Dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function YourPage() {
  try {
    const data = await queries.getYourData();
    return <YourClientComponent initialData={data} />;
  } catch (error) {
    return <div>שגיאה בטעינת נתונים</div>;
  }
}
\`\`\`

**זה המבנה החדש שעובד מושלם עם PostgreSQL + Next.js 14!**
`,
    },
    {
      id: 'troubleshooting',
      title: '🔧 פתרון בעיות נפוצות',
      icon: <Settings className="w-5 h-5" />,
      content: `
# מדריך פתרון בעיות - חובה לקרוא!

## 🔥 בעיות deployment נפוצות

### 0. מפתח SSH הנכון - שינוי קריטי!
\`\`\`bash
# ⚠️ המפתח הנכון הוא: ~/.ssh/noamp14_bflow
# לא ploi_dev_bflow כמו שכתוב במדריכים ישנים!
ls -la ~/.ssh/noamp14_bflow                 # בדוק שהמפתח קיים
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "echo 'connection test'"

# אם עדיין אין, בדוק מה יש:
ls -la ~/.ssh/ | grep -E "(bflow|ploi|noam)"
\`\`\`

### 1. שרת לא מגיב / Error 500
\`\`\`bash
# בדיקה ראשונה
curl -I https://dev.bflow.co.il
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "tail -20 /tmp/nextjs.log"

# תיקון שלב 1: הפעלה מחדש של שרת
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "killall node"
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm start"
\`\`\`

### 2. EADDRINUSE: Port 3000 כבר תפוס - שכיח מאוד!
\`\`\`bash
# מציאת התהליך התוקע
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "ps aux | grep node"
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "ss -tulpn | grep :3000"

# פתרון מושלם - נבדק ועובד!
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "pkill -f node && fuser -k 3000/tcp && killall node 2>/dev/null || true"

# או צעד אחר צעד:
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "kill -9 \$(ss -tulpn | grep :3000 | awk '{print \$7}' | cut -d'=' -f2 | cut -d',' -f1)"
\`\`\`

### 2.1. בעיות Static vs Dynamic Rendering - חדש!
\`\`\`bash
# בדיקה אם הדף נבנה כ-Static במקום Dynamic
npm run build | grep "projects\\|project-map"

# אם רואה ○ (Static) במקום ƒ (Dynamic):
# הוסף בקובץ page.tsx:
export const dynamic = 'force-dynamic';
export const revalidate = 0;

# rebuild ו-restart:
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && pkill -f node && rm -rf .next && npm run build && npm start &"
\`\`\`

### 2.2. בעיות PostgreSQL Connection
\`\`\`bash
# בדיקת חיבור לDB:
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && node -e \"const { queries } = require('./lib/db.js'); queries.getAllProjects().then(p => console.log('DB OK:', p.length)).catch(e => console.error('DB Error:', e))\""

# אם יש שגיאה - בדוק .env.local:
ssh -i ~/.ssh/noamp14_bflow ploi@95.179.254.156 "cat /home/ploi/dev.bflow.co.il/.env.local"
\`\`\`

### 3. אלמנטים מוסתרים (opacity:0) - בעיית JavaScript
\`\`\`bash
# בדיקה אם CSS/JS קיימים
curl -I https://dev.bflow.co.il/_next/static/css/ff0c75b37bc80cb6.css
curl -s https://dev.bflow.co.il | grep -i "opacity:0" | wc -l

# פתרון: rebuild מלא
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && rm -rf .next node_modules"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm install && npm run build"
\`\`\`

### 4. 404 על דף חדש למרות build מוצלח
\`\`\`bash
# בדיקה אם הקבצים הועלו
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "ls -la /home/ploi/dev.bflow.co.il/app/"

# העלאה מחדש של קבצים חסרים
tar --exclude='.next' --exclude='node_modules' -czf update.tar.gz app/ project-map/
scp -i ~/.ssh/ploi_dev_bflow update.tar.gz ploi@95.179.254.156:/tmp/
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && tar -xzf /tmp/update.tar.gz"
\`\`\`

## ⚡ תהליך troubleshooting מהיר

### שלב 1: אבחון ראשוני
\`\`\`bash
curl -I https://dev.bflow.co.il                    # סטטוס עיקרי
curl -I https://dev.bflow.co.il/projects          # דף שנוסף
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "ps aux | grep node"  # תהליכים
\`\`\`

### שלב 2: בדיקת לוגים ושגיאות
\`\`\`bash
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "tail -20 /tmp/nextjs.log"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "systemctl status nginx"
\`\`\`

### שלב 3: תיקון מהיר (לרוב עובד)
\`\`\`bash
# עצירה מוחלטת של כל תהליכים
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "killall node 2>/dev/null || true"
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "fuser -k 3000/tcp 2>/dev/null || true"

# הפעלה מחדש
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm start"
\`\`\`

## ⚡ Deployment נכון של דף חדש - התהליך הפשוט!

**אל תחפש בעיות מורכבות - עקוב אחר השלבים האלה בדיוק:**

### שלב 1: הכנה (חובה!)
\`\`\`bash
# 1. בדיקת מפתח SSH הנכון
ls -la ~/.ssh/ | grep -E "(ploi|bflow|noam)"
# השתמש במפתח שמופיע (לא בploi_dev_bflow אם הוא לא קיים!)

# 2. יצירת backup
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "tar -czf /tmp/backup-\$(date +%Y%m%d-%H%M%S).tar.gz /home/ploi/dev.bflow.co.il/"
\`\`\`

### שלב 2: העלאת קבצים
\`\`\`bash
# יצירת ארכיון עם הקבצים החדשים בלבד
tar --exclude='.next' --exclude='node_modules' -czf new-page.tar.gz app/NEW-PAGE/ project-map/NEW-PAGE/

# העלאה לשרת
scp -i ~/.ssh/YOUR_KEY new-page.tar.gz ploi@95.179.254.156:/tmp/

# חילוץ בשרת
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && tar -xzf /tmp/new-page.tar.gz"
\`\`\`

### שלב 3: Build ו-Deploy
\`\`\`bash
# עצירת תהליכים קיימים
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "killall node 2>/dev/null || true"

# אם יש שגיאת TypeScript - תתקין types
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm install @types/better-sqlite3"

# build 
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm run build"

# הפעלה ברקע
ssh -i ~/.ssh/YOUR_KEY ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm start &"
\`\`\`

### שלב 4: אימות שהכל עובד
\`\`\`bash
# המתן שהשרת יתחיל
sleep 5

# בדיקה שהדף החדש עובד
curl -I https://dev.bflow.co.il/YOUR-NEW-PAGE
\`\`\`

**זהו! אם עקבת אחר השלבים - זה צריך לעבוד מהפעם הראשונה.**

## 🚑 אם הכל קרס - תיקון emergency

### מצב חירום מלא (בשימוש מתוחכם)
\`\`\`bash
# 1. backup קיים (אם יש)
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "tar -czf /tmp/emergency-backup.tar.gz /home/ploi/dev.bflow.co.il/"

# 2. ניקוי מלא
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && rm -rf .next node_modules package-lock.json"

# 3. החזרה לפעילות
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm install && npm run build && npm start"
\`\`\`

## 🧪 בדיקות אחרי תיקון

\`\`\`bash
# בדיקת כל הדפים החשובים
curl -I https://dev.bflow.co.il
curl -I https://dev.bflow.co.il/projects
curl -I https://dev.bflow.co.il/project-map  
curl -I https://dev.bflow.co.il/guide-for-ai

# בדיקת אלמנטים מוסתרים (צריך להיות 0!)
curl -s https://dev.bflow.co.il | grep -i "opacity:0" | wc -l
\`\`\`

## 🎯 כללי זהב לפתרון בעיות

1. **תמיד תתחיל בלוגים** - \`tail -20 /tmp/nextjs.log\`
2. **בדוק תהליכים תקועים** - \`ps aux | grep node\`  
3. **נקה לפני rebuild** - \`rm -rf .next node_modules\`
4. **אל תשכח לבדוק אחרי** - בדיקת כל הדפים
5. **יצירת backup לפני שינויים גדולים**

**זכור: רוב הבעיות נפתרות עם killall + npm start מחדש!**

## 🧠 איך לא להתבלבל - כללי זהב לAI

### ❌ מה לא לעשות:
1. **לא לחפש בעיות מורכבות** אם זה deployment ראשון
2. **לא לנסות 5 מפתחות SSH שונים** - תבדוק קודם מה קיים
3. **לא לרוץ על כל טעות קטנה** - @types/better-sqlite3 זה פתרון ידוע
4. **לא להמציא פתרונות חדשים** - יש תהליך סטנדרטי, תעקוב אחריו
5. **לא לעשות rebuild מלא** אם רק החסיר dependency אחד

### ✅ מה כן לעשות:
1. **עקוב אחר הסדר** - Backup → Upload → Build → Start → Test
2. **בדוק את הבסיס קודם** - האם יש מפתח? האם השרת עובד?
3. **פתור שגיאה אחת בכל פעם** - אל תנסה לתקן הכל ביחד
4. **השתמש ב"YOUR_KEY"** - זה אומר שאתה צריך למצוא את המפתח הנכון
5. **אם זה עובד - תעצור** - אל תחפש בעיות נוספות

### 🚨 הודעות שגיאה נפוצות ופתרונות מיידיים:

| שגיאה | פתרון מיידי |
|-------|-------------|
| "No such file ~/.ssh/ploi_dev_bflow" | \`ls ~/.ssh/\` ותמצא את המפתח האמיתי |
| "EADDRINUSE" | \`killall node\` ו-\`fuser -k 3000/tcp\` |
| "Cannot find module @types/better-sqlite3" | \`npm install @types/better-sqlite3\` |
| "502 Bad Gateway" | השרת לא רץ - \`npm start &\` |
| "404 על דף חדש" | \`npm run build\` ו-\`npm start\` מחדש |

### 💡 הכלל הפשוט:
**אם אתה עוקב אחר התהליך הסטנדרטי - זה עובד מהפעם הראשונה ב-95% מהמקרים!**
`
    },
    {
      id: 'when-to-stop',
      title: '🛑 מתי לעצור ולשאול - חובה לקרוא!',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `
# 🛑 מתי לעצור ולשאול - כללים קריטיים!

## 🚨 עצור מיד ושאל אם:

### 1. שינויים מסיביים:
❌ **"נעבור מ-SQLite ל-PostgreSQL"** = **עצור!** שאל: "זה ישבור את המערכת הקיימת?"
❌ **"נשנה את כל מערכת הנתונים"** = **עצור!** זה לא שינוי קטן!
❌ **"נמחק קבצים ונבנה מחדש"** = **עצור!** לא בלי אישור מפורש!

### 2. כשיש בעיות טכניות:
❌ **שגיאת חיבור לDB** = **עצור!** אל תנסה 20 דרכים לתקן
❌ **API מחזיר 500** = **עצור!** בדוק מה השגיאה, אל תנחש
❌ **פורט תפוס** = פתור פשוט עם killall, אל תעשה troubleshooting מורכב

### 3. כשאין לך ודאות:
❌ **"אולי המשתמש רוצה..."** = **עצור!** שאל במקום לנחש
❌ **"נעשה זאת לפי ההיגיון"** = **עצור!** עקוב אחר המדריך, לא אחר ההיגיון שלך

## ✅ מתי זה בסדר להמשיך:

### שינויים קטנים ובטוחים:
✅ הוספת דף חדש
✅ שינוי עיצוב קיים  
✅ תיקון באג קטן
✅ הוספת תכונה פשוטה לדף קיים

### פתרון בעיות פשוטות:
✅ killall node (פורט תפוס)
✅ npm install (dependency חסר)
✅ npm run build (אחרי שינוי קובץ)

## 🎯 האלגוריתם הנכון:

**השאלה:** "האם זה יכול לשבור משהו קיים?"
- אם כן = עצור ושאל
- אם לא = המשך (אבל בזהירות)

**השאלה:** "האם יש לי בעיה שאני לא מבין?"
- אם כן = עצור ושאל  
- אם לא = פתור צעד אחד ובדוק

## 🚫 דברים שאסור לעשות בלי אישור:

1. **החלפת טכנולוגיות** (SQLite לכיוון PostgreSQL)
2. **מחיקת קבצים/טבלאות קיימות**
3. **שינוי מבנה בסיס הנתונים**
4. **התקנת חבילות חדשות גדולות**
5. **שינוי הגדרות שרת/Nginx**
6. **יצירת API routes חדשים** (בלי אישור)

## 🎯 תווך ביניים טוב:

**במקום:** "אני אעשה מעבר מלא ל-PostgreSQL"
**תגיד:** "רואה שזה ישנה את כל מערכת הנתונים. זה יכול לשבור את המערכת הקיימת. האם אתה בטוח שרוצה להמשיך? זה ידרוש מחיקה מלאה של כל הנתונים הקיימים."

**במקום:** "יש לי שגיאת חיבור, אני אנסה 10 דרכים לתקן"
**תגיד:** "יש שגיאת חיבור ל-PostgreSQL. האם פרטי הגישה נכונים? האם הDB קיים? עדיף שתבדוק את זה לפני שאני אמשיך."

## 🔥 זכור:
**טוב יותר לשאול 3 שאלות מאשר לשבור דבר אחד!**
`
    },
    {
      id: 'conventions',
      title: 'מוסכמות קוד וסטיילים',
      icon: <Code2 className="w-5 h-5" />,
      content: `
# מוסכמות ועקרונות קוד

## עברית ו-RTL
- **כל הטקסטים בעברית** - ממשק המשתמש כולו בעברית
- **dir="rtl"** - להוסיף לכל div עם טקסט עברי
- **Flexbox/Grid** - לשים לב לכיוון RTL
- **פונטים:** Assistant (עברית), Inter (אנגלית)

## מוסכמות קבצים:
- **רכיבים:** PascalCase (\`MyComponent.tsx\`)
- **דפים:** kebab-case (\`my-page/page.tsx\`)
- **קבצי עזר:** camelCase (\`myHelper.ts\`)

## עיצוב Tailwind:
- **צבעים עיקריים:** blue-500, purple-600, indigo-500
- **רקעים:** gradient-to-br from-slate-50 to-blue-50
- **הצללות:** shadow-lg, shadow-xl
- **מעגלים:** rounded-xl (12px)

## אנימציות Framer Motion:
- **Stagger children:** 0.1-0.2s
- **Duration:** 0.3-0.6s
- **Ease:** easeOut
- **Hover effects:** scale: 1.02, y: -4

## TypeScript:
- **הכל מוגדר עם types**
- **interfaces** לאובייקטים מורכבים
- **enums** לערכים קבועים
- **strict mode** מופעל

## בסיס נתונים:
- **PostgreSQL** - בסיס נתונים ראשי (production)
- **Connection** - דרך environment variables
- **queries object** - ב-lib/db.ts לכל הפעולות
- **Archive system** - עמודות archived, archived_at
- **Server Components** - קריאה ישירה מהDB
- **Dynamic rendering** - export const dynamic = 'force-dynamic'
`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-4 mb-6" dir="ltr">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <div className="text-right" dir="rtl">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">המדריך המקיף לסוכני AI</h1>
              <p className="text-gray-600 text-lg">כל מה שצריך לדעת על פלטפורמת dev.bflow.co.il</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3" dir="ltr">
              <Zap className="text-red-600 w-5 h-5" />
              <div className="text-right" dir="rtl">
                <h3 className="font-semibold text-red-800">⚠️ חובה לקרוא בסדר זה!</h3>
                <p className="text-red-700 text-sm mt-1">
                  1. קרא את כל הסעיפים הפתוחים למטה (4 סעיפים חשובים)<br/>
                  2. בקר ב-<a href="/project-map" className="underline font-medium">מפת הפרויקט</a> לתמונה מלאה<br/>
                  3. קרא גם את "טכנולוגיות", "יצירת דף חדש" ו"מוסכמות"<br/>
                  4. עקוב אחר המוסכמות בדיוק - יש דוגמאות קוד מלאות!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3" dir="ltr">
              <Database className="text-blue-600 w-5 h-5" />
              <div className="text-right" dir="rtl">
                <h3 className="font-semibold text-blue-800">כלל זהב לפיתוח</h3>
                <p className="text-blue-700 text-sm mt-1">
                  🎯 <strong>תמיד עקוב אחר המבנה הקיים!</strong><br/>
                  🎯 <strong>השתמש בטכנולוגיות הקיימות בלבד!</strong><br/>
                  🎯 <strong>קרא את מפת הפרויקט לפני כל עבודה!</strong><br/>
                  🎯 <strong>יש דוגמאות קוד מלאות במדריך - השתמש בהן!</strong><br/>
                  🎯 <strong>🚨 BACKUP לפני כל deployment!</strong><br/>
                  🎯 <strong>🚨 בדוק מה קיים לפני שינויים!</strong><br/>
                  🎯 <strong>אל תמציא דרכים חדשות - יש כבר סטנדרט!</strong>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Section Header */}
              <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-3" dir="ltr">
                  <div className="text-blue-600">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                </div>
                
                <div className="flex items-center space-x-2" dir="ltr">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(section.content, section.id);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                    title="העתק תוכן"
                  >
                    {copiedSection === section.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </div>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 bg-gray-50">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed overflow-x-auto">
                      {section.content.trim()}
                    </pre>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-right" dir="rtl">קישורים מהירים</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'מפת הפרויקט', href: '/project-map', icon: <GitBranch className="w-4 h-4" /> },
              { label: 'דף הבית', href: '/', icon: <Globe className="w-4 h-4" /> },
              { label: 'GitHub (דמיוני)', href: '#', icon: <Code2 className="w-4 h-4" /> }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                dir="ltr"
              >
                <div className="text-blue-600">
                  {link.icon}
                </div>
                <span className="text-gray-800 font-medium">{link.label}</span>
                <ExternalLink className="w-3 h-3 text-gray-400 mr-auto" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-gray-500 text-sm" dir="rtl">
            מדריך זה עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
          </p>
          <p className="text-gray-400 text-xs mt-2" dir="rtl">
            פלטפורמת הפיתוח dev.bflow.co.il | גרסה 1.0.0
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
