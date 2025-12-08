// PM2 Configuration for production deployment
module.exports = {
  apps: [
    {
      name: 'api',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_URL: 'file:./prod.db',
      },
    },
  ],
};

