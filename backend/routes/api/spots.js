const express = require('express');
const { Op } = require('sequelize');
const { Spot, Image, Review, User, Booking } = require('../../db/models');
const { requireAuth, isAuthorized } = require('../../utils/auth');
const {
  validateCreateSpot,
  validateEditSpot,
  validateCreateReview,
  validateCreateBooking,
  validateGetAllSpots,
} = require('../../utils/sequelize-validations');

const router = express.Router();

// Get all Spots
router.get('/', validateGetAllSpots, async (req, res) => {
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);

  if (isNaN(page)) {
    page = 1;
  }
  if (isNaN(size)) {
    size = 10;
  }

  let limit = size;
  let offset = (page - 1) * size;

  if (page == 0 && size == 0) {
    limit = null;
    offset = null;
    page = 1;
  }

  const spots = await Spot.findAll({
    include: [{ model: Image }, { model: Review }],
    limit,
    offset,
  });

  const formattedSpots = spots.map((spot) => {
    const formattedSpot = spot.toJSON();

    const newTimeUpdatedAt = new Date(formattedSpot.updatedAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateUpdatedAt = new Date(formattedSpot.updatedAt)
      .toISOString()
      .split('T')[0];

    const newTimeCreatedAt = new Date(formattedSpot.createdAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateCreatedAt = new Date(formattedSpot.createdAt)
      .toISOString()
      .split('T')[0];

    delete formattedSpot.createdAt;
    delete formattedSpot.updatedAt;

    formattedSpot.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
    formattedSpot.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

    const reviews = formattedSpot.Reviews || [];
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

    formattedSpot.avgRating = avgRating;

    if (formattedSpot.Images && formattedSpot.Images.length > 0) {
      formattedSpot.previewImage = formattedSpot.Images[0].url;
      delete formattedSpot.Images;
    } else {
      formattedSpot.previewImage = 'No preview image found';
    }

    delete formattedSpot.Reviews;

    return formattedSpot;
  });

  res.json({ Spots: formattedSpots, page, size });
});

// Get all spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const spots = await Spot.findAll({
    where: {
      ownerId: currentUser.id,
    },
  });

  const formattedSpots = spots.map((spot) => {
    const formattedSpot = spot.toJSON();

    const newTimeUpdatedAt = new Date(formattedSpot.updatedAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateUpdatedAt = new Date(formattedSpot.updatedAt)
      .toISOString()
      .split('T')[0];

    const newTimeCreatedAt = new Date(formattedSpot.createdAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateCreatedAt = new Date(formattedSpot.createdAt)
      .toISOString()
      .split('T')[0];

    delete formattedSpot.createdAt;
    delete formattedSpot.updatedAt;

    formattedSpot.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
    formattedSpot.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

    const reviews = formattedSpot.Reviews || [];
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

    formattedSpot.avgRating = avgRating;

    if (formattedSpot.Images && formattedSpot.Images.length > 0) {
      formattedSpot.previewImage = formattedSpot.Images[0].url;
      delete formattedSpot.Images;
    } else {
      formattedSpot.previewImage = 'No preview image found';
    }

    delete formattedSpot.Reviews;

    return formattedSpot;
  });

  res.json({ Spots: formattedSpots });
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

  const user = await User.findByPk(spot.ownerId, {
    attributes: { exclude: ['username'] },
  });

  const formattedUser = user.toJSON();

  const formattedSpot = spot.toJSON();

  const newTimeUpdatedAt = new Date(formattedSpot.updatedAt)
    .toISOString()
    .split('')
    .slice(11, 19)
    .join('');

  const newDateUpdatedAt = new Date(formattedSpot.updatedAt)
    .toISOString()
    .split('T')[0];

  const newTimeCreatedAt = new Date(formattedSpot.createdAt)
    .toISOString()
    .split('')
    .slice(11, 19)
    .join('');

  const newDateCreatedAt = new Date(formattedSpot.createdAt)
    .toISOString()
    .split('T')[0];

  delete formattedSpot.createdAt;
  delete formattedSpot.updatedAt;

  formattedSpot.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
  formattedSpot.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

  formattedSpot.numReviews = spot.Reviews.length;

  const reviews = formattedSpot.Reviews || [];
  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  const avgRating = reviews.length > 0 ? totalStars / reviews.length : 0;

  formattedSpot.avgStarRating = avgRating;

  if (formattedSpot.Images) {
    formattedSpot.Images = formattedSpot.Images.map((image) => ({
      id: image.id,
      url: image.url,
      preview: image.preview,
    }));
    formattedSpot.SpotImages = formattedSpot.Images;
  }

  delete formattedSpot.Images;

  if (formattedSpot.Users) {
    // (formattedSpot.id = formattedUser.id),
      (formattedSpot.Owner = formattedUser);
  }

  delete formattedSpot.Users;
  delete formattedSpot.Reviews;

  res.json(formattedSpot);
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

  let currentNewSpot = newSpot.toJSON();

  const newTimeUpdatedAt = new Date(currentNewSpot.updatedAt)
    .toISOString()
    .split('')
    .slice(11, 19)
    .join('');

  const newDateUpdatedAt = new Date(currentNewSpot.updatedAt)
    .toISOString()
    .split('T')[0];

  const newTimeCreatedAt = new Date(currentNewSpot.createdAt)
    .toISOString()
    .split('')
    .slice(11, 19)
    .join('');

  const newDateCreatedAt = new Date(currentNewSpot.createdAt)
    .toISOString()
    .split('T')[0];

  currentNewSpot.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
  currentNewSpot.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

  res.status(201).json(currentNewSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, isAuthorized, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  const { url, preview } = req.body;

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
router.put(
  '/:spotId',
  requireAuth,
  isAuthorized,
  validateEditSpot,
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);

    const spotUpdated = await spot.update(req.body);

    let currentSpot = spotUpdated.toJSON();

    const newTimeUpdatedAt = new Date(currentSpot.updatedAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateUpdatedAt = new Date(currentSpot.updatedAt)
      .toISOString()
      .split('T')[0];

    const newTimeCreatedAt = new Date(currentSpot.createdAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateCreatedAt = new Date(currentSpot.createdAt)
      .toISOString()
      .split('T')[0];

    currentSpot.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
    currentSpot.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

    res.json(currentSpot);
  }
);

// Delete a Spot
router.delete('/:spotId', requireAuth, isAuthorized, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  await spot.destroy();

  res.json({
    message: 'Successfully deleted',
  });
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const reviews = await spot.getReviews({
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: Image, attributes: ['id', 'url'] },
    ],
  });

  const modifiedReviews = reviews.map((review) => {
    const reviewJson = review.toJSON();
    if (reviewJson.Images) {
      const imagesWithIdAndUrl = reviewJson.Images.map((image) => ({
        id: image.id,
        url: image.url,
      }));
      reviewJson.ReviewImages = imagesWithIdAndUrl;
      delete reviewJson.Images;
    }
    return reviewJson;
  });

  res.json({ Reviews: modifiedReviews });
});

