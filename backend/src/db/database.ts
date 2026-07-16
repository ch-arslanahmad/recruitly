import Database, {type Database as DB} from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the current file path (from file URL, file:///)
const __dirname = path.dirname(__filename); // get the current directory path (from file path)

const db : DB = new Database(path.join(__dirname, '..', '..', 'recruitly.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.defaultSafeIntegers(false); // ensure numbers return as number, not bigint

function createDB() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('Database tables created successfully');
}

createDB();

export default db;
