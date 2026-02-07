// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'linka-website',
      script: 'app/index.js',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001
      }
    }
  ]
};