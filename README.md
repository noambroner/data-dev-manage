# 🚀 Dev Platform - bflow.co.il

פלטפורמת פיתוח מתקדמת ומותאמת אישית עבור ניהול פרויקטים, צוותים ו-deployment מהיר.

## ✨ תכונות עיקריות

- 🏠 **דף בית מעוצב** עם ברוך הבא מהמם
- 📱 **סרגל ניווט דינמי** - ניתן להסתיר ולהציג למקסימום שטח עבודה
- 🗄️ **בסיס נתונים SQLite** מובנה ומהיר
- 🔐 **SSH Deployment** אוטומטי לשרת
- ⚡ **Next.js 14** עם TypeScript ו-Tailwind CSS
- 🎨 **ממשק משתמש מדהים** עם אנימציות מתקדמות
- 🌐 **תמיכה מלאה בעברית** ו-RTL

## 📋 דרישות מערכת

- Node.js 18+ 
- npm או yarn
- SSH access לשרת (אופציונלי לdeployment)

## 🛠️ התקנה מהירה

```bash
# שכפול הפרויקט
git clone <repository-url>
cd cursor-plugin

# התקנת dependencies
npm install

# הפעלה במצב פיתוח
npm run dev
```

האתר יהיה זמין בכתובת: http://localhost:3000

## 🗂️ מבנה הפרויקט

```
cursor-plugin/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout ראשי עם Sidebar
│   └── page.tsx           # דף הבית
├── components/            # רכיבי React
│   └── Sidebar.tsx        # סרגל ניווט דינמי
├── lib/                   # Utilities ובסיס נתונים
│   ├── db.ts             # הגדרות SQLite
│   └── types.ts          # הגדרות TypeScript
├── styles/               # סטיילים
│   └── globals.css       # CSS גלובלי
├── scripts/              # סקריפטי deployment
│   ├── deploy.sh         # דחיפה לשרת
│   └── setup-ssh.sh      # הגדרת SSH
├── data/                 # בסיס נתונים SQLite
└── public/               # קבצים סטטיים
```

## 🎨 עיצוב ותכונות UI

### סרגל ניווט דינמי
- **הסתרה/הצגה** - לחיצה על כפתור החץ
- **רספונסיבי** - התאמה אוטומטית למובייל
- **אנימציות חלקות** - מעברים עם Framer Motion
- **תמיכה בתגים** - מספרי התראות ותגיות

### דף הבית
- **גרדיאנט מתקדם** - רקע דינמי עם אלמנטים מרחפים
- **אנימציות מרהיבות** - כניסה מדורגת של אלמנטים
- **כרטיסי תכונות** - הצגה אינטראקטיבית של יכולות
- **תמיכה בעברית** - RTL מושלם

## 🗄️ בסיס נתונים

הפלטפורמה משתמשת ב-SQLite עם הטבלאות הבאות:

- **projects** - ניהול פרויקטים
- **users** - ניהול משתמשים וצוות
- **activities** - מעקב אחר פעילויות
- **configurations** - הגדרות מערכת
- **deployments** - מעקב deployments

### שימוש בבסיס הנתונים

```typescript
import { db, queries } from '@/lib/db';

// קבלת כל הפרויקטים
const projects = queries.getAllProjects.all();

// יצירת פרויקט חדש
queries.createProject.run(
  'שם הפרויקט',
  'תיאור',
  '/path/to/project',
  'https://github.com/user/repo',
  JSON.stringify(['react', 'nextjs']),
  JSON.stringify({ framework: 'nextjs' })
);
```

## 🚀 Deployment לשרת

### הגדרת SSH (פעם אחת)

```bash
# הפעלת סקריפט הגדרת SSH
./scripts/setup-ssh.sh
```

הסקריפט יבצע:
1. ✅ יצירת מפתח SSH חדש
2. ✅ הגדרת SSH config
3. ✅ הנחיות להעתקת המפתח לשרת
4. ✅ בדיקת חיבור

