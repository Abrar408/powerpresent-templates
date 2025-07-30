# Simplified Presentation Template System

## 🎯 Structure Overview

Your Strapi CMS now has a clean, simplified structure with two content types and two components:

### 📋 Content Types

#### 1. **TEMPLATE**

- **Fields:**
  - `name` (string, required, unique)
  - `slides` (relation: one-to-many with Slide)

#### 2. **SLIDE**

- **Fields:**
  - `name` (string, required)
  - `variant` (string)
  - `background_color` (json) - single color or gradient
  - `background_image` (media) - optional background image
  - `layout` (json) - grid or flex configuration
  - `template` (relation: many-to-one with Template)
  - `elements` (component: repeatable Element)

### 🧩 Components

#### 3. **ELEMENT** (Component)

- **Fields:**
  - `type` (enum: heading1, heading2, paragraph, bullet-points, image, shape, group, required)
  - `config` (component: Element Config)
  - `children` (component: repeatable Element) - for nested elements

#### 4. **ELEMENT CONFIG** (Component)

- **Fields:**
  - `text_align` (enum: left, center, right, justify)
  - `color` (json) - single color or gradient
  - `background_color` (json) - single color or gradient
  - `padding` (json) - {top, right, bottom, left}
  - `margin` (json) - {top, right, bottom, left}
  - `border_radius` (json) - {top, right, bottom, left}
  - `width` (string) - CSS width value
  - `height` (string) - CSS height value

## 🏗️ Relationships

```
Template
  └── Slides (multiple)
      └── Elements (component array)
          ├── config (Element Config component)
          └── children (nested Element components)
              ├── config (Element Config component)
              └── children (further nested Element components)
```

## 🎯 Element Structure

Each element follows this structure using pure components:

```json
{
  "type": "group",
  "config": {
    "background_color": { "type": "single", "value": "#ffffff" },
    "padding": { "top": "2rem", "right": "2rem", "bottom": "2rem", "left": "2rem" }
  },
  "children": [
    {
      "type": "heading2",
      "config": {
        "text_align": "left",
        "color": { "type": "single", "value": "#1e293b" }
      }
    },
    {
      "type": "bullet-points",
      "config": {
        "text_align": "left",
        "color": { "type": "single", "value": "#475569" }
      }
    }
  ]
}
```

## 🔄 Component-Based Nested Elements

- **Pure Components**: No content types needed for elements
- **Self-Referential**: Element component references itself for children
- **Infinite Nesting**: Elements can be nested to any depth through components
- **Embedded Data**: All element data is stored directly in the slide
- **No Relations**: No database relationships needed for element hierarchy

## ✅ Benefits

1. **Simpler Structure**: No separate element content type to manage
2. **Embedded Data**: All element data stored with the slide
3. **Better Performance**: No additional database queries for element relations
4. **Atomic Operations**: Creating/updating slides includes all elements in one operation
5. **Self-Contained**: Each slide contains all its element data

## 📁 File Structure

```
src/api/
├── template/
│   ├── content-types/template/schema.json
│   ├── controllers/template.js
│   ├── routes/template.js
│   └── services/template.js
├── slide/
│   ├── content-types/slide/schema.json
│   ├── controllers/slide.js
│   ├── routes/slide.js
│   └── services/slide.js
└── element/
    ├── content-types/element/schema.json
    ├── controllers/element.js
    ├── routes/element.js
    └── services/element.js
```

## 🚀 Getting Started

### 1. Start Strapi

```bash
npm run develop
```

### 2. Access Admin Panel

Navigate to `http://localhost:1337/admin`

### 3. Seed Sample Data

```bash
npm run seed:example  # Seeds everything including simple templates
# OR
npm run seed:simple   # Seeds only the simple template system
```

## 📊 Sample Data Structure

The seed script creates:

### Template: "My Presentation Template"

- **Slide 1: "Title Slide"**

  - Variant: centered
  - Background: white
  - Layout: flex column, centered
  - **Elements:**
    - Heading1 (centered, dark text)
    - Paragraph (centered, gray text)

- **Slide 2: "Content Slide"**
  - Variant: standard
  - Background: gradient (light gray)
  - Layout: 2-column grid
  - **Elements:**
    - Heading2 (left-aligned)
    - Bullet-points (styled box)
    - Image (rounded corners)

## 🔧 API Usage Examples

### Get Template with All Data

```javascript
// GET /api/templates/{id}?populate[slides][populate][elements]=*

const response = await fetch('/api/templates/1?populate[slides][populate][elements]=*');
const template = await response.json();

// Structure:
{
  "data": {
    "id": 1,
    "name": "My Presentation Template",
    "slides": [
      {
        "id": 1,
        "name": "Title Slide",
        "variant": "centered",
        "background_color": { "type": "single", "value": "#ffffff" },
        "layout": { "type": "flex", "direction": "column" },
        "elements": [
          {
            "id": 1,
            "type": "heading1",
            "text_align": "center",
            "color": { "type": "single", "value": "#1e293b" }
          }
        ]
      }
    ]
  }
}
```

### Frontend Rendering Example

```jsx
function TemplateRenderer({ templateData }) {
  return (
    <div className='template'>
      {templateData.slides.map((slide) => (
        <div
          key={slide.id}
          className='slide'
          style={{
            backgroundColor: slide.background_color?.value,
            backgroundImage: slide.background_image ? `url(${slide.background_image.url})` : 'none',
          }}
        >
          {slide.elements.map((element) => (
            <div
              key={element.id}
              className={`element element-${element.type}`}
              style={{
                textAlign: element.text_align,
                color: element.color?.value,
                backgroundColor: element.background_color?.value,
                padding: `${element.padding?.top || 0} ${element.padding?.right || 0} ${element.padding?.bottom || 0} ${element.padding?.left || 0}`,
                margin: `${element.margin?.top || 0} ${element.margin?.right || 0} ${element.margin?.bottom || 0} ${element.margin?.left || 0}`,
                borderRadius: `${element.border_radius?.top || 0} ${element.border_radius?.right || 0} ${element.border_radius?.bottom || 0} ${element.border_radius?.left || 0}`,
                width: element.width,
                height: element.height,
              }}
            >
              {/* Render content based on element.type */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Color & Gradient Support

### Single Color

```json
{
  "type": "single",
  "value": "#3b82f6"
}
```

### Gradient

```json
{
  "type": "gradient",
  "from": "#3b82f6",
  "to": "#1d4ed8",
  "direction": "to-right"
}
```

## 📱 Layout Configuration

### Flexbox

```json
{
  "type": "flex",
  "direction": "column",
  "justifyContent": "center",
  "alignItems": "center",
  "gap": "1rem"
}
```

### Grid

```json
{
  "type": "grid",
  "columns": 2,
  "rows": 3,
  "gap": "2rem",
  "templateAreas": "header header"
}
```

## 🛠️ Customization

### Adding New Element Types

1. Update the `type` enum in `element/schema.json`
2. Add corresponding frontend rendering logic
3. Restart Strapi to apply changes

### Extending Layouts

Add new layout configurations in the `layout` JSON field of slides.

### Custom Styling Properties

Extend the element schema with additional styling fields as needed.

This simplified structure gives you maximum flexibility while keeping the data model clean and maintainable. Each component (element) has full styling control, and the hierarchical structure (Template → Slide → Element) makes it easy to organize and manage presentation content.
