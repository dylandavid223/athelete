const db = require('../db'); // Import the database connection

// Event model definition
const Event = {
    getAllEvents: async () => {
        const query = 'SELECT * FROM events';
        const [rows] = await db.execute(query);
        return rows;
    },

    getEventById: async (id) => {
        const query = 'SELECT * FROM events WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    },

    createEvent: async (eventData) => {
        const { event_name, event_date, location, event_type, description, registration_deadline, is_upcoming } = eventData;
        const query = 'INSERT INTO events (event_name, event_date, location, event_type, description, registration_deadline, is_upcoming) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [event_name, event_date, location, event_type, description, registration_deadline, is_upcoming]);
        return result.insertId;
    },

    updateEvent: async (id, eventData) => {
        const { event_name, event_date, location, event_type, description, registration_deadline, is_upcoming } = eventData;
        const query = 'UPDATE events SET event_name = ?, event_date = ?, location = ?, event_type = ?, description = ?, registration_deadline = ?, is_upcoming = ? WHERE id = ?';
        await db.execute(query, [event_name, event_date, location, event_type, description, registration_deadline, is_upcoming, id]);
    },

    deleteEvent: async (id) => {
        const query = 'DELETE FROM events WHERE id = ?';
        await db.execute(query, [id]);
    }
};

module.exports = Event;