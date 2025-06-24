import { TypesenseService, TypesenseDocument } from '@/core/infrastructure/typesense';
import { Property } from '../entities/property.orm-entity';
import { FieldType } from 'typesense/lib/Typesense/Collection';
import { PropertyType } from '@/core/enums/enums';

// Define the document type for Property
interface PropertyDocument extends TypesenseDocument {
  name: string;
  description: string;
  price: number;
  address: string;
  adType: string;
  type: string;
  views: number;
  createdBy: string;
  ownedBy: string;
  extras: string;
  created_at: number;
  updated_at: number;
}

/**
 * Typesense service for Property entities
 */
export class PropertyTypesenseService extends TypesenseService<Property, PropertyDocument> {
  constructor() {
    // Define the collection schema
    const propertyCollectionSchema = {
      name: 'properties',
      fields: [
        { name: 'id', type: 'string' as FieldType, facet: false },
        { name: 'name', type: 'string' as FieldType, facet: false },
        { name: 'description', type: 'string' as FieldType, facet: false, optional: true },
        { name: 'price', type: 'float' as FieldType, facet: false },
        { name: 'address', type: 'string' as FieldType, facet: false, optional: true },
        { name: 'adType', type: 'string' as FieldType, facet: true },
        { name: 'type', type: 'string' as FieldType, facet: true },
        { name: 'views', type: 'int32' as FieldType, facet: false },
        { name: 'createdBy', type: 'string' as FieldType, facet: false, optional: true },
        { name: 'ownedBy', type: 'string' as FieldType, facet: false, optional: true },
        { name: 'extras', type: 'string' as FieldType, facet: true },
        { name: 'created_at', type: 'int64' as FieldType, facet: false },
        { name: 'updated_at', type: 'int64' as FieldType, facet: false },
      ],
      default_sorting_field: 'updated_at',
    };
    
    // Call parent constructor with collection name and schema
    super('properties', propertyCollectionSchema);
  }

  /**
   * Convert Property entity to Typesense document
   */
  protected entityToDocument(property: Property): PropertyDocument {
    return {
      id: property.id,
      name: property.name,
      description: property.description || '',
      price: property.price,
      address: property.address || '',
      adType: property.adType,
      type: property.type,
      views: property.views,
      createdBy: property.createdBy || '',
      ownedBy: property.ownedBy || '',
      extras: JSON.stringify(property.extras || {}),
      created_at: new Date(property.createdAt).getTime(),
      updated_at: new Date(property.updatedAt).getTime(),
    };
  }

  /**
   * Convert Typesense document to Property entity
   */
  protected documentToEntity(document: PropertyDocument): Property {
    const property = new Property();
    property.id = document.id;
    property.name = document.name;
    property.description = document.description;
    property.price = document.price;
    property.address = document.address;
    property.views = document.views;
    property.createdBy = document.createdBy;
    property.ownedBy = document.ownedBy;
    property.type = document.type as PropertyType;
    property.extras = JSON.parse(document.extras);
    property.createdAt = new Date(document.created_at);
    property.updatedAt = new Date(document.updated_at);
    property.isActive = true;
    property.deletedAt = null;
    return property;
  }
}
