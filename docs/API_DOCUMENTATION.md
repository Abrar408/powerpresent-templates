# Presentation Template API Documentation

## Overview

This Strapi CMS provides a dynamic template system for presentation creation apps. It replaces hardcoded HTML templates with a flexible, user-manageable system.

## Content Types

### 1. Template (`/api/templates`)

Main container for presentation templates.

**Fields:**

- `name` (string): Template display name
- `slug` (string): URL-friendly identifier
- `description` (text): Template description
- `template_type` (enum): Type of template (pitch-deck, corporate, etc.)
- `default_styles` (json): Default CSS styles and theme configuration
- `global_css` (text): Global SCSS/CSS for the entire template
- `slide_types` (relation): Associated slide types
- `thumbnail` (media): Template preview image
- `is_active` (boolean): Whether template is available
- `created_by_user` (string): Creator information

### 2. Slide Type (`/api/slide-types`)

Different types of slides with their HTML structure and styling.

**Fields:**

- `name` (string): Slide type display name
- `slug` (string): URL-friendly identifier
- `slide_type_key` (enum): Internal slide type identifier
- `description` (text): Slide type description
- `html_structure` (text): HTML template with placeholders
- `scss_styles` (text): SCSS/CSS styles for this slide type
- `data_attributes` (json): Configuration for data attributes
- `placeholder_config` (json): Content placeholder configuration
- `template` (relation): Parent template
- `variants` (relation): Available layout variants
- `background_image` (media): Default background image
- `thumbnail` (media): Slide type preview
- `sort_order` (integer): Display order
- `is_active` (boolean): Availability status

### 3. Template Variant (`/api/template-variants`)

Layout variations for slide types.

**Fields:**

- `name` (string): Variant display name
- `slug` (string): URL-friendly identifier
- `variant_key` (enum): Internal variant identifier
- `description` (text): Variant description
- `additional_css` (text): CSS modifications for this variant
- `html_modifications` (text): HTML structure changes
- `background_config` (json): Background positioning configuration
- `layout_config` (json): Layout-specific settings
- `slide_type` (relation): Parent slide type
- `background_images` (relation): Associated background images
- `preview_image` (media): Variant preview
- `is_default` (boolean): Default variant flag
- `sort_order` (integer): Display order
- `is_active` (boolean): Availability status

### 4. Background Image (`/api/background-images`)

Background images with position metadata.

**Fields:**

- `name` (string): Image name
- `description` (text): Image description
- `image` (media): The actual image file
- `position` (enum): Background position type
- `css_properties` (json): CSS styling properties
- `variant` (relation): Associated variant
- `is_default` (boolean): Default image flag
- `tags` (json): Categorization tags

## API Endpoints

### Templates

#### Get All Active Templates

```
GET /api/templates/active
```

Response:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Pitch Deck Template",
      "slug": "pitch-deck",
      "template_type": "pitch-deck",
      "thumbnail": {
        "url": "/uploads/pitch_deck_thumb.jpg"
      },
      "slide_types": {
        "count": 7
      }
    }
  ]
}
```

#### Get Template by Slug with All Data

```
GET /api/templates/slug/{slug}
```

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Pitch Deck Template",
    "slug": "pitch-deck",
    "description": "Professional pitch deck template",
    "template_type": "pitch-deck",
    "default_styles": {
      "primaryColor": "#2563eb",
      "secondaryColor": "#64748b",
      "fontFamily": "Inter, system-ui, sans-serif"
    },
    "global_css": "/* Global styles */",
    "slide_types": [
      {
        "id": 1,
        "name": "Title Slide",
        "slug": "title-slide",
        "slide_type_key": "title-slide",
        "html_structure": "<slide-node>...</slide-node>",
        "scss_styles": ".slide-container[data-type=\"title-slide\"] { ... }",
        "placeholder_config": {
          "title": { "type": "text", "required": true },
          "subtitle": { "type": "text", "required": false }
        },
        "variants": [
          {
            "id": 1,
            "name": "Default",
            "variant_key": "default",
            "additional_css": "",
            "background_config": {
              "position": "center",
              "size": "cover"
            },
            "is_default": true
          }
        ]
      }
    ]
  }
}
```

## Next.js Integration Examples

### 1. Fetching Template Data

```javascript
// lib/strapi.js
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getTemplateBySlug(slug) {
  const response = await fetch(`${STRAPI_URL}/api/templates/slug/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch template');
  }

  return response.json();
}

