'use strict';

/**
 * variation service
 */
//@ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::variation.variation');
