'use strict';

/**
 * template controller
 */

//@ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::template.template', ({ strapi }) => ({
  // Custom controller method to get template by name with all data
  async findByName(ctx) {
    try {
      const { name } = ctx.params;

      if (!name) {
        return ctx.badRequest('Template name is required');
      }

      const template = await strapi.service('api::template.template').findTemplateByNameWithAllData(name);

      if (!template) {
        return ctx.notFound('Template not found');
      }

      return { data: template };
    } catch (error) {
      console.error('Error fetching template by name:', error);
      return ctx.internalServerError('An error occurred while fetching the template');
    }
  },
}));
