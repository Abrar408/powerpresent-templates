'use strict';

/**
 * Admin panel configuration for presentation template system
 */

module.exports = ({ env }) => ({
  // Admin panel customizations
  config: {
    // Enable the content manager for our custom content types
    'content-manager': {
      enabled: true,
    },
    // Enable media library for image handling
    upload: {
      enabled: true,
      config: {
        provider: 'local',
        providerOptions: {
          sizeLimit: 100000000, // 100mb
        },
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64,
        },
      },
    },
  },

  // Custom admin layout configurations
  layouts: {
    // Template management layout
    'api::template.template': {
      edit: [
        {
          name: 'basic-info',
          size: 6,
          fields: ['name', 'slug', 'description', 'template_type'],
        },
        {
          name: 'settings',
          size: 6,
          fields: ['is_active', 'created_by_user', 'thumbnail'],
        },
        {
          name: 'styling',
          size: 12,
          fields: ['default_styles', 'global_css'],
        },
        {
          name: 'relationships',
          size: 12,
          fields: ['slide_types'],
        },
      ],
      list: ['name', 'template_type', 'is_active', 'createdAt'],
    },

    // Slide type layout
    'api::slide-type.slide-type': {
      edit: [
        {
          name: 'basic-info',
          size: 6,
          fields: ['name', 'slug', 'slide_type_key', 'description'],
        },
        {
          name: 'media',
          size: 6,
          fields: ['thumbnail', 'background_image'],
        },
        {
          name: 'structure',
          size: 12,
          fields: ['html_structure'],
        },
        {
          name: 'styling',
          size: 12,
          fields: ['scss_styles'],
        },
        {
          name: 'configuration',
          size: 6,
          fields: ['data_attributes', 'placeholder_config'],
        },
        {
          name: 'settings',
          size: 6,
          fields: ['sort_order', 'is_active'],
        },
        {
          name: 'relationships',
          size: 12,
          fields: ['template', 'variants'],
        },
      ],
      list: ['name', 'slide_type_key', 'template', 'is_active', 'sort_order'],
    },

    // Template variant layout
    'api::template-variant.template-variant': {
      edit: [
        {
          name: 'basic-info',
          size: 6,
          fields: ['name', 'slug', 'variant_key', 'description'],
        },
        {
          name: 'settings',
          size: 6,
          fields: ['is_default', 'sort_order', 'is_active', 'preview_image'],
        },
        {
          name: 'customization',
          size: 12,
          fields: ['additional_css', 'html_modifications'],
        },
        {
          name: 'configuration',
          size: 6,
          fields: ['background_config', 'layout_config'],
        },
        {
          name: 'relationships',
          size: 6,
          fields: ['slide_type', 'background_images'],
        },
      ],
      list: ['name', 'variant_key', 'slide_type', 'is_default', 'is_active'],
    },
  },

  // Field customizations
  fields: {
    // Code editor for HTML and CSS fields
    html_structure: {
      type: 'textarea',
      customField: 'plugin::code-editor.code-editor',
      options: {
        language: 'html',
        theme: 'dark',
      },
    },
    scss_styles: {
      type: 'textarea',
      customField: 'plugin::code-editor.code-editor',
      options: {
        language: 'scss',
        theme: 'dark',
      },
    },
    additional_css: {
      type: 'textarea',
      customField: 'plugin::code-editor.code-editor',
      options: {
        language: 'css',
        theme: 'dark',
      },
    },
    global_css: {
      type: 'textarea',
      customField: 'plugin::code-editor.code-editor',
      options: {
        language: 'scss',
        theme: 'dark',
      },
    },
    html_modifications: {
      type: 'textarea',
      customField: 'plugin::code-editor.code-editor',
      options: {
        language: 'html',
        theme: 'dark',
      },
    },
  },
});
