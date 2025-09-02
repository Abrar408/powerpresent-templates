module.exports = {
  apps: [
    {
      name: 'strapi-app',
      script: 'npm',
      args: ['run', 'develop'],
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
