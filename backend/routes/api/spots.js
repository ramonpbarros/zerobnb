const express = require('express');
const { Spot } = require('../../db/models');

const router = express.Router();

// All spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({});
  res.json(allSpots);
});

// Get spot from user
// router.get('/', async (req, res) => {
//   const allSpots = await Spot.findAll({});
//   res.json(allSpots);
// });

module.exports = router;
