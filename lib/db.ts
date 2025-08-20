import { Pool, PoolClient, QueryResult } from 'pg';

// הגדרת חיבור לבסיס הנתונים PostgreSQL
const dbConfig = {
  host: '64.176.175.17',
  port: 5432,
  database: 'dev_manage_app',
  user: 'dev_manage_app_user',
  password: 'EJcQzhaESVeftZv1ccw5',
  ssl: false, // אם השרת דורש SSL, יש לשנות ל-true
  max: 20, // מקסימום חיבורים בpool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// יצירת Pool לחיבורים
export const pool = new Pool(dbConfig);

// בדיקת חיבור
pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err);
});

// אתחול הסכמה
export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // טבלת פרויקטים
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) DEFAULT 'web',
        status VARCHAR(50) CHECK (status IN ('planning', 'development', 'testing', 'completed', 'paused')) DEFAULT 'planning',
        priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        team TEXT[], -- PostgreSQL array של חברי צוות
        start_date DATE,
        due_date DATE,
        technologies TEXT[], -- PostgreSQL array של טכנולוגיות
        repository_url TEXT,
        path TEXT,
        settings JSONB, -- JSON של הגדרות פרויקט
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_opened TIMESTAMP
      );
    `);

    // טבלת משתמשים/צוות
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('admin', 'developer', 'viewer')) DEFAULT 'developer',
        avatar_url TEXT,
        settings JSONB, -- JSON של הגדרות משתמש
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    // טבלת פעילויות/לוגים
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        project_id INTEGER REFERENCES projects(id),
        action VARCHAR(100) NOT NULL,
        description TEXT,
        metadata JSONB, -- JSON של מטאדאטה נוספת
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // טבלת קונפיגורציות כלליות
    await client.query(`
      CREATE TABLE IF NOT EXISTS configurations (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        description TEXT,
        type VARCHAR(20) CHECK (type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // טבלת deployments
    await client.query(`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id),
        version VARCHAR(50) NOT NULL,
        status VARCHAR(20) CHECK (status IN ('pending', 'building', 'success', 'failed')) DEFAULT 'pending',
        build_log TEXT,
        deploy_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );
    `);

    // יצירת אינדקסים לביצועים
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at);
      CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_activities_project_id ON activities(project_id);
      CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);
      CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON deployments(project_id);
    `);

    console.log('✅ PostgreSQL Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// פונקציות עזר לשאילתות
export const queries = {
  // Projects
  async getAllProjects() {
    const result = await pool.query('SELECT * FROM projects ORDER BY updated_at DESC');
    return result.rows;
  },

  async getProjectById(id: number) {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async createProject(data: {
    name: string;
    description?: string;
    type?: string;
    status?: string;
    priority?: string;
    team?: string[];
    start_date?: string;
    due_date?: string;
    technologies?: string[];
    repository_url?: string;
    path?: string;
    settings?: any;
  }) {
    const query = `
      INSERT INTO projects (name, description, type, status, priority, team, start_date, due_date, technologies, repository_url, path, settings)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      data.name,
      data.description || null,
      data.type || 'web',
      data.status || 'planning',
      data.priority || 'medium',
      data.team || [],
      data.start_date || null,
      data.due_date || null,
      data.technologies || [],
      data.repository_url || null,
      data.path || null,
      data.settings || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateProject(id: number, data: any) {
    const query = `
      UPDATE projects 
      SET name = $2, description = $3, type = $4, status = $5, priority = $6, 
          team = $7, due_date = $8, technologies = $9, repository_url = $10, 
          settings = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      data.name,
      data.description,
      data.type,
      data.status,
      data.priority,
      data.team,
      data.due_date,
      data.technologies,
      data.repository_url,
      data.settings
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateProjectProgress(id: number, progress: number) {
    const query = 'UPDATE projects SET progress = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id, progress]);
    return result.rows[0];
  },

  async updateProjectLastOpened(id: number) {
    const query = 'UPDATE projects SET last_opened = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  },
  
  // Users
  async getAllUsers() {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  async getUserById(id: number) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async getUserByUsername(username: string) {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
  },

  async createUser(data: {
    username: string;
    email: string;
    full_name: string;
    role?: string;
    avatar_url?: string;
    settings?: any;
  }) {
    const query = `
      INSERT INTO users (username, email, full_name, role, avatar_url, settings)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      data.username,
      data.email,
      data.full_name,
      data.role || 'developer',
      data.avatar_url || null,
      data.settings || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  // Activities
  async getRecentActivities(limit = 20) {
    const query = `
      SELECT a.*, u.username, u.full_name, p.name as project_name
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN projects p ON a.project_id = p.id
      ORDER BY a.created_at DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  async createActivity(data: {
    user_id?: number;
    project_id?: number;
    action: string;
    description?: string;
    metadata?: any;
  }) {
    const query = `
      INSERT INTO activities (user_id, project_id, action, description, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      data.user_id || null,
      data.project_id || null,
      data.action,
      data.description || null,
      data.metadata || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  
  // Configurations
  async getConfig(key: string) {
    const result = await pool.query('SELECT * FROM configurations WHERE key = $1', [key]);
    return result.rows[0] || null;
  },

  async setConfig(key: string, value: string, description?: string, type = 'string') {
    const query = `
      INSERT INTO configurations (key, value, description, type, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        description = EXCLUDED.description,
        type = EXCLUDED.type,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [key, value, description, type]);
    return result.rows[0];
  },
  
  // Deployments
  async getDeploymentsByProject(projectId: number) {
    const result = await pool.query('SELECT * FROM deployments WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
    return result.rows;
  },

  async createDeployment(data: {
    project_id: number;
    version: string;
    status?: string;
  }) {
    const query = `
      INSERT INTO deployments (project_id, version, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [data.project_id, data.version, data.status || 'pending'];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateDeploymentStatus(id: number, status: string, buildLog?: string, deployUrl?: string) {
    const query = `
      UPDATE deployments 
      SET status = $2, build_log = $3, deploy_url = $4, completed_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [id, status, buildLog, deployUrl]);
    return result.rows[0];
  },

  // פונקציות מטא-דאטה עבור דף בסיס הנתונים
  async getAllTables() {
    const result = await pool.query(`
      SELECT tablename as name, schemaname as schema
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    return result.rows;
  },

  async getTableInfo(tableName: string) {
    const result = await pool.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = $1 AND table_schema = 'public'
      ORDER BY ordinal_position
    `, [tableName]);
    return result.rows;
  },

  async getTableData(tableName: string, limit = 100, offset = 0, searchTerm?: string) {
    let query = `SELECT * FROM ${tableName}`;
    const values: any[] = [];
    
    // הוספת חיפוש אם יש
    if (searchTerm) {
      // קודם נוריד את המידע על העמודות כדי לבנות WHERE עם LIKE
      const columns = await this.getTableInfo(tableName);
      const textColumns = columns.filter(col => 
        col.data_type.includes('text') || 
        col.data_type.includes('varchar') || 
        col.data_type.includes('char')
      );
      
      if (textColumns.length > 0) {
        const whereConditions = textColumns.map((col, index) => 
          `${col.column_name}::text ILIKE $${index + 1}`
        ).join(' OR ');
        
        query += ` WHERE ${whereConditions}`;
        textColumns.forEach(() => values.push(`%${searchTerm}%`));
      }
    }
    
    query += ` ORDER BY 1 LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    return result.rows;
  },

  async getTableRowCount(tableName: string) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    return parseInt(result.rows[0].count);
  }
};

// פונקציות עזר
export async function insertDefaultData() {
  try {
    // בדיקה אם כבר יש נתונים
    const existingUsers = await queries.getAllUsers();
    if (existingUsers.length > 0) {
      console.log('ℹ️ Default data already exists');
      return;
    }

    // הוספת משתמש ברירת מחדל
    await queries.createUser({
      username: 'admin',
      email: 'admin@bflow.co.il',
      full_name: 'מנהל מערכת',
      role: 'admin',
      settings: { theme: 'dark', language: 'he' }
    });
    
    // הוספת קונפיגורציות בסיסיות
    await queries.setConfig('platform_name', 'Dev Platform', 'שם הפלטפורמה', 'string');
    await queries.setConfig('version', '1.0.0', 'גרסת הפלטפורמה', 'string');
    await queries.setConfig('max_projects', '50', 'מספר מקסימלי של פרויקטים', 'number');
    
    console.log('✅ Default data inserted successfully');
  } catch (error) {
    console.log('ℹ️ Default data error:', error);
  }
}

// אתחול בסיס הנתונים בעת הטעינה (רק בשרת)
if (typeof window === 'undefined') {
  initializeDatabase()
    .then(() => insertDefaultData())
    .catch(console.error);
}

// פונקציה לסגירת החיבורים (לשימוש בעת כיבוי השרת)
export async function closeDatabase() {
  await pool.end();
}