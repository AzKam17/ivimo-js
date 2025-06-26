import "reflect-metadata";
import { DataSource } from "typeorm";
import { Property } from "../src/modules/property/infrastructure/entities/property.orm-entity";
import { PropertyTypesenseService } from "../src/modules/property/infrastructure/services/property-typesense.service";
import { Materials } from "../src/modules/materials/infrastructure/entities/materials.orm-entity";
import { MaterialsTypesenseService } from "../src/modules/materials/infrastructure/services/materials-typesense.service";

// Add this helper function at the top of your file
function logWithTimestamp(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Database configuration
const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "225immo",
  entities: [Property, Materials],
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
});

// Define entity sync configuration
interface SyncConfig<T> {
  entityName: string;
  repository: any;
  typesenseService: any;
  lastSyncedAt: Date;
}

// Create instances of TypesenseService
const propertyTypesenseService = new PropertyTypesenseService();
const materialsTypesenseService = new MaterialsTypesenseService();

// Store for last sync timestamps
let lastPropertySyncedAt = new Date(0);
let lastMaterialsSyncedAt = new Date(0);

// Generic sync function
async function syncEntities<T>(config: SyncConfig<T>): Promise<Date> {
  const { entityName, repository, typesenseService, lastSyncedAt } = config;
  const currentTime = new Date();
  logWithTimestamp(`Starting ${entityName} sync. Last sync: ${lastSyncedAt.toISOString()}`);

  try {
    // Find updated entities since last sync
    const updatedEntities = await repository
      .createQueryBuilder(entityName.toLowerCase())
      .where(`${entityName.toLowerCase()}.updated_at > :lastSyncedAt`, { lastSyncedAt })
      .getMany();

    if (updatedEntities.length > 0) {
      logWithTimestamp(`Found ${updatedEntities.length} updated ${entityName.toLowerCase()}s`);
      await typesenseService.upsertEntities(updatedEntities);
      logWithTimestamp(`Upserted ${updatedEntities.length} ${entityName.toLowerCase()}s to Typesense`);
    } else {
      logWithTimestamp(`No updated ${entityName.toLowerCase()}s found`);
    }

    // Handle soft-deleted entities
    const deletedEntities = await repository
      .createQueryBuilder(entityName.toLowerCase())
      .withDeleted()
      .where(`${entityName.toLowerCase()}.deleted_at > :lastSyncedAt`, { lastSyncedAt })
      .andWhere(`${entityName.toLowerCase()}.deleted_at IS NOT NULL`)
      .getMany();

    if (deletedEntities.length > 0) {
      logWithTimestamp(`Found ${deletedEntities.length} deleted ${entityName.toLowerCase()}s`);
      const deletedIds = deletedEntities.map((entity: any) => entity.id);
      await typesenseService.deleteEntities(deletedIds);
      logWithTimestamp(`Deleted ${deletedIds.length} ${entityName.toLowerCase()}s from Typesense`);
    } else {
      logWithTimestamp(`No deleted ${entityName.toLowerCase()}s found`);
    }

    logWithTimestamp(`${entityName} sync completed at ${currentTime.toISOString()}`);
    return currentTime;
  } catch (error) {
    console.error(`Error syncing ${entityName.toLowerCase()}s:`, error);
    return lastSyncedAt; // Return the original timestamp on error
  }
}

// Main function - runs continuously
async function main() {
  try {
    // Connect to the database
    await dataSource.initialize();
    logWithTimestamp("Database connected");

    // Initialize Typesense collections
    await propertyTypesenseService.initializeCollection();
    await materialsTypesenseService.initializeCollection();
    logWithTimestamp("Typesense collections initialized");

    // Run the sync process in a continuous loop
    while (true) {
      try {
        // Sync properties
        lastPropertySyncedAt = await syncEntities({
          entityName: "Property",
          repository: dataSource.getRepository(Property),
          typesenseService: propertyTypesenseService,
          lastSyncedAt: lastPropertySyncedAt
        });

        // Sync materials
        lastMaterialsSyncedAt = await syncEntities({
          entityName: "Materials",
          repository: dataSource.getRepository(Materials),
          typesenseService: materialsTypesenseService,
          lastSyncedAt: lastMaterialsSyncedAt
        });
      } catch (error) {
        console.error("Error in sync cycle:", error);
      }

      // Wait for the specified interval before the next sync
      const syncIntervalMs = 30 * 1000; // 30 seconds
      logWithTimestamp(`Waiting ${syncIntervalMs}ms before next sync...`);
      await new Promise((resolve) => setTimeout(resolve, syncIntervalMs));
    }
  } catch (error) {
    console.error("Fatal error in main function:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logWithTimestamp("SIGTERM received, shutting down gracefully");
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    logWithTimestamp("Database connection closed");
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  logWithTimestamp("SIGINT received, shutting down gracefully");
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    logWithTimestamp("Database connection closed");
  }
  process.exit(0);
});

// Run the main function
main().catch((error) => {
  console.error("Unhandled error in main function:", error);
  process.exit(1);
});
