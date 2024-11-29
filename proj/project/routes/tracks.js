const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

router.get('/', trackController.getAllTracks);
router.post('/tracks', trackController.addTrack);
router.post('/tracks/:id', trackController.updateTrack);
router.get('/tracks/delete/:id', trackController.deleteTrack);

module.exports = router;