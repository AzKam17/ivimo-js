import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import Elysia from "elysia";

export type TypeORMContext = {
  db: DataSource;
};

export const databaseConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_DATABASE || "225immo",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: ["./**/entities/**/*.orm-entity.ts"],
  // Bun-specific optimizations
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
};

export const AppDataSource = new DataSource(databaseConfig);
