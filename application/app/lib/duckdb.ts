import { DuckDBInstance } from '@duckdb/node-api';
import fs from 'fs';
import path from 'path';

// Access the database file

// Check if the file exists
const databasePath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : null;

if (!databasePath) {
	throw new Error('DATABASE_PATH is missing or invalid');
}
if (!fs.existsSync(databasePath)) {
	throw new Error('Database file not found');
}

const duckDbSingleton = async () => {
	console.log('Create DB instance...');
	// next build needs access to the file and can't if not using read_only because the file gets locked - @see https://duckdb.org/docs/connect/concurrency
	// it may be possible without it if we use the database differently or configure next (maybe ?), but as we are only reading in the db it should be better like this
	return DuckDBInstance.create(databasePath, {
		access_mode: 'READ_ONLY',
	}).then(async (db) => {
		// ensure the spatial extension is installed
		const connection = await db.connect();
		await connection.run('INSTALL SPATIAL;');
		return db;
	});
};

// Ensure the global object is extended to store the Prisma client
declare const globalThis: {
	dbGlobal: Awaited<ReturnType<typeof duckDbSingleton>>;
} & typeof global;

// Use the existing db instance if it exists, or create a new one
const db = globalThis.dbGlobal ?? (await duckDbSingleton());

if (process.env.NODE_ENV !== 'production') {
	// Store the db instance in globalThis to reuse in development
	globalThis.dbGlobal = db;
}

export default db;
