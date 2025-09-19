export default (config) => {
  return {
    ...config,
    server: {
      ...config.server,
      allowedHosts: ['template.powerpresent.ai'],
    },
  };
};
