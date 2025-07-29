const fs = require('fs-extra');
const path = require('path');

/**
 * Seed script for presentation template system
 * This script creates the complete "pitch-deck" template with all slide types and variants
 */

async function seedPresentationTemplates() {
  console.log('🎨 Starting to seed presentation template data...');

  try {
    // Create the main pitch-deck template
    const template = await strapi.entityService.create('api::template.template', {
      data: {
        name: 'Pitch Deck Template',
        slug: 'pitch-deck',
        description: 'Professional pitch deck template with modern design elements',
        template_type: 'pitch-deck',
        default_styles: {
          primaryColor: '#2563eb',
          secondaryColor: '#64748b',
          accentColor: '#f97316',
          backgroundColor: '#ffffff',
          textColor: '#1e293b',
          fontFamily: 'Inter, system-ui, sans-serif',
          borderRadius: '8px',
          spacing: {
            small: '8px',
            medium: '16px',
            large: '32px',
            xlarge: '64px',
          },
        },
        global_css: `
/* Global styles for pitch deck template */
.slide-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #1e293b);
  font-family: var(--font-family, 'Inter, system-ui, sans-serif');
}

.slide-content {
  flex: 1;
  padding: var(--padding, 32px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slide-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  object-fit: cover;
}

.slide-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.slide-subtitle {
  font-size: 1.25rem;
  opacity: 0.8;
  text-align: center;
}
        `,
        is_active: true,
        created_by_user: 'System Seed',
        publishedAt: new Date().toISOString(),
      },
    });

    console.log('✅ Created template:', template.name);

    // Define slide types with their HTML structures
    const slideTypes = [
      {
        name: 'Title Slide',
        slug: 'title-slide',
        slide_type_key: 'title-slide',
        description: 'Opening slide with main title and subtitle',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="title-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <data-node class="title-section">
        <h1 class="slide-title">{{title}}</h1>
        <p class="slide-subtitle">{{subtitle}}</p>
      </data-node>
      <data-node class="presenter-info">
        <p class="presenter-name">{{presenterName}}</p>
        <p class="presenter-title">{{presenterTitle}}</p>
        <p class="company-name">{{companyName}}</p>
      </data-node>
    </block-node>
    {{#if backgroundImage}}
    <img src="{{backgroundImage}}" class="slide-background" alt="Background" />
    {{/if}}
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="title-slide"] {
  .slide-content {
    justify-content: center;
    text-align: center;
  }
  
  .title-section {
    margin-bottom: 3rem;
  }
  
  .slide-title {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }
  
  .presenter-info {
    border-top: 2px solid var(--primary-color);
    padding-top: 2rem;
  }
  
  .presenter-name {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'title-slide',
          'data-variant': ['default', 'left-background', 'right-background'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Enter your presentation title' },
          subtitle: { type: 'text', required: false, placeholder: 'Enter subtitle' },
          presenterName: { type: 'text', required: true, placeholder: 'Presenter name' },
          presenterTitle: { type: 'text', required: false, placeholder: 'Job title' },
          companyName: { type: 'text', required: true, placeholder: 'Company name' },
          backgroundImage: { type: 'media', required: false, allowedTypes: ['images'] },
        },
        template: template.id,
        sort_order: 1,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        name: 'Agenda Slide',
        slug: 'agenda-slide',
        slide_type_key: 'agenda-slide',
        description: 'Agenda or outline slide with bullet points',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="agenda-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <data-node class="agenda-header">
        <h2 class="slide-title">{{title}}</h2>
      </data-node>
      <data-node class="agenda-list">
        {{#each agendaItems}}
        <div class="agenda-item">
          <span class="agenda-number">{{@index}}</span>
          <span class="agenda-text">{{this}}</span>
        </div>
        {{/each}}
      </data-node>
    </block-node>
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="agenda-slide"] {
  .agenda-list {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .agenda-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  
  .agenda-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    font-weight: 600;
  }
  
  .agenda-text {
    font-size: 1.25rem;
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'agenda-slide',
          'data-variant': ['default', 'left-heading'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Agenda' },
          agendaItems: { type: 'array', required: true, placeholder: 'Add agenda items' },
        },
        template: template.id,
        sort_order: 2,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        name: 'Accent Image Slide',
        slug: 'accent-image-slide',
        slide_type_key: 'accent-image-slide',
        description: 'Slide with prominent image and text overlay',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="accent-image-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <data-node class="image-section">
        <img src="{{mainImage}}" alt="{{imageAlt}}" class="accent-image" />
      </data-node>
      <data-node class="text-overlay">
        <h2 class="overlay-title">{{title}}</h2>
        <p class="overlay-text">{{description}}</p>
      </data-node>
    </block-node>
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="accent-image-slide"] {
  .slide-content {
    position: relative;
    padding: 0;
  }
  
  .accent-image {
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
  
  .text-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    padding: 4rem 2rem 2rem;
  }
  
  .overlay-title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'accent-image-slide',
          'data-variant': ['top-image', 'left-image'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Slide title' },
          description: { type: 'richtext', required: false, placeholder: 'Description text' },
          mainImage: { type: 'media', required: true, allowedTypes: ['images'] },
          imageAlt: { type: 'text', required: false, placeholder: 'Image description' },
        },
        template: template.id,
        sort_order: 3,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        name: 'Heading Text Slide',
        slug: 'heading-text-slide',
        slide_type_key: 'heading-text-slide',
        description: 'Simple slide with heading and body text',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="heading-text-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <data-node class="text-content">
        <h2 class="slide-title">{{title}}</h2>
        <div class="slide-text">{{content}}</div>
      </data-node>
    </block-node>
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="heading-text-slide"] {
  .text-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  
  .slide-text {
    font-size: 1.25rem;
    line-height: 1.6;
    margin-top: 2rem;
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'heading-text-slide',
          'data-variant': ['default', 'left-heading'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Slide heading' },
          content: { type: 'richtext', required: true, placeholder: 'Main content' },
        },
        template: template.id,
        sort_order: 4,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        name: 'Text Card Slide',
        slug: 'text-card-slide',
        slide_type_key: 'text-card-slide',
        description: 'Slide with multiple text cards or sections',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="text-card-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <h2 class="slide-title">{{title}}</h2>
      <data-node class="cards-container">
        {{#each cards}}
        <div class="text-card">
          <h3 class="card-title">{{title}}</h3>
          <p class="card-content">{{content}}</p>
        </div>
        {{/each}}
      </data-node>
    </block-node>
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="text-card-slide"] {
  .cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .text-card {
    padding: 2rem;
    border-radius: var(--border-radius);
    background: rgba(0,0,0,0.05);
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  
  .text-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-4px);
  }
  
  .card-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'text-card-slide',
          'data-variant': ['default', 'no-image'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Section title' },
          cards: {
            type: 'array',
            required: true,
            itemSchema: {
              title: { type: 'text', required: true },
              content: { type: 'richtext', required: true },
            },
          },
        },
        template: template.id,
        sort_order: 5,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        name: 'Unordered Bullets Slide',
        slug: 'unordered-bullets-slide',
        slide_type_key: 'unordered-bullets-slide',
        description: 'Slide with bullet points in unordered list format',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="unordered-bullets-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <h2 class="slide-title">{{title}}</h2>
      <ul class="bullets-list">
        {{#each bulletPoints}}
        <li class="bullet-item">{{this}}</li>
        {{/each}}
      </ul>
    </block-node>
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="unordered-bullets-slide"] {
  .bullets-list {
    max-width: 700px;
    margin: 2rem auto 0;
    list-style: none;
    padding: 0;
  }
  
  .bullet-item {
    position: relative;
    padding: 1rem 0 1rem 3rem;
    font-size: 1.25rem;
    line-height: 1.5;
  }
  
  .bullet-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 1.5rem;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--primary-color);
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'unordered-bullets-slide',
          'data-variant': ['default', 'left-heading'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Slide title' },
          bulletPoints: { type: 'array', required: true, placeholder: 'Add bullet points' },
        },
        template: template.id,
        sort_order: 6,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
      {
        name: 'Image Formats Slide',
        slug: 'image-formats-slide',
        slide_type_key: 'image-formats-slide',
        description: 'Slide showcasing different image formats and layouts',
        html_structure: `
<slide-node data-template="pitch-deck" data-type="image-formats-slide" data-variant="{{variant}}" data-slide-number="{{slideNumber}}">
  <data-node class="slide-container">
    <block-node class="slide-content">
      <h2 class="slide-title">{{title}}</h2>
      <data-node class="images-grid">
        {{#each images}}
        <div class="image-item">
          <img src="{{url}}" alt="{{alt}}" class="format-image" />
          <p class="image-caption">{{caption}}</p>
        </div>
        {{/each}}
      </data-node>
    </block-node>
  </data-node>
</slide-node>`,
        scss_styles: `
.slide-container[data-type="image-formats-slide"] {
  .images-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }
  
  .image-item {
    text-align: center;
  }
  
  .format-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
  }
  
  .image-caption {
    font-size: 1rem;
    color: var(--secondary-color);
  }
}`,
        data_attributes: {
          'data-template': 'pitch-deck',
          'data-type': 'image-formats-slide',
          'data-variant': ['default', 'square-image'],
        },
        placeholder_config: {
          title: { type: 'text', required: true, placeholder: 'Images section title' },
          images: {
            type: 'array',
            required: true,
            itemSchema: {
              url: { type: 'media', required: true, allowedTypes: ['images'] },
              alt: { type: 'text', required: true },
              caption: { type: 'text', required: false },
            },
          },
        },
        template: template.id,
        sort_order: 7,
        is_active: true,
        publishedAt: new Date().toISOString(),
      },
    ];

    // Create all slide types
    const createdSlideTypes = [];
    for (const slideTypeData of slideTypes) {
      const slideType = await strapi.entityService.create('api::slide-type.slide-type', {
        data: slideTypeData,
      });
      createdSlideTypes.push(slideType);
      console.log('✅ Created slide type:', slideType.name);
    }

    // Create variants for each slide type
    const variants = [
      {
        name: 'Default',
        slug: 'default',
        variant_key: 'default',
        description: 'Standard layout without modifications',
        additional_css: '',
        background_config: {
          position: 'center',
          size: 'cover',
          repeat: 'no-repeat',
        },
        is_default: true,
        sort_order: 1,
      },
      {
        name: 'Top Image',
        slug: 'top-image',
        variant_key: 'top-image',
        description: 'Image positioned at the top of the slide',
        additional_css: `
.slide-content { flex-direction: column; }
.image-section { order: -1; margin-bottom: 2rem; }`,
        background_config: {
          position: 'top center',
          size: 'cover',
        },
        sort_order: 2,
      },
      {
        name: 'Left Image',
        slug: 'left-image',
        variant_key: 'left-image',
        description: 'Image positioned on the left side',
        additional_css: `
.slide-content { flex-direction: row; }
.image-section { flex: 1; margin-right: 2rem; }
.text-content { flex: 1; }`,
        background_config: {
          position: 'left center',
          size: 'cover',
        },
        sort_order: 3,
      },
      {
        name: 'No Image',
        slug: 'no-image',
        variant_key: 'no-image',
        description: 'Text-only layout without images',
        additional_css: `
.image-section { display: none; }
.text-content { width: 100%; max-width: 800px; margin: 0 auto; }`,
        sort_order: 4,
      },
      {
        name: 'Left Heading',
        slug: 'left-heading',
        variant_key: 'left-heading',
        description: 'Heading aligned to the left',
        additional_css: `
.slide-title { text-align: left; }
.slide-content { align-items: flex-start; }`,
        sort_order: 5,
      },
      {
        name: 'Square Image',
        slug: 'square-image',
        variant_key: 'square-image',
        description: 'Images displayed in square format',
        additional_css: `
.format-image { aspect-ratio: 1; }`,
        sort_order: 6,
      },
    ];

    // Background image variants
    const backgroundVariants = [
      {
        name: 'Left Background',
        slug: 'left-background',
        variant_key: 'left-background',
        description: 'Background image positioned on the left',
        background_config: {
          position: 'left center',
          size: '50% 100%',
          repeat: 'no-repeat',
        },
        additional_css: `
.slide-content { margin-left: 50%; padding-left: 2rem; }`,
        sort_order: 7,
      },
      {
        name: 'Right Background',
        slug: 'right-background',
        variant_key: 'right-background',
        description: 'Background image positioned on the right',
        background_config: {
          position: 'right center',
          size: '50% 100%',
          repeat: 'no-repeat',
        },
        additional_css: `
.slide-content { margin-right: 50%; padding-right: 2rem; }`,
        sort_order: 8,
      },
      {
        name: 'Top Left Background',
        slug: 'top-left-background',
        variant_key: 'top-left-background',
        description: 'Background image in top-left corner',
        background_config: {
          position: 'top left',
          size: '40% 40%',
          repeat: 'no-repeat',
        },
        additional_css: `
.slide-content { padding-top: 40%; }`,
        sort_order: 9,
      },
      {
        name: 'Bottom Right Background',
        slug: 'bottom-right-background',
        variant_key: 'bottom-right-background',
        description: 'Background image in bottom-right corner',
        background_config: {
          position: 'bottom right',
          size: '40% 40%',
          repeat: 'no-repeat',
        },
        additional_css: `
.slide-content { padding-bottom: 40%; }`,
        sort_order: 10,
      },
    ];

    // Combine all variants
    const allVariants = [...variants, ...backgroundVariants];

    // Create variants and associate them with slide types
    for (const slideType of createdSlideTypes) {
      // Determine which variants are applicable to this slide type
      const applicableVariants = allVariants.filter((variant) => {
        const slideTypeVariants = slideType.data_attributes['data-variant'] || [];
        return slideTypeVariants.includes(variant.variant_key) || variant.variant_key === 'default';
      });

      for (const variantData of applicableVariants) {
        const variant = await strapi.entityService.create('api::template-variant.template-variant', {
          data: {
            ...variantData,
            slide_type: slideType.id,
            is_active: true,
            publishedAt: new Date().toISOString(),
          },
        });
        console.log(`✅ Created variant "${variant.name}" for slide type "${slideType.name}"`);
      }
    }

    console.log('🎉 Successfully seeded presentation template data!');
    console.log(`📊 Created:
- 1 Template (${template.name})
- ${createdSlideTypes.length} Slide Types
- ${allVariants.length} Variants per applicable slide type`);
  } catch (error) {
    console.error('❌ Error seeding presentation templates:', error);
    throw error;
  }
}

module.exports = {
  seedPresentationTemplates,
};
