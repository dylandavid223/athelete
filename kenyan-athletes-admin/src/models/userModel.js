const db = require('../db'); // Import the database connection

// User model definition
const User = {
    // Schema definition
    schema: {
        id: 'INT PRIMARY KEY AUTO_INCREMENT',
        email: 'VARCHAR(255) UNIQUE NOT NULL',
        password: 'VARCHAR(255) NOT NULL',
        role: "ENUM('athlete', 'sponsor', 'coach', 'government', 'user') NOT NULL",
        first_name: 'VARCHAR(100) NOT NULL',
        last_name: 'VARCHAR(100) NOT NULL',
        phone: 'VARCHAR(20)',
        county: 'VARCHAR(100)',
        language_preference: "ENUM('english', 'swahili', 'kikuyu', 'luo', 'kalenjin') DEFAULT 'english'",
        created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        is_verified: 'BOOLEAN DEFAULT FALSE'
    },

    // Method to create a new user
    create: async function(userData) {
        const query = `INSERT INTO users (email, password, role, first_name, last_name, phone, county, language_preference, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [userData.email, userData.password, userData.role, userData.first_name, userData.last_name, userData.phone, userData.county, userData.language_preference, userData.is_verified];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Method to find a user by ID
    findById: async function(userId) {
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.execute(query, [userId]);
        return rows[0];
    },

    // Method to find a user by email
    findByEmail: async function(email) {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    },

    // Method to update user information
    update: async function(userId, userData) {
        const query = `UPDATE users SET email = ?, password = ?, role = ?, first_name = ?, last_name = ?, phone = ?, county = ?, language_preference = ?, is_verified = ? WHERE id = ?`;
        const values = [userData.email, userData.password, userData.role, userData.first_name, userData.last_name, userData.phone, userData.county, userData.language_preference, userData.is_verified, userId];
        await db.execute(query, values);
    },

    // Method to delete a user
    delete: async function(userId) {
        const query = `DELETE FROM users WHERE id = ?`;
        await db.execute(query, [userId]);
    }
};

module.exports = User; // Export the User model