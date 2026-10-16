import "server-only";

import { MongoClient, type Db } from "mongodb";

type MongoResources = {
  client: MongoClient;
  database: Db;
  uri: string;
};

const globalMongo = globalThis as typeof globalThis & {
  __bazarDorMongo?: MongoResources;
};

export function getMongoResources(): MongoResources {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is required for BetterAuth persistence.");
  }

  if (globalMongo.__bazarDorMongo?.uri === uri) {
    return globalMongo.__bazarDorMongo;
  }

  const client = new MongoClient(uri);
  const database = client.db(process.env.MONGODB_DB_NAME ?? "bazar_dor");
  const resources = { client, database, uri };

  if (process.env.NODE_ENV !== "production") {
    globalMongo.__bazarDorMongo = resources;
  }

  return resources;
}
