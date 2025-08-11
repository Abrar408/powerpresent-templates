'use strict';

/**
 * variation router
 */
//@ts-ignore
const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::variation.variation');
