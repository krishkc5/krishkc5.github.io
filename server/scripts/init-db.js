require('dotenv').config();
const { initDatabase } = require('../config/database');

console.log('Initializing database...');

try {
    initDatabase();
    console.log('✓ Database initialized successfully');
    console.log('\nNext steps:');
    console.log('1. Run: npm run create-admin');
    console.log('2. Start the server: npm start');
} catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
}
