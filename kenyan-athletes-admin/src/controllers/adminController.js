const User = require('../models/userModel');
const Athlete = require('../models/athleteModel');
const Achievement = require('../models/achievementModel');
const Event = require('../models/eventModel');

exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAthletes = await Athlete.countDocuments();
        const totalAchievements = await Achievement.countDocuments();
        const totalEvents = await Event.countDocuments();

        res.render('admin/dashboard', {
            totalUsers,
            totalAthletes,
            totalAchievements,
            totalEvents
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};

exports.getAthletes = async (req, res) => {
    try {
        const athletes = await Athlete.find().populate('user_id');
        res.render('admin/athletes', { athletes });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};

exports.getAthleteDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const athlete = await Athlete.findById(id).populate('user_id');
        if (!athlete) {
            return res.status(404).render('error', { message: 'Athlete not found' });
        }
        res.render('admin/athlete-detail', { athlete });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.render('admin/events', { events });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Internal Server Error' });
    }
};