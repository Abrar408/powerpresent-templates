'use strict';

/**
 * slide service
 */
//@ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::slide.slide');
