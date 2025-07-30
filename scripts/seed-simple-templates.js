'use strict';

/**
 * Simple seed script for the new template system
 * Creates sample data for Template -> Slide -> Element structure with group support
 */

async function seedSimpleTemplateSystem() {
  console.log('🎨 Starting to seed simple template system...');

  try {
    // Create a sample template
    const template = await strapi.entityService.create('api::template.template', {
      data: {
        name: 'My Presentation Template',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('✅ Created template:', template.name);

    // Create first slide: Title Slide
    const titleSlide = await strapi.entityService.create('api::slide.slide', {
      data: {
        name: 'Title Slide',
        variant: 'centered',
        background_color: {
          type: 'single',
          value: '#ffffff',
        },
        layout: {
          type: 'flex',
          direction: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        elements: [
          {
            type: 'heading1',
            config: {
              text_align: 'center',
              color: {
                type: 'single',
                value: '#1e293b',
              },
              margin: {
                top: '0',
                right: '0',
                bottom: '2rem',
                left: '0',
              },
            },
          },
          {
            type: 'paragraph',
            config: {
              text_align: 'center',
              color: {
                type: 'single',
                value: '#64748b',
              },
              margin: {
                top: '0',
                right: '0',
                bottom: '3rem',
                left: '0',
              },
            },
          },
        ],
        template: template.id,
      },
    });

    // Create second slide: Content Slide with Group
    const contentSlide = await strapi.entityService.create('api::slide.slide', {
      data: {
        name: 'Content Slide with Group',
        variant: 'standard',
        background_color: {
          type: 'gradient',
          from: '#f8fafc',
          to: '#e2e8f0',
        },
        layout: {
          type: 'grid',
          columns: 2,
          gap: '2rem',
        },
        elements: [
          {
            type: 'group',
            config: {
              background_color: {
                type: 'single',
                value: '#ffffff',
              },
              padding: {
                top: '2rem',
                right: '2rem',
                bottom: '2rem',
                left: '2rem',
              },
              border_radius: {
                top: '12px',
                right: '12px',
                bottom: '12px',
                left: '12px',
              },
            },
            children: [
              {
                type: 'heading2',
                config: {
                  text_align: 'left',
                  color: {
                    type: 'single',
                    value: '#1e293b',
                  },
                  margin: {
                    top: '0',
                    right: '0',
                    bottom: '1rem',
                    left: '0',
                  },
                },
              },
              {
                type: 'bullet-points',
                config: {
                  text_align: 'left',
                  color: {
                    type: 'single',
                    value: '#475569',
                  },
                  margin: {
                    top: '0',
                    right: '0',
                    bottom: '1rem',
                    left: '0',
                  },
                },
              },
            ],
          },
          {
            type: 'image',
            config: {
              width: '100%',
              height: 'auto',
              border_radius: {
                top: '8px',
                right: '8px',
                bottom: '8px',
                left: '8px',
              },
            },
          },
        ],
        template: template.id,
      },
    });

    console.log('✅ Created slides with embedded element components');

    console.log('🎉 Successfully seeded simple template system!');
    console.log(`📊 Created:
- 1 Template (${template.name})
- 2 Slides (${titleSlide.name}, ${contentSlide.name})
- Element components with nested children support`);
  } catch (error) {
    console.error('❌ Error seeding simple template system:', error);
    throw error;
  }
}

module.exports = {
  seedSimpleTemplateSystem,
};
