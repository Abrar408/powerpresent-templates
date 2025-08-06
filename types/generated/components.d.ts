import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBackgroundElement extends Struct.ComponentSchema {
  collectionName: 'components_shared_background_elements';
  info: {
    displayName: 'Background Element';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    position: Schema.Attribute.Enumeration<
      [
        'left',
        'right',
        'top',
        'bottom',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'center',
        'cover',
        'contain',
      ]
    >;
  };
}

export interface SharedChildElement extends Struct.ComponentSchema {
  collectionName: 'components_shared_child_elements';
  info: {
    displayName: 'Child Element';
  };
  attributes: {
    background_element: Schema.Attribute.Component<
      'shared.background-element',
      false
    >;
    children: Schema.Attribute.Component<'shared.nested-child-element', true>;
    custom_style_node: Schema.Attribute.String;
    data_type: Schema.Attribute.Enumeration<['numbered-bullet', 'icon']>;
    media: Schema.Attribute.Media<'images'>;
    repeat: Schema.Attribute.Integer;
    style: Schema.Attribute.JSON;
    type: Schema.Attribute.Enumeration<
      [
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'paragraph',
        'ordered-bullets',
        'un-ordered-bullets',
        'image',
        'shape',
        'group',
        'background-element',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedDeepNestedChildElement extends Struct.ComponentSchema {
  collectionName: 'components_shared_deep_nested_child_elements';
  info: {
    displayName: 'Deep Nested Child Element';
  };
  attributes: {
    background_element: Schema.Attribute.Component<
      'shared.background-element',
      false
    >;
    custom_style_node: Schema.Attribute.String;
    data_type: Schema.Attribute.Enumeration<['numbered-bullet', 'icon']>;
    media: Schema.Attribute.Media<'images'>;
    repeat: Schema.Attribute.Integer;
    style: Schema.Attribute.JSON;
    type: Schema.Attribute.Enumeration<
      [
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'paragraph',
        'ordered-bullets',
        'un-ordered-bullets',
        'image',
        'shape',
        'background-element',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedElement extends Struct.ComponentSchema {
  collectionName: 'components_shared_elements';
  info: {
    displayName: 'Element';
  };
  attributes: {
    background_element: Schema.Attribute.Component<
      'shared.background-element',
      false
    >;
    children: Schema.Attribute.Component<'shared.child-element', true>;
    custom_style_node: Schema.Attribute.String;
    data_type: Schema.Attribute.Enumeration<['numbered-bullet', 'icon']>;
    media: Schema.Attribute.Media<'images'>;
    repeat: Schema.Attribute.Integer;
    style: Schema.Attribute.JSON;
    type: Schema.Attribute.Enumeration<
      [
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'paragraph',
        'span',
        'ordered-bullets',
        'un-ordered-bullets',
        'image',
        'group',
        'shape',
        'background-element',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedNestedChildElement extends Struct.ComponentSchema {
  collectionName: 'components_shared_nested_child_elements';
  info: {
    displayName: 'Nested Child Element';
  };
  attributes: {
    background_element: Schema.Attribute.Component<
      'shared.background-element',
      false
    >;
    children: Schema.Attribute.Component<
      'shared.deep-nested-child-element',
      true
    >;
    custom_style_node: Schema.Attribute.String;
    data_type: Schema.Attribute.Enumeration<['numbered-bullet', 'icon']>;
    media: Schema.Attribute.Media<'images'>;
    repeat: Schema.Attribute.Integer;
    style: Schema.Attribute.JSON;
    type: Schema.Attribute.Enumeration<
      [
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'paragraph',
        'ordered-bullets',
        'un-ordered-bullets',
        'image',
        'shape',
        'group',
        'background-element',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.background-element': SharedBackgroundElement;
      'shared.child-element': SharedChildElement;
      'shared.deep-nested-child-element': SharedDeepNestedChildElement;
      'shared.element': SharedElement;
      'shared.media': SharedMedia;
      'shared.nested-child-element': SharedNestedChildElement;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
