const express = require('express');
const { Spot, Image, Review, Sequelize } = require('../../db/models');

const router = express.Router();

// All spots
router.get('/', async (req, res) => {
  const allSpots = await Spot.findAll({
    include: [{ model: Image }, { model: Review, attributes: ['stars'] }],
  });

  const spotImages = await Image.findAll({
    attributes: ['url', 'imageableId'],
    where: {
      imageableId: allSpots.map((spot) => spot.id),
      imageableType: 'Spot',
    },
  });

  const imagesBySpotId = {};

  spotImages.forEach((image) => {
    if (!imagesBySpotId[image.imageableId]) {
      imagesBySpotId[image.imageableId] = [];
    }
    imagesBySpotId[image.imageableId].push(image);
  });

  const avgRatingsBySpotId = {};

  allSpots.forEach((spot) => {
    const spotId = spot.id;
    const reviews = spot.Reviews || [];
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

    if (imagesBySpotId[spotId] && imagesBySpotId[spotId].length > 0) {
      spot.dataValues.previewImage = imagesBySpotId[spotId][0].url;
    } else {
      spot.dataValues.previewImage = null;
    }

    spot.dataValues.avgRating = avgRating;

    delete spot.dataValues.Images;
    delete spot.dataValues.Reviews;

    avgRatingsBySpotId[spotId] = avgRating;
  });

  res.json(allSpots);
});

module.exports = router;
