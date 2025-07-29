# Presentation Template System Setup Guide

## Overview

This guide will help you set up the complete presentation template system in your Strapi CMS. The system provides a dynamic alternative to hardcoded HTML templates, allowing non-technical users to create and manage presentation templates through the Strapi admin interface.

## Prerequisites

- Node.js 18+
- Strapi 5.x project
- Basic understanding of Strapi concepts

## Installation Steps

### 1. Project Structure Verification

Ensure your Strapi project has the following structure created:

```
src/
├── api/
│   ├── template/
│   │   ├── content-types/template/schema.json
│   │   ├── controllers/template.js
│   │   ├── routes/template.js
│   │   └── services/template.js
│   ├── slide-type/
│   │   ├── content-types/slide-type/schema.json
│   │   ├── controllers/slide-type.js
│   │   ├── routes/slide-type.js
│   │   └── services/slide-type.js
│   ├── template-variant/
│   │   ├── content-types/template-variant/schema.json
│   │   ├── controllers/template-variant.js
│   │   ├── routes/template-variant.js
│   │   └── services/template-variant.js
│   └── background-image/
│       ├── content-types/background-image/schema.json
│       ├── controllers/background-image.js
│       ├── routes/background-image.js
│       └── services/background-image.js
├── admin/
│   └── admin-config.js
└── ...
```

### 2. Database Migration

After adding the new content types, restart your Strapi server:

```bash
npm run develop
```

Strapi will automatically detect the new content types and create the necessary database tables.

### 3. Seed Sample Data

Run the seeding script to populate your database with the complete "pitch-deck" template:

```bash
npm run seed:example
```

This will create:

- 1 Pitch Deck template
- 7 slide types (title, agenda, accent-image, etc.)
- Multiple variants for each slide type
- Background image configurations

### 4. Admin Panel Configuration

The admin panel has been configured with custom layouts for easy template management. Key features include:

- **Code Editor Fields**: HTML and CSS fields use syntax highlighting
- **Organized Layouts**: Fields are grouped logically for better UX
- **Media Management**: Integrated image upload and management
- **Relationship Management**: Easy linking between templates, slide types, and variants

### 5. API Permissions

The seed script automatically sets up public read permissions for:

- Templates (`find`, `findOne`)
- Slide Types (`find`, `findOne`)
- Template Variants (`find`, `findOne`)
- Background Images (`find`, `findOne`)

For production, review and adjust these permissions based on your security requirements.

## Usage Instructions

### Admin Panel Usage

1. **Access Admin Panel**: Navigate to `http://localhost:1337/admin`

2. **Managing Templates**:

   - Go to Content Manager → Template
   - Create new templates or edit existing ones
   - Upload template thumbnails
   - Configure default styles and global CSS

3. **Managing Slide Types**:

   - Go to Content Manager → Slide Type
   - Edit HTML structures using the code editor
   - Configure SCSS styles
   - Set up placeholder configurations for dynamic content
   - Upload slide type thumbnails

4. **Managing Variants**:

   - Go to Content Manager → Template Variant
   - Create layout variations
   - Add additional CSS for customizations
   - Configure background image positioning

5. **Background Images**:
   - Go to Content Manager → Background Image
   - Upload images with position metadata
   - Tag images for easy categorization

### API Integration

#### Key Endpoints

1. **Get All Templates**:

   ```
   GET /api/templates/active
   ```

2. **Get Template with All Data**:

   ```
   GET /api/templates/slug/{slug}
   ```

3. **Get Slide Types for Template**:
   ```
   GET /api/slide-types/template/{templateId}
   ```

#### Sample API Response

```json
{
  "data": {
    "id": 1,
    "name": "Pitch Deck Template",
    "slug": "pitch-deck",
    "template_type": "pitch-deck",
    "default_styles": {
      "primaryColor": "#2563eb",
      "fontFamily": "Inter, system-ui, sans-serif"
    },
    "global_css": "/* Global styles */",
    "slide_types": [
      {
        "id": 1,
        "name": "Title Slide",
        "slide_type_key": "title-slide",
        "html_structure": "<slide-node>...</slide-node>",
        "variants": [
          {
            "variant_key": "default",
            "additional_css": "",
            "is_default": true
          }
        ]
      }
    ]
  }
}
```

## Next.js Integration

### 1. Environment Setup

Add to your `.env.local`:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### 2. API Client Setup

Create `lib/strapi.js`:

```javascript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getTemplateBySlug(slug) {
  const response = await fetch(`${STRAPI_URL}/api/templates/slug/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch template');
  return response.json();
}
```

### 3. Template Rendering

See the API documentation for complete component examples.

## Customization Options

### Adding New Slide Types

1. Add the new slide type key to the enum in `slide-type/schema.json`
2. Create the slide type through the admin panel
3. Define HTML structure with placeholders
4. Add SCSS styling
5. Configure placeholder schema for form generation

### Adding New Variants

1. Add variant key to the enum in `template-variant/schema.json`
2. Create variant through admin panel
3. Define additional CSS and background configurations
4. Associate with appropriate slide types

### Adding New Template Types

1. Add template type to the enum in `template/schema.json`
2. Create template through admin panel
3. Build associated slide types and variants

## Migration from Hardcoded Templates

### Step 1: Audit Current Templates

- List all current slide types and variants
- Document HTML structures and CSS styles
- Identify placeholder patterns

### Step 2: Create Content Types

- Use the provided schema as a starting point
- Adjust enums to match your current slide types/variants
- Customize field configurations

### Step 3: Import Existing Templates

- Create templates through admin panel or API
- Copy HTML structures and styles
- Convert hardcoded values to placeholder patterns

### Step 4: Update Frontend Code

- Replace hardcoded template imports with API calls
- Implement template rendering engine
- Add placeholder replacement logic

### Step 5: User Training

- Train content creators on admin panel usage
- Document template creation workflows
- Set up content governance processes

## Troubleshooting

### Common Issues

1. **Content Types Not Appearing**:

   - Restart Strapi server after adding schema files
   - Check for syntax errors in schema.json files

2. **API Endpoints Not Working**:

   - Verify controller and route files are properly configured
   - Check API permissions in admin panel

3. **Seed Script Failing**:
   - Ensure database is accessible
   - Check for required field validations
   - Verify relationship configurations

### Performance Optimization

1. **API Caching**: Implement caching for template data
2. **Image Optimization**: Use Strapi's image processing features
3. **Database Indexing**: Add indexes on frequently queried fields
4. **CDN Integration**: Configure CDN for media files

## Security Considerations

1. **API Permissions**: Review and restrict permissions for production
2. **Content Validation**: Add validation for HTML/CSS content
3. **User Roles**: Set up appropriate user roles and permissions
4. **Input Sanitization**: Sanitize user inputs to prevent XSS

## Maintenance

### Regular Tasks

1. **Backup Database**: Regular backups of template data
2. **Monitor Usage**: Track API usage and performance
3. **Update Dependencies**: Keep Strapi and plugins updated
4. **Content Audits**: Regular review of template content

### Monitoring

Set up monitoring for:

- API response times
- Database performance
- Content creation activities
- Error rates

This system provides a robust foundation for dynamic presentation template management while maintaining the flexibility to customize and extend based on your specific requirements.
