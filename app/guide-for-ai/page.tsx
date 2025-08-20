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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['session-continuity', 'overview', 'structure', 'troubleshooting', 'sidebar', 'common-mistakes']));

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
- **דף ניהול פרויקטים** - חדש! עם חיפוש, סינון וסטטיסטיקות
- מפת פרויקט מפורטת עם תצוגת עץ הירארכי
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
│   ├── projects/                # דף ניהול פרויקטים - חדש!
│   │   └── page.tsx            #   פרויקטים עם חיפוש וסינון
│   ├── project-map/             # דף מפת הפרויקט
│   │   └── page.tsx
│   └── guide-for-ai/            # המדריך הזה
│       └── page.tsx
├── components/                   # רכיבי React
│   └── Sidebar.tsx              # תפריט ניווט צידי
├── lib/                         # ספריות ועזרים
│   ├── db.ts                    # הגדרות SQLite
│   └── types.ts                 # הגדרות TypeScript
├── styles/                      # סטיילים
│   └── globals.css              # CSS גלובלי + Tailwind
├── project-map/                 # תיעוד הפרויקט
│   ├── home/
│   │   ├── purpose.md           # מטרת דף הבית
│   │   └── technical.md         # תיעוד טכני
│   ├── projects/                # תיעוד דף פרויקטים - חדש!
│   │   ├── purpose.md           # מטרת דף הפרויקטים  
│   │   └── technical.md         # תיעוד טכני מפורט
│   ├── project-map/
│   │   ├── purpose.md
│   │   └── technical.md
│   └── guide-for-ai/
│       ├── purpose.md
│       └── technical.md
├── guide-for-ai/               # המדריך לסוכני AI
├── scripts/                    # סקריפטי deployment
│   ├── deploy.sh               # פריסה לשרת
│   └── setup-ssh.sh            # הגדרת SSH
├── data/                       # בסיס נתונים SQLite
└── public/                     # קבצים סטטיים
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
- **Better SQLite3 9.2.2** - בסיס נתונים מקומי
- **SQLite Schema** - טבלאות: projects, users, activities, configurations

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
- **ניהול:** PLOI platform
- **SSL:** Let's Encrypt (אוטומטי)

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
      id: 'troubleshooting',
      title: '🔧 פתרון בעיות נפוצות',
      icon: <Settings className="w-5 h-5" />,
      content: `
# מדריך פתרון בעיות - חובה לקרוא!

## 🔥 בעיות deployment נפוצות

### 1. שרת לא מגיב / Error 500
\`\`\`bash
# בדיקה ראשונה
curl -I https://dev.bflow.co.il
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "tail -20 /tmp/nextjs.log"

# תיקון שלב 1: הפעלה מחדש של שרת
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "killall node"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm start"
\`\`\`

### 2. EADDRINUSE: Port 3000 כבר תפוס
\`\`\`bash
# מציאת התהליך התוקע
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "ps aux | grep node"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "netstat -tlnp | grep :3000"

# פתרון מלא
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "fuser -k 3000/tcp"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "killall node 2>/dev/null || true"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "pkill -f 'node.*next'"
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
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "killall node 2>/dev/null || true"
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "fuser -k 3000/tcp 2>/dev/null || true"

# הפעלה מחדש
ssh -i ~/.ssh/ploi_dev_bflow ploi@95.179.254.156 "cd /home/ploi/dev.bflow.co.il && npm start"
\`\`\`

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
- **SQLite** - קובץ local
- **Better-sqlite3** - ספריית הגישה
- **Prepared statements** - לביצועים
- **Transaction safe** - לעדכונים מרובים
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