// Create a Review for a Spot based on the Spot's id
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateCreateReview,
  async (req, res) => {
    const currentUser = req.user.toJSON();
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    let currentReview;

    const reviews = await spot.getReviews({});
    reviews.map((review) => {
      currentReview = review.toJSON();
    });

    if (reviews.length > 0 && currentReview.userId === currentUser.id) {
      return res.status(500).json({
        message: 'User already has a review for this spot',
      });
    }

    const currentSpot = spot.toJSON();

    const { review, stars } = req.body;

    const newReview = await Review.create({
      userId: currentUser.id,
      spotId: currentSpot.id,
      review,
      stars,
    });

    let currentNewReview = newReview.toJSON();

    const newTimeUpdatedAt = new Date(currentNewReview.updatedAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateUpdatedAt = new Date(currentNewReview.updatedAt)
      .toISOString()
      .split('T')[0];

    const newTimeCreatedAt = new Date(currentNewReview.createdAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateCreatedAt = new Date(currentNewReview.createdAt)
      .toISOString()
      .split('T')[0];

    currentNewReview.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
    currentNewReview.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

    res.status(201).json(currentNewReview);
  }
);

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const { id } = req.user.toJSON();

  const currentUser = await User.findByPk(id, {
    attributes: {
      exclude: ['username', 'email', 'createdAt', 'updatedAt'],
    },
  });

  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
    },
  });

  let formattedBookings = [];

  if (id == req.params.spotId) {
    bookings.map((booking) => {
      const newTimeUpdatedAt = new Date(booking.updatedAt)
        .toISOString()
        .split('')
        .slice(11, 19)
        .join('');

      const newDateUpdatedAt = new Date(booking.updatedAt)
        .toISOString()
        .split('T')[0];

      const newTimeCreatedAt = new Date(booking.createdAt)
        .toISOString()
        .split('')
        .slice(11, 19)
        .join('');

      const newDateCreatedAt = new Date(booking.createdAt)
        .toISOString()
        .split('T')[0];

      formattedBookings.push({
        User: currentUser,
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: new Date(booking.startDate).toISOString().split('T')[0],
        endDate: new Date(booking.endDate).toISOString().split('T')[0],
        createdAt: `${newDateCreatedAt} ${newTimeCreatedAt}`,
        updatedAt: `${newDateUpdatedAt} ${newTimeUpdatedAt}`,
      });
    });

    res.json({ Bookings: formattedBookings });
  } else {
    bookings.map((booking) => {
      formattedBookings.push({
        spotId: booking.spotId,
        startDate: new Date(booking.startDate).toISOString().split('T')[0],
        endDate: new Date(booking.endDate).toISOString().split('T')[0],
      });
    });

    res.json({ Bookings: formattedBookings });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post(
  '/:spotId/bookings',
  requireAuth,
  validateCreateBooking,
  async (req, res) => {
    const currentUser = req.user.toJSON();
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== currentUser.id) {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);

      const existingBooking = await Booking.findAll({
        where: {
          [Op.or]: [
            { startDate: { [Op.between]: [startDate, endDate] } },
            { endDate: { [Op.between]: [startDate, endDate] } },
            {
              startDate: { [Op.lte]: startDate },
              endDate: { [Op.gte]: endDate },
            },
          ],
        },
      });

      if (existingBooking.length > 0) {
        const conflictingStartDate = existingBooking.some(
          (booking) =>
            startDate >= booking.startDate && startDate <= booking.endDate
        );
        const conflictingEndDate = existingBooking.some(
          (booking) =>
            endDate >= booking.startDate && endDate <= booking.endDate
        );

        const conflictingStartEndDate = existingBooking.some(
          (booking) =>
            startDate <= booking.startDate && endDate >= booking.endDate
        );

        const errors = {};

        if (conflictingEndDate) {
          errors.endDate = 'End date conflicts with an existing booking';
        }

        if (conflictingStartDate) {
          errors.startDate = 'Start date conflicts with an existing booking';
        }

        if (conflictingStartEndDate) {
          errors.startDate = 'Start date conflicts with an existing booking';
          errors.endDate = 'End date conflicts with an existing booking';
        }

        if (Object.keys(errors).length > 0) {
          return res.status(403).json({
            message:
              'Sorry, this spot is already booked for the specified dates',
            errors,
          });
        }
      } else {
        await Booking.create({
          userId: currentUser.id,
          spotId: spot.id,
          startDate,
          endDate,
        });
      }

      let currentBooking = await Booking.findAll({
        where: {
          spotId: req.params.spotId,
          userId: currentUser.id,
        },
      });

      const formattedBookings = [];

      currentBooking.map((booking) => {
        const newTimeUpdatedAt = new Date(booking.updatedAt)
          .toISOString()
          .split('')
          .slice(11, 19)
          .join('');

        const newDateUpdatedAt = new Date(booking.updatedAt)
          .toISOString()
          .split('T')[0];

        const newTimeCreatedAt = new Date(booking.createdAt)
          .toISOString()
          .split('')
          .slice(11, 19)
          .join('');

        const newDateCreatedAt = new Date(booking.createdAt)
          .toISOString()
          .split('T')[0];

        formattedBookings.push({
          id: booking.id,
          userId: booking.userId,
          spotId: booking.spotId,
          startDate: new Date(booking.startDate).toISOString().split('T')[0],
          endDate: new Date(booking.endDate).toISOString().split('T')[0],
          createdAt: `${newDateCreatedAt} ${newTimeCreatedAt}`,
          updatedAt: `${newDateUpdatedAt} ${newTimeUpdatedAt}`,
        });
      });

      res.status(200).json(formattedBookings[0]);
    } else {
      return res.status(403).json({
        message: 'Forbbiden',
      });
    }
  }
);

module.exports = router;
