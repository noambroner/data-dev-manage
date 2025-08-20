/**
 * הגדרות Deployment לפלטפורמת dev.bflow.co.il
 */

const deployConfig = {
  // הגדרות סביבה
  environments: {
    production: {
      server: {
        host: '95.179.254.156',
        user: 'ploi',
        port: 22,
        path: '/home/ploi/dev.bflow.co.il'
      },
      build: {
        command: 'npm run build',
        outputDir: '.next',
        envFile: '.env.production'
      },
      deploy: {
        serviceName: 'dev-platform',
        nginxConfig: '/etc/nginx/sites-available/dev.bflow.co.il',
        domainName: 'dev.bflow.co.il',
        sslEnabled: true
      }
    },
    staging: {
      server: {
        host: 'staging.bflow.co.il',
        user: 'deploy',
        port: 22,
        path: '/var/www/dev-platform-staging'
      },
      build: {
        command: 'npm run build',
        outputDir: '.next',
        envFile: '.env.staging'
      },
      deploy: {
        serviceName: 'dev-platform-staging',
        nginxConfig: '/etc/nginx/sites-available/dev-platform-staging',
        domainName: 'staging.bflow.co.il',
        sslEnabled: true
      }
    }
  },

  // הגדרות SSH
  ssh: {
    keyPath: process.env.HOME + '/.ssh/ploi_dev_bflow',
    knownHostsPath: process.env.HOME + '/.ssh/known_hosts',
    options: [
      '-o StrictHostKeyChecking=no',
      '-o UserKnownHostsFile=/dev/null',
      '-o LogLevel=ERROR'
    ]
  },

  // קבצים לכלול/להתעלם
  files: {
    include: [
      '.next/**',
      'public/**',
      'package.json',
      'package-lock.json',
      'next.config.js',
      'data/**'
    ],
    exclude: [
      'node_modules',
      '.git',
      '*.log',
      '.env*',
      'deploy-*',
      'scripts/',
      '*.md'
    ]
  },

  // הגדרות בניה
  build: {
    preCommands: [
      'npm ci',
      'npm run lint',
      'npm run build'
    ],
    postCommands: [
      'echo "Build completed successfully"'
    ]
  },

  // הגדרות שרת
  server: {
    preDeployCommands: [
      'sudo systemctl stop dev-platform || true',
      'mkdir -p /home/ploi/dev.bflow.co.il',
      'sudo chown -R ploi:ploi /home/ploi/dev.bflow.co.il'
    ],
    postDeployCommands: [
      'cd /home/ploi/dev.bflow.co.il && npm ci --only=production',
      'sudo systemctl start dev-platform',
      'sudo systemctl enable dev-platform',
      'sudo nginx -t && sudo systemctl reload nginx'
    ]
  },

  // הגדרות Systemd Service
  systemd: {
    serviceName: 'dev-platform',
    serviceFile: `[Unit]
Description=Dev Platform - bflow.co.il
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/dev-platform
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target`
  },

  // הגדרות Nginx
  nginx: {
    configFile: `server {
    listen 80;
    listen [::]:80;
    server_name dev.bflow.co.il;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name dev.bflow.co.il;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/dev.bflow.co.il/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.bflow.co.il/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files
    location /_next/static {
        alias /var/www/dev-platform/.next/static;
        expires 365d;
        access_log off;
    }

    location /public {
        alias /var/www/dev-platform/public;
        expires 30d;
        access_log off;
    }
}`
  }
};

module.exports = deployConfig;
