const db = require('../db'); // Import the database connection

// Define the Exercise model
const Exercise = {
    // Method to create a new exercise entry
    create: async (athlete_id, date, exercise_type, duration_minutes, intensity, distance_km, notes) => {
        const query = `
            INSERT INTO exercise_tracking (athlete_id, date, exercise_type, duration_minutes, intensity, distance_km, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [athlete_id, date, exercise_type, duration_minutes, intensity, distance_km, notes];
        const [result] = await db.execute(query, values);
        return result;
    },

    // Method to get all exercises for a specific athlete
    getAllByAthlete: async (athlete_id) => {
        const query = `
            SELECT * FROM exercise_tracking
            WHERE athlete_id = ?`;
        const [results] = await db.execute(query, [athlete_id]);
        return results;
    },

    // Method to get a specific exercise entry by ID
    getById: async (id) => {
        const query = `
            SELECT * FROM exercise_tracking
            WHERE id = ?`;
        const [results] = await db.execute(query, [id]);
        return results[0];
    },

    // Method to update an exercise entry
    update: async (id, updates) => {
        const query = `
            UPDATE exercise_tracking
            SET date = ?, exercise_type = ?, duration_minutes = ?, intensity = ?, distance_km = ?, notes = ?
            WHERE id = ?`;
        const values = [updates.date, updates.exercise_type, updates.duration_minutes, updates.intensity, updates.distance_km, updates.notes, id];
        const [result] = await db.execute(query, values);
        return result;
    },

    // Method to delete an exercise entry
    delete: async (id) => {
        const query = `
            DELETE FROM exercise_tracking
            WHERE id = ?`;
        const [result] = await db.execute(query, [id]);
        return result;
    }
};

module.exports = Exercise; // Export the Exercise model