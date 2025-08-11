'use strict';

/**
 * Custom routes for variation management
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/variations/copy-all-slides',
      handler: 'custom-variation.copyAllSlidesToVariations',
      config: {
        auth: false, // Disable authentication completely
        policies: [],
        middlewares: [],
      },
    },
  ],
};
