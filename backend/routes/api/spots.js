const express = require('express');
const { Spot, Image, Review, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const router = express.Router();

const validateCreateSpot = [
  check('address').exists().withMessage('Street address is required'),
  check('city').exists().withMessage('City is required'),
  check('state').exists().withMessage('State is required'),
  check('country').exists().withMessage('Country is required'),
  check('lat').exists().withMessage('Latitude must be within -90 and 90'),
  check('lng').exists().withMessage('Longitude must be within -180 and 180'),
  check('name').exists().withMessage('Name must be less than 50 characters'),
  check('description').exists().withMessage('Description is required'),
  check('price')
    .exists()
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors,
];

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
router.post('/', requireAuth, validateCreateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

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

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview } = req.body;
  const currentUser = req.user.toJSON();

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  if (currentUser.id !== spot.id) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }

  const newImage = await Image.create({
    imageableId: spot.id,
    imageableType: 'Spot',
    url,
    preview,
  });

  res.json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

// Edit a Spot
router.put('/:spotId', requireAuth, validateCreateSpot, async (req, res) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  await spot.update(req.body);

  res.json(spot);
});

// Delete a Spot
router.delete('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  await spot.destroy();

  res.json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
