# תיעוד טכני - דף הפרויקטים

## מיקום
- **נתיב:** `/projects`
- **קובץ:** `app/projects/page.tsx`

## טכנולוגיות

### Frontend Framework
- **Next.js 14** - עם App Router
- **React 18** - עם Hooks (useState)
- **TypeScript** - למניעת שגיאות ובטיחות טיפוסים

### Styling & Animation
- **Tailwind CSS** - לעיצוב מהיר ואחיד
- **Framer Motion** - לאנימציות מתקדמות
  - `AnimatePresence` לאנימציות כניסה ויציאה
  - `motion.div` לאנימציות רכיבים

### Icons
- **Lucide React** - אספריית אייקונים מודרנית
  - Plus, Search, Filter, Grid, List
  - Calendar, Users, Code, Database, Globe
  - Star, Clock, CheckCircle, AlertCircle, Pause

## מבנה נתונים

### Project Interface
```typescript
interface Project {
  id: number;
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'backend' | 'other';
  status: 'planning' | 'development' | 'testing' | 'completed' | 'paused';
  priority: 'high' | 'medium' | 'low';
  team: string[];
  progress: number; // 0-100
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  technologies: string[];
}
```

### Constants
- `PROJECT_TYPES` - מיפוי סוגי פרויקטים עם אייקונים וצבעים
- `PROJECT_STATUS` - מיפוי סטטוסים עם אייקונים וצבעים
- `SAMPLE_PROJECTS` - נתוני דוגמה (3 פרויקטים)

## State Management
```typescript
const [projects] = useState(SAMPLE_PROJECTS);
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all');
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [showCreateModal, setShowCreateModal] = useState(false);
```

## רכיבים עיקריים

### 1. Header Section
- כותרת ותיאור הדף
- כפתור "פרויקט חדש" (עתידי)

### 2. Search & Filters Bar
- שדה חיפוש עם אייקון Search
- Dropdown לסינון לפי סטטוס
- Toggle בין מצבי תצוגה (Grid/List)

### 3. ProjectCard Component
- כרטיס פרויקט עם כל המידע הרלוונטי
- Progress bar אנימטיבי
- תמיכה בעדיפויות (צבע border)
- הצגת צוות וטכנולוגיות

### 4. Statistics Section
- 4 כרטיסי סטטיסטיקה:
  - סך הכל פרויקטים
  - פרויקטים שהושלמו
  - פרויקטים בפיתוח
  - התקדמות ממוצעת

## פיצ'רים מתקדמים

### Filtering Logic
```typescript
const filteredProjects = projects.filter(project => {
  const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       project.description.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
  return matchesSearch && matchesStatus;
});
```

### Priority Color Mapping
- **High:** `border-red-500 bg-red-50`
- **Medium:** `border-yellow-500 bg-yellow-50`
- **Low:** `border-green-500 bg-green-50`
- **Default:** `border-gray-300 bg-gray-50`

### Animations
- **Initial Load:** `opacity: 0, y: 20` → `opacity: 1, y: 0`
- **Progress Bar:** אנימצית width עם delay
- **View Mode:** `AnimatePresence` לחילוף מצבי תצוגה
- **Buttons:** `whileHover` ו-`whileTap` effects

## RTL Support
- כל הטקסטים עם `dir="rtl"`
- חיפוש עם `text-right`
- Layout מותאם לכיוון עברית
- אייקונים עם `dir="ltr"` במקום הצורך

## Responsive Design
- **Mobile:** `grid-cols-1`
- **Tablet:** `md:grid-cols-2`
- **Desktop:** `xl:grid-cols-3`
- Search bar responsive עם `flex-col md:flex-row`

## עדכונים עתידיים
- חיבור לבסיס נתונים (SQLite)
- CRUD operations לפרויקטים
- מודל ליצירת פרויקט חדש
- Export נתונים
- Charts וגרפים מתקדמים
