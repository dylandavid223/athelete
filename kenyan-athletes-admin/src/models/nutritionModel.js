const db = require('../db'); // Import the database connection

// Nutrition model definition
const Nutrition = {
    // Create a new nutrition entry
    create: async (athleteId, date, calories, protein, carbs, fats, waterIntake, notes) => {
        const query = `
            INSERT INTO nutrition_tracking (athlete_id, date, calories, protein, carbs, fats, water_intake, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [athleteId, date, calories, protein, carbs, fats, waterIntake, notes];
        const [result] = await db.execute(query, values);
        return result;
    },

    // Get all nutrition entries for a specific athlete
    getAllByAthleteId: async (athleteId) => {
        const query = `SELECT * FROM nutrition_tracking WHERE athlete_id = ?`;
        const [rows] = await db.execute(query, [athleteId]);
        return rows;
    },

    // Update a nutrition entry
    update: async (id, calories, protein, carbs, fats, waterIntake, notes) => {
        const query = `
            UPDATE nutrition_tracking
            SET calories = ?, protein = ?, carbs = ?, fats = ?, water_intake = ?, notes = ?
            WHERE id = ?`;
        const values = [calories, protein, carbs, fats, waterIntake, notes, id];
        const [result] = await db.execute(query, values);
        return result;
    },

    // Delete a nutrition entry
    delete: async (id) => {
        const query = `DELETE FROM nutrition_tracking WHERE id = ?`;
        const [result] = await db.execute(query, [id]);
        return result;
    }
};

module.exports = Nutrition; // Export the Nutrition model