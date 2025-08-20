import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// הגדרת נתיב בסיס הנתונים
const dbDir = join(process.cwd(), 'data');
const dbPath = join(dbDir, 'platform.db');

// יצירת תיקיית data אם לא קיימת
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// יצירת החיבור לבסיס הנתונים
export const db = new Database(dbPath);

// הפעלת WAL mode לביצועים טובים יותר
db.pragma('journal_mode = WAL');

// אתחול הסכמה
export function initializeDatabase() {
  // טבלת פרויקטים
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      path TEXT NOT NULL,
      repository_url TEXT,
      status TEXT CHECK (status IN ('active', 'archived', 'draft')) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_opened DATETIME,
      tags TEXT, -- JSON array של תגיות
      settings TEXT -- JSON של הגדרות פרויקט
    );
  `);

  // טבלת משתמשים/צוות
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      role TEXT CHECK (role IN ('admin', 'developer', 'viewer')) DEFAULT 'developer',
      avatar_url TEXT,
      settings TEXT, -- JSON של הגדרות משתמש
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
  `);

  // טבלת פעילויות/לוגים
  db.exec(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      project_id INTEGER,
      action TEXT NOT NULL,
      description TEXT,
      metadata TEXT, -- JSON של מטאדאטה נוספת
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );
  `);

  // טבלת קונפיגורציות כלליות
  db.exec(`
    CREATE TABLE IF NOT EXISTS configurations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      description TEXT,
      type TEXT CHECK (type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // טבלת deployments
  db.exec(`
    CREATE TABLE IF NOT EXISTS deployments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      version TEXT NOT NULL,
      status TEXT CHECK (status IN ('pending', 'building', 'success', 'failed')) DEFAULT 'pending',
      build_log TEXT,
      deploy_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );
  `);

  // יצירת אינדקסים לביצועים
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);
    CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
    CREATE INDEX IF NOT EXISTS idx_activities_project_id ON activities(project_id);
    CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
    CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON deployments(project_id);
  `);

  console.log('✅ Database initialized successfully');
}

// Prepared statements לביצועים טובים יותר
export const queries = {
  // Projects
  getAllProjects: db.prepare('SELECT * FROM projects ORDER BY updated_at DESC'),
  getProjectById: db.prepare('SELECT * FROM projects WHERE id = ?'),
  createProject: db.prepare(`
    INSERT INTO projects (name, description, path, repository_url, tags, settings)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  updateProject: db.prepare(`
    UPDATE projects 
    SET name = ?, description = ?, repository_url = ?, tags = ?, settings = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
  updateProjectLastOpened: db.prepare('UPDATE projects SET last_opened = CURRENT_TIMESTAMP WHERE id = ?'),
  
  // Users
  getAllUsers: db.prepare('SELECT * FROM users ORDER BY created_at DESC'),
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  createUser: db.prepare(`
    INSERT INTO users (username, email, full_name, role, avatar_url, settings)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  // Activities
  getRecentActivities: db.prepare(`
    SELECT a.*, u.username, u.full_name, p.name as project_name
    FROM activities a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN projects p ON a.project_id = p.id
    ORDER BY a.created_at DESC
    LIMIT ?
  `),
  createActivity: db.prepare(`
    INSERT INTO activities (user_id, project_id, action, description, metadata)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  // Configurations
  getConfig: db.prepare('SELECT * FROM configurations WHERE key = ?'),
  setConfig: db.prepare(`
    INSERT OR REPLACE INTO configurations (key, value, description, type, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `),
  
  // Deployments
  getDeploymentsByProject: db.prepare('SELECT * FROM deployments WHERE project_id = ? ORDER BY created_at DESC'),
  createDeployment: db.prepare(`
    INSERT INTO deployments (project_id, version, status)
    VALUES (?, ?, ?)
  `),
  updateDeploymentStatus: db.prepare(`
    UPDATE deployments 
    SET status = ?, build_log = ?, deploy_url = ?, completed_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),
};

// פונקציות עזר
export function insertDefaultData() {
  // הוספת משתמש ברירת מחדל
  try {
    queries.createUser.run(
      'admin',
      'admin@bflow.co.il',
      'מנהל מערכת',
      'admin',
      null,
      JSON.stringify({ theme: 'dark', language: 'he' })
    );
    
    // הוספת קונפיגורציות בסיסיות
    queries.setConfig.run('platform_name', 'Dev Platform', 'שם הפלטפורמה', 'string');
    queries.setConfig.run('version', '1.0.0', 'גרסת הפלטפורמה', 'string');
    queries.setConfig.run('max_projects', '50', 'מספר מקסימלי של פרויקטים', 'number');
    
    console.log('✅ Default data inserted successfully');
  } catch (error) {
    console.log('ℹ️  Default data already exists or error:', error);
  }
}

// אתחול בסיס הנתונים בעת הטעינה
if (typeof window === 'undefined') {
  initializeDatabase();
  insertDefaultData();
}

