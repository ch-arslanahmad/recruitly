import Database, { type Database as DB } from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db: DB = new Database(path.join(__dirname, "recruitly.db"), {
    timeout: 3000,
});

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.defaultSafeIntegers(false);

function createDB() {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    db.exec(schema);
    console.log("Database tables created successfully");
}

createDB();

function cleanup() {
    try {
        db.close();
    } catch {}
}

process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
});
process.on("SIGTERM", cleanup);

export default db;
