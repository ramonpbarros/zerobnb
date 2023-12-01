const express = require('express');
const { Spot, Image, Review } = require('../../db/models');

const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    include: [{ model: Image }, { model: Review }],
  });

  let allSpots = [];

  spots.forEach((spot) => {
    allSpots.push(spot.toJSON());
  });

  allSpots.forEach((spot) => {
    spot.Images.forEach((image) => {
      if (image.url) {
        spot.previewImage = image.url;
      }
    });

    if (!spot.previewImage) {
      spot.previewImage = 'No preview image found';
    }

    const reviews = spot.Reviews || [];
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

    spot.Reviews.forEach((review) => {
      if (review.stars) {
        spot.avgRating = avgRating;
      }
    });

    delete spot.Images;
    delete spot.Reviews;
  });

  res.json(allSpots);
});

module.exports = router;
