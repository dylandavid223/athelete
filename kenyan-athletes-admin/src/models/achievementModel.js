const db = require('../db'); // Import the database connection

// Achievement model definition
class Achievement {
    constructor(id, athleteId, eventName, eventType, year, medal, location, recordTime, description) {
        this.id = id;
        this.athleteId = athleteId;
        this.eventName = eventName;
        this.eventType = eventType;
        this.year = year;
        this.medal = medal;
        this.location = location;
        this.recordTime = recordTime;
        this.description = description;
    }

    // Method to save a new achievement
    static async create(athleteId, eventName, eventType, year, medal, location, recordTime, description) {
        const result = await db.query(
            'INSERT INTO achievements (athlete_id, event_name, event_type, year, medal, location, record_time, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [athleteId, eventName, eventType, year, medal, location, recordTime, description]
        );
        return new Achievement(result.insertId, athleteId, eventName, eventType, year, medal, location, recordTime, description);
    }

    // Method to fetch all achievements
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM achievements');
        return rows.map(row => new Achievement(row.id, row.athlete_id, row.event_name, row.event_type, row.year, row.medal, row.location, row.record_time, row.description));
    }

    // Method to find achievements by athlete ID
    static async findByAthleteId(athleteId) {
        const [rows] = await db.query('SELECT * FROM achievements WHERE athlete_id = ?', [athleteId]);
        return rows.map(row => new Achievement(row.id, row.athlete_id, row.event_name, row.event_type, row.year, row.medal, row.location, row.record_time, row.description));
    }

    // Method to delete an achievement
    static async delete(id) {
        await db.query('DELETE FROM achievements WHERE id = ?', [id]);
    }
}

module.exports = Achievement; // Export the Achievement model