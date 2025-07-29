'use strict';

/**
 * Standalone presentation template seeding script
 * Run with: npm run seed:templates
 */

const { seedPresentationTemplates } = require('./seed-presentation-templates');

async function runTemplateSeeding() {
  console.log('🎨 Starting presentation template seeding...');

  try {
    const { createStrapi, compileStrapi } = require('@strapi/strapi');

    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();

    app.log.level = 'error';

    // Set global strapi for the seeding function
    global.strapi = app;

    await seedPresentationTemplates();

    console.log('✅ Presentation template seeding completed successfully!');

    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during presentation template seeding:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runTemplateSeeding();
}

module.exports = {
  runTemplateSeeding,
};
