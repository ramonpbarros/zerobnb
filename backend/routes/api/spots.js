const express = require('express');
const { Spot, Image, Review, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    include: [{ model: Image }, { model: Review }],
  });

  let allSpots = [];

  spots.forEach((spot) => {
    allSpots.push(spot.toJSON());
  });

  allSpots.forEach((spot) => {
    const reviews = spot.Reviews || [];
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

    spot.Reviews.forEach((review) => {
      if (review.stars) {
        spot.avgRating = avgRating;
      }
    });

    spot.Images.forEach((image) => {
      if (image.url) {
        spot.previewImage = image.url;
      }
    });

    if (!spot.previewImage) {
      spot.previewImage = 'No preview image found';
    }

    delete spot.Images;
    delete spot.Reviews;
  });

  res.json(allSpots);
});

// Get all spots owned by the current user

router.get('/current', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const spots = await Spot.findAll({
    where: {
      ownerId: currentUser.id,
    },
  });

  res.json({ Spots: spots });
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [{ model: Review }, { model: Image }, { model: User }],
  });

  if (!spot) {
    res.status(404);
    res.send({ message: "Spot couldn't be found" });
  }

  let spotDetail = spot.toJSON();

  const reviews = spotDetail.Reviews || [];
  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

  if (spotDetail.Reviews[0].stars) {
    spotDetail.numReviews = spotDetail.Reviews.length;
    spotDetail.avgStarRating = avgRating;
    delete spotDetail.Reviews;
  }

  if (spotDetail.Images && spotDetail.Users.length > 0) {
    spotDetail.SpotImages = spotDetail.Images.map((image) => ({
      id: image.id,
      url: image.url,
      preview: image.preview,
    }));
    delete spotDetail.Images;
  }

  if (spotDetail.Users && spotDetail.Users.length > 0) {
    const owner = spotDetail.Users[0];

    spotDetail.Owner = {
      id: owner.id,
      firstName: owner.firstName,
      lastName: owner.lastName,
    };

    delete spotDetail.Users;
  }

  res.json(spotDetail);
});

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  console.log(req.body);
  const currentUser = req.user.toJSON();

  const newSpot = await Spot.create({
    ownerId: currentUser.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
});

module.exports = router;
