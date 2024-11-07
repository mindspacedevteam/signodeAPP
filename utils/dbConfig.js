// dbConfig.js
const sql = require('mssql');

const dbConfig = {
  user: 'sa',
  password: 'v2#cXD5C',
  server: '192.168.1.16',
  database: 'your_database_name',
  options: {
    encrypt: true, // For Azure, set to true if needed
    trustServerCertificate: true, // For local dev
  },
};

async function connectToDatabase() {
  try {
    const pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

module.exports = { connectToDatabase, sql };
