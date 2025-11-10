const db = require('../db'); // Import the database connection

// Consent model definition
class Consent {
    constructor(athleteId, coachId, sponsorId, consentType, granted, grantedAt, expiresAt) {
        this.athleteId = athleteId;
        this.coachId = coachId;
        this.sponsorId = sponsorId;
        this.consentType = consentType;
        this.granted = granted;
        this.grantedAt = grantedAt;
        this.expiresAt = expiresAt;
    }

    // Method to create a new consent record
    static async createConsent(consentData) {
        const { athleteId, coachId, sponsorId, consentType, granted, grantedAt, expiresAt } = consentData;
        const query = 'INSERT INTO user_consents (athlete_id, coach_id, sponsor_id, consent_type, granted, granted_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [athleteId, coachId, sponsorId, consentType, granted, grantedAt, expiresAt];
        const [result] = await db.execute(query, values);
        return result.insertId;
    }

    // Method to get consents by athlete ID
    static async getConsentsByAthleteId(athleteId) {
        const query = 'SELECT * FROM user_consents WHERE athlete_id = ?';
        const [results] = await db.execute(query, [athleteId]);
        return results;
    }

    // Method to update a consent record
    static async updateConsent(consentId, consentData) {
        const { coachId, sponsorId, consentType, granted, grantedAt, expiresAt } = consentData;
        const query = 'UPDATE user_consents SET coach_id = ?, sponsor_id = ?, consent_type = ?, granted = ?, granted_at = ?, expires_at = ? WHERE id = ?';
        const values = [coachId, sponsorId, consentType, granted, grantedAt, expiresAt, consentId];
        await db.execute(query, values);
    }

    // Method to delete a consent record
    static async deleteConsent(consentId) {
        const query = 'DELETE FROM user_consents WHERE id = ?';
        await db.execute(query, [consentId]);
    }
}

module.exports = Consent; // Export the Consent model