module.exports = {
  apps: [
    {
      name: 'strapi-app',
      script: 'npm',
      args: ['run', 'start'],
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
