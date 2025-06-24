import { typesenseClient } from './typesense.config';
import { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";
import { SearchParams, SearchResponse } from "typesense/lib/Typesense/Documents";

/**
 * Base interface for Typesense documents
 */
export interface TypesenseDocument {
  id: string;
  [key: string]: any;
}

/**
 * Generic Typesense service for managing collections and documents
 * @template T - The entity type
 * @template D - The document type (extends TypesenseDocument)
 */
export abstract class TypesenseService<T, D extends TypesenseDocument> {
  protected readonly collectionName: string;
  protected readonly collectionSchema: CollectionCreateSchema;

  /**
   * Creates a new TypesenseService instance
   * 
   * @param collectionName - Name of the collection
   * @param collectionSchema - Schema for the collection
   */
  constructor(collectionName: string, collectionSchema: CollectionCreateSchema) {
    this.collectionName = collectionName;
    this.collectionSchema = collectionSchema;
  }

  /**
   * Convert entity to document - must be implemented by child classes
   */
  protected abstract entityToDocument(entity: T): D;

  /**
   * Convert document to entity - must be implemented by child classes
   */
  protected abstract documentToEntity(document: D): T;

  /**
   * Initialize the collection
   */
  async initializeCollection(): Promise<void> {
    try {
      // Check if collection exists
      await typesenseClient.collections(this.collectionName).retrieve();
      console.log(`Collection ${this.collectionName} already exists`);
    } catch (error) {
      // Collection doesn't exist, create it
      if (error instanceof Error && error.name === "ObjectNotFound") {
        try {
          await typesenseClient.collections().create(this.collectionSchema);
          console.log(`Collection ${this.collectionName} created`);
        } catch (createError) {
          console.error("Error creating Typesense collection:", createError);
          throw createError;
        }
      } else {
        console.error("Error initializing Typesense collection:", error);
        throw error;
      }
    }
  }

  /**
   * Upsert entities to Typesense
   * 
   * @param entities - Array of entities to upsert
   * @returns Result of the upsert operation
   */
  async upsertEntities(entities: T[]): Promise<any> {
    if (entities.length === 0) return;

    const documents = entities.map(entity => this.entityToDocument(entity));

    try {
      const result = await typesenseClient
        .collections(this.collectionName)
        .documents()
        .import(documents, { action: "upsert" });

      return result;
    } catch (error) {
      console.error(`Error upserting documents to ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete entities from Typesense by ID
   * 
   * @param ids - Array of entity IDs to delete
   * @returns Result of the delete operation
   */
  async deleteEntities(ids: string[]): Promise<any> {
    if (ids.length === 0) return;

    try {
      // Using filter_by to delete multiple documents by ID
      const filter = `id:=[${ids.map((id) => `'${id}'`).join(",")}]`;

      const result = await typesenseClient
        .collections(this.collectionName)
        .documents()
        .delete({ filter_by: filter });

      return result;
    } catch (error) {
      console.error(`Error deleting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Search for entities in Typesense
   * 
   * @param searchParams - Search parameters
   * @returns Hydrated entities matching the search criteria
   */
  async search(searchParams: SearchParams): Promise<T[]> {
    try {
      // Cast the search results to any first, then to the specific type
      const searchResults = await typesenseClient
        .collections(this.collectionName)
        .documents()
        .search(searchParams) as any as SearchResponse<D>;
  
      // Convert documents back to entities
      return searchResults.hits?.map(hit => this.documentToEntity(hit.document)) || [];
    } catch (error) {
      console.error(`Error searching in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get a document by ID
   * 
   * @param id - ID of the document to retrieve
   * @returns Hydrated entity if found
   */
  async getById(id: string): Promise<T | null> {
    try {
      const document = await typesenseClient
        .collections(this.collectionName)
        .documents(id)
        .retrieve();

      return this.documentToEntity(document as D);
    } catch (error) {
      if (error instanceof Error && error.name === "ObjectNotFound") {
        return null;
      }
      console.error(`Error retrieving document from ${this.collectionName}:`, error);
      throw error;
    }
  }
}