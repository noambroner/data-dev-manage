# מפת הפרוייקט - תיעוד טכני

## 🏗️ מבנה טכני

### 📁 מיקום קבצים:
```
app/
└── project-map/
    └── page.tsx           # רכיב הדף הראשי

project-map/               # תיקיית התיעוד
├── home/
│   ├── purpose.md         # מטרת דף הבית
│   └── technical.md       # תיעוד טכני דף הבית
└── project-map/
    ├── purpose.md         # מטרת דף זה
    └── technical.md       # התיעוד הזה
```

### 🔧 טכנולוגיות ותלויות:

#### Core Framework:
- **Next.js 14.2.32** - App Router עם Server Components
- **React 18.2.0** - Hooks: useState, useEffect
- **TypeScript 5.3.3** - Type definitions מותאמות

#### Styling & UI:
- **Tailwind CSS 3.4.0** - Utility-first CSS framework
- **Framer Motion 10.16.16** - אנימציות מתקדמות:
  - `motion.div` containers
  - `variants` למעברים מורכבים
  - `staggerChildren` לאנימציה מדורגת

#### איקונים:
- **Lucide React 0.295.0** - איקונים בשימוש:
  - `Map` - איקון ראשי
  - `GitBranch` - סמל הפרוייקט
  - `FileText` - תיעוד
  - `Code2` - פיתוח
  - `Eye` - דפים פעילים
  - `FolderOpen` - ניהול
  - `ExternalLink` - קישורים חיצוניים
  - `Download` - ייצוא מידע

### 🎨 מבנה הרכיבים:

#### Main Component Structure:
```typescript
export default function ProjectMapPage() {
  // State Management
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Data Processing
  const filteredPages = pages.filter(/* filter logic */);

  // Animation Variants
  const containerVariants = { /* animation config */ };
  const itemVariants = { /* item animations */ };

  // Helper Functions
  const getStatusColor = (status: string) => { /* color mapping */ };
  const getStatusLabel = (status: string) => { /* label translation */ };

  return (
    // JSX Structure
  );
}
```

#### Data Interface:
```typescript
interface PageDocumentation {
  id: string;                    // מזהה ייחודי
  name: string;                  // שם בעברית
  path: string;                  // נתיב URL
  description: string;           // תיאור המטרה
  status: 'completed' | 'in-progress' | 'planned';
  lastModified: string;          // תאריך עדכון
  technologies: string[];        // רשימת טכנולוגיות
  components: string[];          // רכיבי UI
}
```

### 📱 Responsive Design:

#### Layout Strategy:
- **Mobile First** - עיצוב מתחיל ממובייל
- **CSS Grid** - layout ראשי עם 1-3 עמודות
- **Flexbox** - לאלמנטים פנימיים
- **Container Queries** - התאמה דינמית

#### Breakpoints:
```css
/* Mobile */
grid-cols-1          /* < 768px */

/* Tablet */
lg:grid-cols-2       /* 768px - 1024px */

/* Desktop */
xl:grid-cols-3       /* > 1024px */
```

### 🎭 אנימציות ואינטראקטיביות:

#### Framer Motion Animations:
```typescript
// Container Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1  // אנימציה מדורגת
    }
  }
};

// Item Animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};
```

#### Interactive Elements:
- **Card Hover**: `whileHover={{ scale: 1.02, y: -4 }}`
- **Click Animation**: `whileTap={{ scale: 0.98 }}`
- **Expand/Collapse**: height animation עם `animate`
- **Search**: real-time filtering עם debounce

### 🔍 חיפוש וסינון:

#### Search Implementation:
```typescript
const filteredPages = pages.filter(page =>
  page.name.includes(searchTerm) ||
  page.description.includes(searchTerm) ||
  page.technologies.some(tech => 
    tech.toLowerCase().includes(searchTerm.toLowerCase())
  )
);
```

#### Search Features:
- **Multi-field search** - שם, תיאור, טכנולוגיות
- **Case insensitive** - חיפוש ללא תלות ברישיות
- **Real-time results** - עדכון מיידי
- **Highlight matches** - (מתוכנן לעתיד)

### 📊 ניהול מידע:

#### Static Data Structure:
```typescript
const pages: PageDocumentation[] = [
  {
    id: 'home',
    name: 'דף הבית',
    path: '/',
    description: 'דף הכניסה הראשי...',
    status: 'completed',
    lastModified: '2025-08-20',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS'],
    components: ['Layout', 'HomePage', 'FeatureCards']
  },
  // ... דפים נוספים
];
```

#### Future Database Integration:
```typescript
// מתוכנן: חיבור לבסיס נתונים
const pages = await fetchPagesFromDB();
```

### 🎨 עיצוב ו-UI Components:

#### Status System:
```typescript
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-yellow-500'; 
    case 'planned': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};
```

#### Color Palette:
- **Status Colors**: ירוק (הושלם), צהוב (בפיתוח), כחול (מתוכנן)
- **Technology Tags**: כחול בהיר (`bg-blue-100`)
- **Component Tags**: ירוק בהיר (`bg-green-100`)
- **Background**: gradient מ-slate ל-blue

### ⚡ אופטימיזציות:

#### Performance:
- **Static Data** - אין קריאות API מיותרות
- **React.memo** - (מתוכנן) למניעת re-renders
- **Virtual Scrolling** - (מתוכנן) לרשימות ארוכות
- **Lazy Loading** - טעינת רכיבים לפי צורך

#### Accessibility:
```jsx
// Keyboard Navigation
onClick={() => setSelectedPage(page.id)}
onKeyDown={(e) => e.key === 'Enter' && setSelectedPage(page.id)}
tabIndex={0}

// Screen Reader
aria-label="הרחב מידע על הדף"
role="button"
```

### 🔧 הגדרות ו-Configuration:

#### Component Props:
- אין props חיצוניים - standalone component
- Internal state management עם hooks
- Local data definition

#### Environment Variables:
```env
# עתידי: הגדרות API
NEXT_PUBLIC_DOCS_API_URL=
PROJECT_MAP_UPDATE_INTERVAL=
```

### 📈 Analytics ו-Monitoring:

#### Planned Metrics:
- **Page Views** - כמה פעמים נצפה הדף
- **Search Usage** - תדירות השימוש בחיפוש
- **Popular Pages** - אילו דפים נצפים הכי הרבה
- **Documentation Updates** - תדירות עדכון התיעוד

#### Error Handling:
```typescript
// עתידי: Error boundaries
try {
  // data processing
} catch (error) {
  console.error('Project map error:', error);
  // fallback UI
}
```

### 🚀 תכונות עתידיות:

#### Planned Enhancements:
1. **Auto-discovery** - סריקה אוטומטית של קבצים
2. **Git Integration** - זיהוי שינויים אוטומטי
3. **Export Options** - ייצוא ל-PDF/JSON
4. **Collaborative Editing** - עריכה משותפת של תיעוד
5. **Version History** - מעקב אחר שינויים
6. **Visual Diagram** - מפה ויזואלית של הקשרים

#### Technical Roadmap:
- חיבור ל-SQLite database
- REST API לניהול מידע
- Real-time updates עם WebSocket
- Progressive Web App (PWA)
- Offline capability

