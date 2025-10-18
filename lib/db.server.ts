import { Pool, Client, type ClientConfig } from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import type { DB } from "../gen/dbTypes";

const config = {
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT || "5432"),
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	connectionTimeoutMillis: 2000,
};

const pool = new Pool({
	...config,
	max: 20,
	idleTimeoutMillis: 30000,
});

const dialect = new PostgresDialect({ pool });
const db = new Kysely<DB>({ dialect, plugins: [new CamelCasePlugin()] });

export { db };
