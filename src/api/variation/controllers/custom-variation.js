/**
 * Custom controller for creating slide variations
 */

'use strict';

module.exports = {
  /**
   * Copy ALL slides from slide collection to variation collection
   */
  async copyAllSlidesToVariations(ctx) {
    try {
      // Fetch ALL slides with their complete data structure
      const slides = await strapi.entityService.findMany('api::slide.slide', {
        populate: {
          template: true,
          elements: {
            populate: {
              media: true,
              background_element: {
                populate: {
                  media: true,
                },
              },
              children: {
                // Populate child elements
                populate: {
                  children: {
                    // Populate nested-child elements
                    populate: {
                      children: {
                        // Populate deep-nested-child elements
                        populate: {
                          media: true,
                          background_element: {
                            populate: {
                              media: true,
                            },
                          },
                        },
                      },
                      media: true,
                      background_element: {
                        populate: {
                          media: true,
                        },
                      },
                    },
                  },
                  media: true,
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
        pagination: {
          start: 0,
          limit: -1, // Get all records
        },
      });

      if (!slides || slides.length === 0) {
        return ctx.badRequest('No slides found to copy');
      }

      const createdVariations = [];
      const errors = [];

      // Process each slide
      for (const slide of slides) {
        try {
          // Extract all fields including name (since you added it to variation)
          const variationData = {
            name: `${slide.template.name}_${slide.name}`, // Now included since you added name field to variation
            variant: slide.variant || `slide_${slide.id}_variant`,
            background_image: slide.background_image || null,
            style: slide.style || {},
            elements: slide.elements || [],
            background_color: slide.background_color || null,
          };

          // Create the new variation with complete data structure
          const newVariation = await strapi.entityService.create('api::variation.variation', {
            data: variationData,
            populate: {
              elements: {
                populate: {
                  media: true,
                  background_element: {
                    populate: {
                      media: true,
                    },
                  },
                  children: {
                    // Populate child elements
                    populate: {
                      children: {
                        // Populate nested-child elements
                        populate: {
                          children: {
                            // Populate deep-nested-child elements
                            populate: {
                              media: true,
                              background_element: {
                                populate: {
                                  media: true,
                                },
                              },
                            },
                          },
                          media: true,
                          background_element: {
                            populate: {
                              media: true,
                            },
                          },
                        },
                      },
                      media: true,
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
          });

          createdVariations.push({
            variationId: newVariation.id,
            sourceSlideId: slide.id,
            sourceSlideName: slide.name,
            variant: newVariation.variant,
          });
        } catch (slideError) {
          console.error(`Error copying slide ${slide.id}:`, slideError);
          errors.push({
            slideId: slide.id,
            slideName: slide.name,
            error: slideError.message,
          });
        }
      }

      ctx.body = {
        message: 'Bulk copy operation completed',
        summary: {
          totalSlides: slides.length,
          successfulCopies: createdVariations.length,
          errors: errors.length,
        },
        createdVariations,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error('Error in bulk copy operation:', error);
      ctx.throw(500, 'Failed to copy slides to variations');
    }
  },
};
