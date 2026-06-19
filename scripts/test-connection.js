const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing connection to Neon PostgreSQL...');
    await client.connect();
    console.log('✅ Connection successful!');

    const result = await client.query('SELECT NOW()');
    console.log('✅ Database time:', result.rows[0].now);

    const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
    console.log('✅ Tables found:', tables.rows.map(r => r.tablename).join(', '));

    console.log('\n✅ Everything looks good! Ready to deploy.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
