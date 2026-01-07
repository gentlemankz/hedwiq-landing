import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// ============================================================================
// Database Connection Configuration
// ============================================================================

const connectionString = process.env.DATABASE_URL;

// Connection pool configuration
const POOL_CONFIG = {
  max: 10, // Maximum connections in pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Required for Supabase transaction pooler
};

// Singleton instances
let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get or create the database client with connection pooling
 */
function getClient(): ReturnType<typeof postgres> {
  if (!_client) {
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _client = postgres(connectionString, POOL_CONFIG);
  }
  return _client;
}

/**
 * Get or create the Drizzle ORM instance
 */
function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!_db) {
    _db = drizzle(getClient(), { schema });
  }
  return _db;
}

// Proxy for lazy initialization
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof typeof instance];
    // Bind methods to the instance
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

/**
 * Gracefully close database connections
 * Call this during application shutdown
 */
export async function closeDatabase(): Promise<void> {
  if (_client) {
    await _client.end();
    _client = null;
    _db = null;
  }
}

// Handle graceful shutdown in Node.js environments
if (typeof process !== "undefined") {
  const shutdown = async () => {
    await closeDatabase();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export * from "./schema";
