require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db, initDatabase } = require('../config/database');

async function setupAdmin() {
    console.log('Setting up admin user...');

    try {
        // Initialize database
        initDatabase();

        const username = 'admin';
        const password = 'SecureAdmin123!';

        // Hash password
        console.log('Hashing password...');
        const passwordHash = await bcrypt.hash(password, 12);

        // Check if user exists
        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);

        if (existing) {
            console.log('Admin user already exists. Updating password...');
            db.prepare('UPDATE users SET password_hash = ? WHERE username = ?')
                .run(passwordHash, username);
            console.log('✓ Admin password updated');
        } else {
            console.log('Creating new admin user...');
            db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
                .run(username, passwordHash);
            console.log('✓ Admin user created');
        }

        console.log('\n╔════════════════════════════════════════╗');
        console.log('║  Admin Credentials                     ║');
        console.log('╠════════════════════════════════════════╣');
        console.log('║  Username: admin                       ║');
        console.log('║  Password: SecureAdmin123!             ║');
        console.log('║                                        ║');
        console.log('║  ⚠️  CHANGE THIS PASSWORD IMMEDIATELY  ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('\nYou can now:');
        console.log('1. Start the server: npm start');
        console.log('2. Open admin.html in your browser');
        console.log('3. Login with the credentials above');
        console.log('4. Create a new admin with a different password');
        console.log('5. Delete this temporary account\n');

    } catch (error) {
        console.error('Error setting up admin:', error);
        process.exit(1);
    }
}

setupAdmin();
