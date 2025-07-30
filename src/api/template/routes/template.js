'use strict';

/**
 * template router
 */

module.exports = {
  routes: [
    // Custom route - must come before default routes to avoid conflicts
    {
      method: 'GET',
      path: '/templates/by-name/:name',
      handler: 'template.findByName',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Include default CRUD routes
    {
      method: 'GET',
      path: '/templates',
      handler: 'template.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/templates/:id',
      handler: 'template.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/templates',
      handler: 'template.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/templates/:id',
      handler: 'template.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/templates/:id',
      handler: 'template.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
