'use strict';

/**
 * template service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::template.template', ({ strapi }) => ({
  // Custom service method to get template with all nested data
  async findTemplateWithAllData(slug) {
    return await strapi.entityService.findMany('api::template.template', {
      filters: { slug },
      populate: {
        slide_types: {
          populate: {
            variants: {
              populate: {
                background_images: true,
              },
            },
            background_image: true,
            thumbnail: true,
          },
        },
        thumbnail: true,
      },
    });
  },

  // Custom service method to validate template structure
  async validateTemplateStructure(templateData) {
    const requiredFields = ['name', 'slug', 'template_type'];

    for (const field of requiredFields) {
      if (!templateData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return true;
  },
}));
