module.exports = {
  apps: [
    {
      name: 'dev-platform',
      script: 'npm',
      args: 'start',
      cwd: '/home/ploi/dev.bflow.co.il/app',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      error_file: '/home/ploi/dev.bflow.co.il/logs/err.log',
      out_file: '/home/ploi/dev.bflow.co.il/logs/out.log',
      log_file: '/home/ploi/dev.bflow.co.il/logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      watch: false,
      ignore_watch: [
        'node_modules',
        '.next',
        'logs'
      ],
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};

