# דף הבית - תיעוד טכני

## 🏗️ מבנה טכני

### 📁 מיקום קבצים:
```
app/
├── layout.tsx          # Layout ראשי עם Sidebar
├── page.tsx           # דף הבית הראשי
└── globals.css        # סטיילים גלובליים

components/
└── Sidebar.tsx        # רכיב התפריט הצידי

styles/
└── globals.css        # סטיילים וטיילווינד
```

### 🔧 טכנולוגיות ותלויות:

#### Core Framework:
- **Next.js 14.2.32** - Framework ראשי עם App Router
- **React 18.2.0** - ספריית UI
- **TypeScript 5.3.3** - Type safety

#### Styling:
- **Tailwind CSS 3.4.0** - Framework CSS
- **PostCSS 8.4.32** - מעבד CSS
- **Autoprefixer 10.4.16** - תמיכה בדפדפנים

#### אנימציות:
- **Framer Motion 10.16.16** - אנימציות מתקדמות
- **CSS Custom Properties** - משתנים דינמיים

#### איקונים:
- **Lucide React 0.295.0** - ספריית איקונים מודרנית

#### פונטים:
- **Inter** - פונט ראשי לאנגלית
- **Assistant** - פונט עברי מותאם RTL

### 🎨 מבנה הרכיבים:

#### HomePage Component:
```typescript
export default function HomePage() {
  // State management
  // Animation variants
  // Event handlers
  // JSX structure
}
```

#### Layout Component:
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar state
  // Global layout
}
```

### 📱 Responsive Design:

#### Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large**: > 1440px

#### Grid System:
- CSS Grid לרכיבים מרכזיים
- Flexbox לאלמנטים קטנים
- Container queries עבור רכיבים מתקדמים

### 🎭 אנימציות:

#### Framer Motion Variants:
```typescript
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
```

#### CSS Animations:
- **Floating elements** - תנועה רציפה לאלמנטי רקע
- **Hover effects** - אפקטי ריחוף על כפתורים וכרטיסים
- **Gradient animations** - רקעים דינמיים

### 🎨 עיצוב ו-UI:

#### Color Palette:
```css
:root {
  --primary-blue: #3b82f6;
  --primary-purple: #8b5cf6;
  --accent-yellow: #fbbf24;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### Typography:
- **Headers**: Font weight 700, sizes 2xl-8xl
- **Body text**: Font weight 400, sizes sm-lg
- **Line height**: 1.6 לקריאות מיטבית
- **Letter spacing**: מותאם לכל גודל פונט

### ⚡ אופטימיזציות:

#### Performance:
- **Static Generation** - דף סטטי לטעינה מהירה
- **Image Optimization** - Next.js Image component
- **Bundle Splitting** - קוד נטען לפי צורך
- **Tree Shaking** - הסרת קוד מיותר

#### SEO:
- **Meta Tags** - title, description, keywords
- **Open Graph** - שיתוף במדיה חברתית
- **Structured Data** - Schema.org markup
- **Canonical URLs** - מניעת תוכן כפול

#### Accessibility:
- **ARIA Labels** - תמיכה בקוראי מסך
- **Keyboard Navigation** - ניווט מלא במקלדת
- **Focus Management** - ניהול פוקוס אינטליגנטי
- **Color Contrast** - WCAG AA compliant

### 🔧 הגדרות Build:

#### Next.js Config:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  swcMinify: true,
  compress: true,
}
```

#### Tailwind Config:
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors, fonts, animations
    },
  },
}
```

### 📊 Bundle Analysis:

#### File Sizes:
- **Main Bundle**: ~87.1 kB (shared)
- **Page Bundle**: ~2.33 kB (specific)
- **Total First Load**: ~122 kB

#### Critical Resources:
- HTML: מינימלי, סטטי
- CSS: מאוחד ומצומצם
- JavaScript: מפוצל ומותאם
- Images: WebP format, lazy loading

### 🔍 Monitoring:

#### Error Tracking:
- Client-side errors עם Error Boundaries
- Performance monitoring
- User interaction tracking

#### Analytics:
- Page views ו-user sessions
- Conversion tracking עבור CTA
- Performance metrics (Core Web Vitals)

