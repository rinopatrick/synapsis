import type { Config } from "drizzle-kit";

export default {
  schema: "../../packages/core/src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./synapsis.db",
  },
} satisfies Config;
