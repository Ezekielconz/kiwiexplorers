import type { Schema, Struct } from '@strapi/strapi';

export interface PrinciplePrinciples extends Struct.ComponentSchema {
  collectionName: 'components_principle_principles';
  info: {
    displayName: 'principles';
    icon: 'book';
  };
  attributes: {
    description: Schema.Attribute.Text;
    labelMi: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'principle.principles': PrinciplePrinciples;
    }
  }
}
