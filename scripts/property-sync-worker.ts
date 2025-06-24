import "reflect-metadata";
import { DataSource } from "typeorm";
import { Property } from "../src/modules/property/infrastructure/entities/property.orm-entity";
import { PropertyTypesenseService } from "../src/modules/property/infrastructure/services/property-typesense.service";

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
  entities: [Property], // Import the entity directly instead of using a path pattern
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
});

// Create an instance of PropertyTypesenseService
const propertyTypesenseService = new PropertyTypesenseService();

// Store for last sync timestamp
let lastSyncedAt = new Date(0); // Initialize with epoch time

// Main sync function
async function syncProperties() {
  const currentTime = new Date();
  logWithTimestamp(`Starting sync. Last sync: ${lastSyncedAt.toISOString()}`);

  try {
    // Find updated properties since last sync
    const propertyRepository = dataSource.getRepository(Property);
    const updatedProperties = await propertyRepository
      .createQueryBuilder("property")
      .where("property.updated_at > :lastSyncedAt", { lastSyncedAt })
      .getMany();

    if (updatedProperties.length > 0) {
      logWithTimestamp(`Found ${updatedProperties.length} updated properties`);
      await propertyTypesenseService.upsertEntities(updatedProperties);
      logWithTimestamp(`Upserted ${updatedProperties.length} properties to Typesense`);
    } else {
      logWithTimestamp("No updated properties found");
    }

    // Handle soft-deleted properties
    const deletedProperties = await propertyRepository
      .createQueryBuilder("property")
      .withDeleted()
      .where("property.deleted_at > :lastSyncedAt", { lastSyncedAt })
      .andWhere("property.deleted_at IS NOT NULL")
      .getMany();

    if (deletedProperties.length > 0) {
      logWithTimestamp(`Found ${deletedProperties.length} deleted properties`);
      const deletedIds = deletedProperties.map((property) => property.id);
      await propertyTypesenseService.deleteEntities(deletedIds);
      logWithTimestamp(`Deleted ${deletedIds.length} properties from Typesense`);
    } else {
      logWithTimestamp("No deleted properties found");
    }

    // Update last synced timestamp
    lastSyncedAt = currentTime;
    logWithTimestamp(`Sync completed at ${currentTime.toISOString()}`);
  } catch (error) {
    console.error("Error syncing properties:", error);
  }
}

// Main function - runs continuously
async function main() {
  try {
    // Connect to the database
    await dataSource.initialize();
    logWithTimestamp("Database connected");

    // Initialize Typesense collection
    await propertyTypesenseService.initializeCollection();
    logWithTimestamp("Typesense initialized");

    // Run the sync process in a continuous loop
    while (true) {
      try {
        await syncProperties();
      } catch (error) {
        console.error("Error in sync cycle:", error);
      }

      // Wait for the specified interval before the next sync
      const syncIntervalMs = 5 * 1000; // 5 seconds
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
