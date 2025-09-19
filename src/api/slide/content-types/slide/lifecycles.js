export default {
  async afterCreate(event) {
    const createdDocumentId = event?.result?.documentId ?? event?.params?.data?.documentId;
    if (createdDocumentId) {
      const templates = await strapi.entityService.findMany('api::template.template', {
        populate: {
          slides: true,
        },
      });

      const matchingTemplate = templates.find(
        (template) =>
          Array.isArray(template.slides) && template.slides.some((slide) => slide.documentId === createdDocumentId)
      );

      if (matchingTemplate && matchingTemplate.name) {
        await strapi.service('api::template.template').findTemplateByNameWithAllData(matchingTemplate.name);
      }
    }
  },

  async afterUpdate(event) {
    // Find the template which has a slide with document id = event?.params?.data?.documentId
    const documentId = event?.params?.data?.documentId;
    if (documentId) {
      const templates = await strapi.entityService.findMany('api::template.template', {
        populate: {
          slides: true,
        },
      });

      const matchingTemplate = templates.find(
        (template) => Array.isArray(template.slides) && template.slides.some((slide) => slide.documentId === documentId)
      );

      if (matchingTemplate && matchingTemplate.name) {
        // Call the service method to get the template by name with all data
        const templateData = await strapi
          .service('api::template.template')
          .findTemplateByNameWithAllData(matchingTemplate.name);
      }
    }
  },
};
