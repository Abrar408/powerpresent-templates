'use strict';

/**
 * slide-type controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::slide-type.slide-type', ({ strapi }) => ({
  // Custom action to get slide types by template
  async findByTemplate(ctx) {
    const { templateId } = ctx.params;

    try {
      const entities = await strapi.entityService.findMany('api::slide-type.slide-type', {
        filters: { template: templateId },
        populate: {
          variants: {
            populate: {
              background_images: true,
            },
          },
          background_image: true,
          thumbnail: true,
        },
        sort: { sort_order: 'asc' },
      });

      const sanitizedEntities = await this.sanitizeOutput(entities, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
}));
