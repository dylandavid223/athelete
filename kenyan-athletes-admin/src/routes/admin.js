const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Route to get the admin dashboard
router.get('/dashboard', adminController.getDashboard);

// Route to get the list of athletes
router.get('/athletes', adminController.getAthletes);

// Route to get details of a specific athlete
router.get('/athletes/:id', adminController.getAthleteDetail);

// Route to get the list of events
router.get('/events', adminController.getEvents);

// Route to get the settings page
router.get('/settings', adminController.getSettings);

// Basic admin routes (replace with your real handlers/controllers)
router.get('/', (req, res) => {
  // redirect to dashboard or render admin home
  return res.redirect('/dashboard');
});

router.get('/users', (req, res) => {
  // example: list users (replace with DB query)
  res.send('Admin users list (stub)');
});

// Make sure to export the router
module.exports = router;