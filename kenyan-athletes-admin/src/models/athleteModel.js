const db = require('../db'); // Import the database connection

// Define the Athlete model
const Athlete = {
    // Get all athletes
    getAllAthletes: async () => {
        const [rows] = await db.query('SELECT * FROM athlete_profiles');
        return rows;
    },

    // Get athlete by ID
    getAthleteById: async (id) => {
        const [rows] = await db.query('SELECT * FROM athlete_profiles WHERE id = ?', [id]);
        return rows[0];
    },

    // Create a new athlete
    createAthlete: async (athleteData) => {
        const { user_id, date_of_birth, gender, bio, specialization, county_origin, years_active, is_legend, achievements, personal_records } = athleteData;
        const [result] = await db.query('INSERT INTO athlete_profiles (user_id, date_of_birth, gender, bio, specialization, county_origin, years_active, is_legend, achievements, personal_records) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [user_id, date_of_birth, gender, bio, specialization, county_origin, years_active, is_legend, achievements, personal_records]);
        return result.insertId;
    },

    // Update an athlete
    updateAthlete: async (id, athleteData) => {
        const { date_of_birth, gender, bio, specialization, county_origin, years_active, is_legend, achievements, personal_records } = athleteData;
        await db.query('UPDATE athlete_profiles SET date_of_birth = ?, gender = ?, bio = ?, specialization = ?, county_origin = ?, years_active = ?, is_legend = ?, achievements = ?, personal_records = ? WHERE id = ?', 
        [date_of_birth, gender, bio, specialization, county_origin, years_active, is_legend, achievements, personal_records, id]);
    },

    // Delete an athlete
    deleteAthlete: async (id) => {
        await db.query('DELETE FROM athlete_profiles WHERE id = ?', [id]);
    }
};

module.exports = Athlete; // Export the Athlete model