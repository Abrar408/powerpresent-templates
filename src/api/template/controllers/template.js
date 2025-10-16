'use strict';

/**
 * template controller
 */

//@ts-ignore
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::template.template', ({ strapi }) => ({
  async find(ctx) {
    try {
      const templates = await strapi.service('api::template.template').getAll();

      return { data: templates || [] };
    } catch (error) {
      console.error('Error fetching template by name:', error);
      return ctx.internalServerError('An error occurred while fetching the template');
    }
  },

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

  async getTemplateWithStructure(ctx) {
    try {
      const { id } = ctx.params;

      if (!id) {
        return ctx.badRequest('Template id is required');
      }

      const template = await strapi.service('api::template.template').getTemplateWithStructure(id);

      if (!template) {
        return ctx.notFound('Template not found');
      }

      const data = {
        id: template.id,
        name: template.name,
        slides: template.slides.map((slide) => ({
          name: slide.name,
          variant: slide.variant,
          style: slide.style,
          background_color: slide.background_color,
          background_image: slide.background_image,
          elements: slide.elements,
          variations: slide.variations.map((v) => ({
            name: v.name,
            variant: v.variant,
            style: v.style,
            background_color: v.background_color,
            background_image: v.background_image,
            elements: v.elements,
            layout: v.layout,
            variables: v.variables,
          })),
          layout: slide.layout,
          variables: slide.variables,
        })),
      };

      return { data };
    } catch (error) {
      console.error('Error fetching template by name:', error);
      return ctx.internalServerError('An error occurred while fetching the template');
    }
  },
}));
