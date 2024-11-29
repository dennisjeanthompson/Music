const Track = require('../models/Track');
const { itemsPerPage } = require('../config/database');

const trackController = {
  getAllTracks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const search = req.query.search || '';
      const startDate = req.query.startDate || '';
      const endDate = req.query.endDate || '';

      const { tracks, totalPages } = await Track.getAll({
        page,
        search,
        startDate,
        endDate,
        itemsPerPage
      });

      res.render('index', { 
        tracks,
        currentPage: page,
        totalPages,
        search,
        startDate,
        endDate
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  addTrack: async (req, res) => {
    try {
      const { name, description } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      await Track.add(name, description);
      res.redirect('/');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateTrack: async (req, res) => {
    try {
      const { name, description } = req.body;
      const id = req.params.id;

      await Track.update(id, name, description);
      res.redirect('/');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  deleteTrack: async (req, res) => {
    try {
      const id = req.params.id;
      await Track.delete(id);
      res.redirect('/');
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = trackController;