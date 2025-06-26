import { TypesenseService, TypesenseDocument } from '@/core/infrastructure/typesense';
import { Materials } from '../entities/materials.orm-entity';
import { FieldType } from 'typesense/lib/Typesense/Collection';

// Define the document type for Materials
interface MaterialsDocument extends TypesenseDocument {
  name: string;
  description: string;
  price: number;
  has_stock: boolean;
  quantity_in_stock: number;
  images: string;
  supplier_id: string;
  category_slug: string;
  extras: string;
  created_at: number;
  updated_at: number;
}

/**
 * Typesense service for Materials entities
 */
export class MaterialsTypesenseService extends TypesenseService<Materials, MaterialsDocument> {
  constructor() {
    // Define the collection schema
    const materialsCollectionSchema = {
      name: 'materials',
      fields: [
        { name: 'id', type: 'string' as FieldType, facet: false },
        { name: 'name', type: 'string' as FieldType, facet: false },
        { name: 'description', type: 'string' as FieldType, facet: false, optional: true },
        { name: 'price', type: 'float' as FieldType, facet: false },
        { name: 'has_stock', type: 'bool' as FieldType, facet: true, optional: true },
        { name: 'quantity_in_stock', type: 'int32' as FieldType, facet: false, optional: true },
        { name: 'images', type: 'string' as FieldType, facet: false, optional: true },
        { name: 'supplier_id', type: 'string' as FieldType, facet: true, optional: true },
        { name: 'category_slug', type: 'string' as FieldType, facet: true },
        { name: 'extras', type: 'string' as FieldType, facet: true },
        { name: 'created_at', type: 'int64' as FieldType, facet: false },
        { name: 'updated_at', type: 'int64' as FieldType, facet: false },
      ],
      default_sorting_field: 'updated_at',
    };
    
    // Call parent constructor with collection name and schema
    super('materials', materialsCollectionSchema);
  }

  /**
   * Convert Materials entity to Typesense document
   */
  protected entityToDocument(material: Materials): MaterialsDocument {
    return {
      id: material.id,
      name: material.name,
      description: material.description || '',
      price: material.price,
      has_stock: material.has_stock || true,
      quantity_in_stock: material.quantity_in_stock || 0,
      images: JSON.stringify(material.images || []),
      supplier_id: material.supplier_id || '',
      category_slug: material.category_slug,
      extras: JSON.stringify(material.extras || {}),
      created_at: new Date(material.createdAt).getTime(),
      updated_at: new Date(material.updatedAt).getTime(),
    };
  }

  /**
   * Convert Typesense document to Materials entity
   */
  protected documentToEntity(document: MaterialsDocument): Materials {
    const material = new Materials();
    material.id = document.id;
    material.name = document.name;
    material.description = document.description;
    material.price = document.price;
    material.has_stock = document.has_stock;
    material.quantity_in_stock = document.quantity_in_stock;
    material.images = JSON.parse(document.images);
    material.supplier_id = document.supplier_id;
    material.category_slug = document.category_slug;
    material.extras = JSON.parse(document.extras);
    material.createdAt = new Date(document.created_at);
    material.updatedAt = new Date(document.updated_at);
    material.isActive = true;
    material.deletedAt = null;
    return material;
  }
}