### דחיפה לשרת

```bash
# deployment לsproduction
./scripts/deploy.sh

# deployment לstaging (אם מוגדר)
./scripts/deploy.sh staging
```

תהליך ה-deployment כולל:
1. 🔨 בניית הפרויקט
2. 📦 יצירת ארכיון
3. ⬆️ העלאה לשרת
4. 🔄 עדכון קבצים
5. 🚀 הפעלת השירותים
6. ✅ בדיקת תקינות

## ⚙️ הגדרות סביבה

צור קובץ `.env.local` עם ההגדרות הבאות:

```bash
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
DATABASE_URL=./data/platform.db

# Deployment
DEPLOY_SERVER_HOST=dev.bflow.co.il
DEPLOY_SERVER_USER=deploy
DEPLOY_SERVER_PATH=/var/www/dev-platform
SSH_KEY_PATH=~/.ssh/bflow_deploy
```

## 📝 פקודות זמינות

```bash
# פיתוח
npm run dev          # הפעלה במצב פיתוח
npm run build        # בניית production
npm run start        # הפעלת production server
npm run lint         # בדיקת קוד

# Deployment
./scripts/setup-ssh.sh    # הגדרת SSH
./scripts/deploy.sh       # דחיפה לשרת
```

## 🔧 התאמה אישית

### הוספת דפים חדשים

1. צור קובץ חדש תחת `app/your-page/page.tsx`
2. הוסף לתפריט הניווט ב-`components/Sidebar.tsx`
3. עדכן את ה-routes ב-TypeScript types

### שינוי עיצוב

- **צבעים**: `tailwind.config.js`
- **פונטים**: `styles/globals.css`
- **קומפוננטים**: `components/`

### הוספת תכונות חדשות

1. הוסף טבלאות חדשות ב-`lib/db.ts`
2. הגדר Types ב-`lib/types.ts`
3. צור API routes תחת `app/api/`
4. בנה UI components תחת `components/`

## 🛡️ אבטחה

- ✅ HTTPS Only בproduction
- ✅ Security Headers מוגדרים
- ✅ SQL Injection Protection
- ✅ XSS Protection
- ✅ CSRF Protection

## 📊 ביצועים

- ⚡ SSR עם Next.js
- 🗜️ Gzip Compression
- 🚀 Static Asset Caching
- 📱 Progressive Web App Ready
- 🎯 Core Web Vitals Optimized

## 🆘 פתרון בעיות

### בעיות חיבור SSH
```bash
# בדיקת חיבור מפורטת
ssh -vvv -i ~/.ssh/bflow_deploy deploy@dev.bflow.co.il

# בדיקת הרשאות מפתח
chmod 600 ~/.ssh/bflow_deploy
chmod 644 ~/.ssh/bflow_deploy.pub
```

### בעיות בבניית הפרויקט
```bash
# מחיקת cache ובנייה מחדש
rm -rf .next node_modules
npm install
npm run build
```

### בעיות בבסיס הנתונים
```bash
# מחיקת בסיס הנתונים ויצירה מחדש
rm -f data/platform.db*
npm run dev  # יצור את הבסיס מחדש אוטומטית
```

## 🔄 עדכונים עתידיים

רעיונות לתכונות הבאות:
- [ ] מערכת authentication מלאה
- [ ] ניהול Git repositories
- [ ] Terminal מובנה
- [ ] Real-time collaboration
- [ ] Docker integration
- [ ] CI/CD pipelines
- [ ] Monitoring ו-analytics
- [ ] Mobile app

## 📞 תמיכה

לתמיכה או שאלות:
- 📧 Email: support@bflow.co.il
- 🌐 Website: https://dev.bflow.co.il
- 📱 Telegram: @bflow_support

---

**פותח עם ❤️ בישראל | Made with ❤️ in Israel**

גרסה 1.0.0 | © 2024 bflow.co.il

