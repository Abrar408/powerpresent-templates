'use strict';

/**
 * Custom routes for variation management (with authentication)
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/variations/copy-all-slides',
      handler: 'custom-variation.copyAllSlidesToVariations',
      config: {
        // auth: true is the default, so we can omit it
        policies: [],
        middlewares: [],
      },
    },
  ],
};
