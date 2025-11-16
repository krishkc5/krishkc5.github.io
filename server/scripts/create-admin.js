require('dotenv').config();
const bcrypt = require('bcryptjs');
const readline = require('readline');
const { db, initDatabase } = require('../config/database');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
    console.log('\n=== Create Admin User ===\n');

    try {
        // Initialize database
        initDatabase();

        // Get username
        let username = await question('Enter admin username (default: admin): ');
        username = username.trim() || 'admin';

        // Check if user already exists
        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            const overwrite = await question(`User "${username}" already exists. Overwrite? (yes/no): `);
            if (overwrite.toLowerCase() !== 'yes') {
                console.log('Cancelled.');
                rl.close();
                return;
            }
        }

        // Get password
        let password = await question('Enter admin password (min 8 characters): ');
        if (password.length < 8) {
            console.error('Error: Password must be at least 8 characters');
            rl.close();
            return;
        }

        let confirmPassword = await question('Confirm password: ');
        if (password !== confirmPassword) {
            console.error('Error: Passwords do not match');
            rl.close();
            return;
        }

        // Hash password
        console.log('\nHashing password...');
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert or update user
        if (existing) {
            db.prepare('UPDATE users SET password_hash = ? WHERE username = ?')
                .run(passwordHash, username);
            console.log(`✓ Admin user "${username}" updated successfully`);
        } else {
            db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
                .run(username, passwordHash);
            console.log(`✓ Admin user "${username}" created successfully`);
        }

        console.log('\nYou can now login with these credentials.');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        rl.close();
    }
}

createAdmin();
