'use strict';

/**
 * template service
 */

//@ts-ignore
const { createCoreService } = require('@strapi/strapi').factories;
const fs = require('fs');
const path = require('path');

module.exports = createCoreService('api::template.template', ({ strapi }) => ({
  cleanContent(content) {
    return content
      .replace(/\\n/g, '') // Remove \n
      .replace(/\\/g, ''); // Remove backslashes before quotes
  },

  // Custom service method to get template by name with all nested data
  async findTemplateByNameWithAllData(name) {
    const templates = await strapi.entityService.findMany('api::template.template', {
      filters: { name },
      populate: {
        slides: {
          populate: {
            elements: {
              populate: {
                background_element: {
                  populate: {
                    media: true,
                  },
                },
                children: {
                  populate: {
                    children: {
                      populate: {
                        background_element: {
                          populate: {
                            media: true,
                          },
                        },
                      },
                    },
                    background_element: {
                      populate: {
                        media: true,
                      },
                    },
                  },
                },
              },
            },
            background_image: true,
          },
        },
      },
    });

    // Return the first template since name is unique
    if (templates.length === 0) {
      return null;
    }

    const template = templates[0];

    // Generate combined HTML and SCSS for all slides
    let combinedHTML = '';
    let combinedSCSS = '';

    template.slides.forEach((slide, slideIndex) => {
      combinedHTML += this.generateSlideHTML(slide, slideIndex + 1, template.name);

      combinedSCSS += this.generateSlideScss(slide, template.name);
    });

    const scssWithStructure = `.tiptap.ProseMirror {
  .node-dataNode {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    /* Default styling */
    background-color: transparent;

    .tiptap-data-node {
    &.template-${template.name} {\n ${combinedSCSS}\n}
    }}}`;

    // Save SCSS to file
    await this.saveScssToFile(scssWithStructure, template.name);

    // Return only the essential data with combined HTML and SCSS
    return {
      id: template.id,
      name: template.name,
      html: combinedHTML,
      scss: combinedSCSS,
    };
  },

  // Helper method to generate HTML for a slide
  generateSlideHTML(slide, slideNumber, templateName) {
    const elements = slide.elements || [];
    const slideType = slide.name;
    const variant = slide.variant || 'default';
    let htmlContent = '';

    // Process each element
    elements.forEach((element) => {
      const repeatCount = element.repeat || 1; // Default to 1 if no repeat specified

      for (let i = 0; i < repeatCount; i++) {
        if (element.type === 'group') {
          // Group elements become <block-node>
          htmlContent += '\n          <block-node>\n          ';
          if (element.children) {
            element.children.forEach((child) => {
              const childRepeatCount = child.repeat || 1;

              for (let j = 0; j < childRepeatCount; j++) {
                if (child.type === 'group') {
                  // Handle nested group elements
                  htmlContent += '<block-node>\n          ';
                  if (child.children) {
                    child.children.forEach((grandChild) => {
                      const grandChildRepeatCount = grandChild.repeat || 1;

                      for (let k = 0; k < grandChildRepeatCount; k++) {
                        htmlContent += this.generateElementHTML(grandChild) + '\n          ';
                      }
                    });
                  }
                  htmlContent += '</block-node>\n          ';
                } else {
                  htmlContent += this.generateElementHTML(child) + '\n          ';
                }
              }
            });
          }
          htmlContent += '</block-node>';
        } else if (element.type === 'background-element' && element.background_element) {
          // Background elements become img with data-type
          const position = element.background_element.position;
          const mediaUrl = element.background_element.media?.url;
          const altText = element.background_element.media?.alternativeText || 'Background Image';

          if (mediaUrl) {
            htmlContent += `\n          <img data-type='${position}-background' src="${process.env.MEDIA_URL}${mediaUrl}" alt="${altText}" />`;
          }
        } else {
          // Other elements
          htmlContent += '\n      ' + this.generateElementHTML(element);
        }
      }
    });

    // Generate the complete slide HTML with proper formatting for TipTap
    const backgroundColor = slide.background_color || '#ffffff';

    return `<slide-node data-slide-number="${slideNumber}">
        <data-node style="background-color: ${backgroundColor};" data-template="${templateName}" data-type="${slideType}" data-variant="${variant}" data-slide-number="${slideNumber}">
          ${htmlContent}
        </data-node>
      </slide-node>\n`;
  },

  // Helper method to generate HTML for individual elements
  generateElementHTML(element) {
    switch (element.type) {
      case 'heading1':
        return '<h1>Heading # 1</h1>';
      case 'heading2':
        return '<h2>Heading # 2</h2>';
      case 'heading3':
        return '<h3>Heading # 3</h3>';
      case 'heading4':
        return '<h4>Heading # 4</h4>';
      case 'paragraph':
        return '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu dolor nec magna varius laoreet. Aenean rhoncus elit tortor, vitae gravida ipsum vestibulum ut. Aenean accumsan non ipsum ac feugiat. Cras vitae sem lobortis, cursus felis sed, luctus sapien. Aliquam iaculis mauris vitae dui rhoncus, et accumsan nunc fin  vitae gravida ipsum vestibulum ut. Aenean accumsan non ipsum ac </p>';
      case 'un-ordered-bullets':
      case 'ordered-bullets':
        const listType = element.type === 'ordered-bullets' ? 'ol' : 'ul';
        return `<${listType}>
        <li>Heading # 4</li>
        <li>Heading # 4</li>
        <li>Heading # 4</li>
        <li>Heading # 4</li>
        <li>Heading # 4</li>
      </${listType}>`;
      case 'image':
        return '<img src="/assets/placeholder.png" alt="Product Demo" />';
      case 'shape':
        return '<shape-node></shape-node>';
      default:
        return '';
    }
  },

  // Helper method to generate SCSS for a slide
  generateSlideScss(slide, templateName) {
    const slideType = slide.name;
    const variant = slide.variant || 'default';
    const backgroundColor = slide.background_color || '#ffffff';

    let scss = `&.type-${slideType} {\n`;
    scss += `  &.variant-${variant} {\n`;
    scss += `    .data-node-content {\n`;
    scss += `      background-color: ${backgroundColor};\n`;
    scss += `      >div[data-node-view-content-react][data-node-view-wrapper] {\n`;

    // Add slide-level styles if present
    if (slide.style && typeof slide.style === 'object') {
      const slideStyles = this.convertStyleObjectToCSS(slide.style);
      if (slideStyles) {
        scss += `        ${slideStyles}\n`;
      }
    }

    // Process elements and their styles
    const elements = slide.elements || [];
    elements.forEach((element) => {
      if (element.type === 'group' && element.children) {
        // Process group element styles
        if (element.style && typeof element.style === 'object') {
          const groupStyles = this.convertStyleObjectToCSS(element.style);
          if (groupStyles) {
            scss += `        .tiptap-block-node {\n          ${groupStyles}`;

            // Process children elements within this group
            const childrenScss = this.generateChildrenScss(element.children, '          ');
            if (childrenScss) {
              scss += `\n${childrenScss}`;
            }

            scss += '\n        }\n';
          }
        } else {
          // Group without styles but with children
          scss += `        .tiptap-block-node {\n`;

          // Process children elements within this group
          const childrenScss = this.generateChildrenScss(element.children, '          ');
          if (childrenScss) {
            scss += `${childrenScss}`;
          }

          scss += '        }\n';
        }
      } else {
        // Process regular elements
        scss += this.generateElementScss(element);
      }
    });

    scss += '\n      }\n';
    scss += '    }\n';
    scss += '  }\n';
    scss += '}';
    return scss;
  },

  // Helper method to generate SCSS for children elements with proper nesting
  generateChildrenScss(children, indentation = '        ') {
    let childrenScss = '';

    children.forEach((child) => {
      if (child.type === 'group' && child.children) {
        // Handle nested group
        if (child.style && typeof child.style === 'object') {
          const nestedGroupStyles = this.convertStyleObjectToCSS(child.style);
          if (nestedGroupStyles) {
            childrenScss += `\n${indentation}  .tiptap-block-node {\n${indentation}    ${nestedGroupStyles.replace(/\n          /g, `\n${indentation}    `)}`;

            // Recursively process grandchildren
            const grandChildrenScss = this.generateChildrenScss(child.children, indentation + '    ');
            if (grandChildrenScss) {
              childrenScss += `${grandChildrenScss}`;
            }

            childrenScss += `\n${indentation}  }`;
          }
        } else {
          // Group without styles but with children
          childrenScss += `\n${indentation}  .tiptap-block-node {`;

          const grandChildrenScss = this.generateChildrenScss(child.children, indentation + '    ');
          if (grandChildrenScss) {
            childrenScss += `${grandChildrenScss}`;
          }

          childrenScss += `\n${indentation}  }`;
        }
      } else {
        // Handle regular child elements
        if (child.style && typeof child.style === 'object') {
          const elementStyles = this.convertStyleObjectToCSS(child.style);
          if (elementStyles) {
            const selector = this.getSelectorForElement(child);

            if (selector) {
              childrenScss += `\n\n${indentation}  ${selector} {\n${indentation}    ${elementStyles.replace(/\n          /g, `\n${indentation}    `)}\n${indentation}  }`;
            }
          }
        }
      }
    });

    return childrenScss;
  },

  // Helper method to generate SCSS for individual elements
  generateElementScss(element) {
    if (!element.style || typeof element.style !== 'object') {
      return '';
    }

    const elementStyles = this.convertStyleObjectToCSS(element.style);
    if (!elementStyles) {
      return '';
    }

    const selector = this.getSelectorForElement(element);

    return `        ${selector} {\n          ${elementStyles}\n        }\n`;
  },

  // Helper method to convert style object to CSS string
  convertStyleObjectToCSS(styleObj) {
    if (!styleObj || typeof styleObj !== 'object') {
      return '';
    }

    return Object.entries(styleObj)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();

        // Handle nested objects (like li styles)
        if (typeof value === 'object' && value !== null) {
          const nestedStyles = this.convertStyleObjectToCSS(value);
          if (nestedStyles) {
            return `${cssKey} {\n            ${nestedStyles}\n          }`;
          }
          return '';
        }

        return `${cssKey}: ${value};`;
      })
      .filter((style) => style !== '') // Remove empty styles
      .join('\n          ');
  },

  // Helper method to save SCSS to file
  async saveScssToFile(scssContent, templateName) {
    try {
      // Create styles directory if it doesn't exist
      const stylesDir = path.join(process.cwd(), 'public', 'styles');
      if (!fs.existsSync(stylesDir)) {
        fs.mkdirSync(stylesDir, { recursive: true });
      }

      // Save SCSS file
      const fileName = `${templateName}-template.scss`;
      const filePath = path.join(stylesDir, fileName);

      fs.writeFileSync(filePath, scssContent, 'utf8');

      strapi.log.info(`SCSS file saved: ${filePath}`);
      return filePath;
    } catch (error) {
      strapi.log.error('Error saving SCSS file:', error);
      throw error;
    }
  },

  getSelectorForElement(element) {
    if (element.custom_style_node && typeof element.custom_style_node === 'string') {
      return element.custom_style_node;
    }

    // Use default selectors based on element type
    switch (element.type) {
      case 'heading1':
        return '.node-heading:has(h1)';
      case 'heading2':
        return '.node-heading:has(h2)';
      case 'heading3':
        return '.node-heading:has(h3)';
      case 'heading4':
        return '.node-heading:has(h4)';
      case 'paragraph':
        return '.node-paragraph';
      case 'un-ordered-bullets':
        return 'ul';
      case 'ordered-bullets':
        return 'ol';
      case 'image':
        return '.node-image';
      case 'shape':
        return '.node-shapeNode';
      default:
        return '';
    }
  },
}));