export async function getAllActiveTemplates() {
  const response = await fetch(`${STRAPI_URL}/api/templates/active`);

  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return response.json();
}
```

### 2. Template Renderer Component

```jsx
// components/TemplateRenderer.jsx
import { useState, useEffect } from 'react';
import { getTemplateBySlug } from '../lib/strapi';

export default function TemplateRenderer({ templateSlug, slideData }) {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplate() {
      try {
        const templateData = await getTemplateBySlug(templateSlug);
        setTemplate(templateData.data);
      } catch (error) {
        console.error('Error loading template:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTemplate();
  }, [templateSlug]);

  if (loading) return <div>Loading template...</div>;
  if (!template) return <div>Template not found</div>;

  return (
    <div className='template-container'>
      <style jsx global>{`
        ${template.global_css}
      `}</style>

      {slideData.map((slide, index) => (
        <SlideRenderer
          key={index}
          slideType={template.slide_types.find((st) => st.slide_type_key === slide.type)}
          variant={slide.variant || 'default'}
          data={slide.data}
          slideNumber={index + 1}
        />
      ))}
    </div>
  );
}
```

### 3. Slide Renderer Component

```jsx
// components/SlideRenderer.jsx
import { renderTemplate } from '../lib/template-engine';

export default function SlideRenderer({ slideType, variant, data, slideNumber }) {
  if (!slideType) return null;

  const selectedVariant =
    slideType.variants.find((v) => v.variant_key === variant) ||
    slideType.variants.find((v) => v.is_default) ||
    slideType.variants[0];

  const htmlContent = renderTemplate(slideType.html_structure, {
    ...data,
    variant,
    slideNumber,
  });

  return (
    <div className='slide-wrapper'>
      <style jsx>{`
        ${slideType.scss_styles}
        ${selectedVariant?.additional_css || ''}
      `}</style>

      <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='slide-content' />
    </div>
  );
}
```

### 4. Template Engine Helper

```javascript
// lib/template-engine.js
export function renderTemplate(template, data) {
  let rendered = template;

  // Replace simple variables
  Object.keys(data).forEach((key) => {
    const value = data[key];
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, value || '');
  });

  // Handle conditional blocks
  rendered = rendered.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
    return data[condition] ? content : '';
  });

  // Handle loops
  rendered = rendered.replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, content) => {
    const array = data[arrayName];
    if (!Array.isArray(array)) return '';

    return array
      .map((item, index) => {
        let itemContent = content;

        // Replace {{this}} with item value
        itemContent = itemContent.replace(/{{this}}/g, item);

        // Replace {{@index}} with index
        itemContent = itemContent.replace(/{{@index}}/g, index + 1);

        // Replace object properties
        if (typeof item === 'object') {
          Object.keys(item).forEach((prop) => {
            const regex = new RegExp(`{{${prop}}}`, 'g');
            itemContent = itemContent.replace(regex, item[prop] || '');
          });
        }

        return itemContent;
      })
      .join('');
  });

  return rendered;
}
```

### 5. Usage Example

```jsx
// pages/presentation/[id].js
import { useRouter } from 'next/router';
import TemplateRenderer from '../../components/TemplateRenderer';

export default function PresentationPage() {
  const router = useRouter();

  // Sample slide data
  const slideData = [
    {
      type: 'title-slide',
      variant: 'default',
      data: {
        title: 'My Awesome Presentation',
        subtitle: 'Revolutionary Product Launch',
        presenterName: 'John Doe',
        presenterTitle: 'CEO',
        companyName: 'TechCorp Inc.',
      },
    },
    {
      type: 'agenda-slide',
      variant: 'left-heading',
      data: {
        title: "Today's Agenda",
        agendaItems: [
          'Problem Statement',
          'Our Solution',
          'Market Opportunity',
          'Business Model',
          'Financial Projections',
        ],
      },
    },
  ];

  return <TemplateRenderer templateSlug='pitch-deck' slideData={slideData} />;
}
```

## Environment Variables

Add these to your Next.js `.env.local`:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Migration Guide

1. **Replace hardcoded templates** with API calls to fetch template data
2. **Update slide rendering logic** to use dynamic HTML structures from Strapi
3. **Implement template engine** to handle placeholders and conditionals
4. **Add media handling** for background images and assets
5. **Create admin interface** for non-technical users to manage templates

This system provides complete flexibility for creating and managing presentation templates through the Strapi admin panel while maintaining the same custom HTML elements and data attributes you're currently using.
