module.exports = {
  apps: [
    {
      name: 'strapi-app',
      script: 'npm',
      args: 'run develop --debug',
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
