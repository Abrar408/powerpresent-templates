'use strict';

/**
 * Standalone simple template seeding script
 * Run with: npm run seed:simple
 */

const { seedSimpleTemplateSystem } = require('./seed-simple-templates');

async function runSimpleTemplateSeeding() {
  console.log('🎨 Starting simple template seeding...');

  try {
    const { createStrapi, compileStrapi } = require('@strapi/strapi');

    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();

    app.log.level = 'error';

    // Set global strapi for the seeding function
    global.strapi = app;

    await seedSimpleTemplateSystem();

    console.log('✅ Simple template seeding completed successfully!');

    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during simple template seeding:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runSimpleTemplateSeeding();
}

module.exports = {
  runSimpleTemplateSeeding,
};
