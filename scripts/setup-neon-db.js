const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_N7rAnogdZC4y@ep-raspy-paper-atan9b0a.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require',
  });

  try {
    console.log('Connecting to Neon PostgreSQL...');
    await client.connect();
    console.log('✓ Connected successfully!');

    console.log('Reading schema file...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, '..', 'database_schema.sql'), 'utf8');

    console.log('Creating tables and indexes...');
    await client.query(schemaSQL);
    console.log('✓ Database schema created successfully!');

    console.log('\n✓ Neon database is ready to use!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
