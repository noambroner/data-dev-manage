// Project Types
export interface Project {
  id: number;
  name: string;
  description?: string;
  path: string;
  repository_url?: string;
  status: 'active' | 'archived' | 'draft';
  created_at: string;
  updated_at: string;
  last_opened?: string;
  tags?: string; // JSON string
  settings?: string; // JSON string
}

export interface ProjectSettings {
  framework?: string;
  language?: string;
  buildCommand?: string;
  startCommand?: string;
  environment?: Record<string, string>;
  customCommands?: CustomCommand[];
}

export interface CustomCommand {
  id: string;
  name: string;
  command: string;
  description?: string;
  icon?: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'developer' | 'viewer';
  avatar_url?: string;
  settings?: string; // JSON string
  created_at: string;
  last_login?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'he' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  editor: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
  };
}

// Activity Types
export interface Activity {
  id: number;
  user_id?: number;
  project_id?: number;
  action: string;
  description?: string;
  metadata?: string; // JSON string
  created_at: string;
  // Joined fields
  username?: string;
  full_name?: string;
  project_name?: string;
}

export interface ActivityMetadata {
  files?: string[];
  commits?: string[];
  branch?: string;
  duration?: number;
  errorMessage?: string;
  [key: string]: any;
}

// Configuration Types
export interface Configuration {
  id: number;
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_at: string;
}

// Deployment Types
export interface Deployment {
  id: number;
  project_id: number;
  version: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  build_log?: string;
  deploy_url?: string;
  created_at: string;
  completed_at?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateProjectForm {
  name: string;
  description: string;
  path: string;
  repository_url: string;
  framework: string;
  language: string;
  tags: string[];
}

export interface UpdateProjectForm extends Partial<CreateProjectForm> {
  id: number;
}

// SSH and Deployment Types
export interface SSHConfig {
  host: string;
  port: number;
  username: string;
  privateKeyPath: string;
  remotePath: string;
  buildCommand?: string;
  restartCommand?: string;
}

export interface DeploymentConfig {
  ssh: SSHConfig;
  buildSettings: {
    outputDir: string;
    buildCommand: string;
    envFile?: string;
  };
  serverSettings: {
    serviceName?: string;
    nginxConfig?: string;
    domainName?: string;
  };
}

// Theme and UI Types
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  fonts: {
    primary: string;
    code: string;
  };
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: number;
  children?: NavigationItem[];
  requiredRole?: User['role'];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  recentActivities: Activity[];
  systemStatus: {
    diskUsage: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

