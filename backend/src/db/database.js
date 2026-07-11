const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const db = new Database(path.join(__dirname, '..', '..', 'recruitly.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function createDB() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);
  console.log('Database tables created successfully');
}

createDB();



// module.exports = db;

