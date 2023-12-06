const express = require('express');
const { Op } = require('sequelize');
const { Booking, Spot, Image } = require('../../db/models');
const { requireAuth, isAuthorized } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const router = express.Router();

const validateBooking = [
  check('startDate')
    .exists()
    .withMessage('startDate cannot be in the past')
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error('startDate cannot be in the past');
      }
      return true;
    }),
  check('endDate')
    .exists()
    .withMessage('endDate cannot be on or before startDate')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors,
];

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const bookings = await Booking.findAll({
    where: {
      userId: currentUser.id,
    },
  });

  const currentBooking = bookings[0].toJSON();

  const spot = await Spot.findByPk(currentBooking.spotId, {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'description'],
    },
  });

  const currentSpot = spot.toJSON();

  if (currentSpot) {
    const image = await Image.findOne({
      where: {
        imageableId: currentSpot.id,
        imageableType: 'Spot',
        preview: true,
      },
      attributes: ['url'],
    });

    currentSpot.previewImage = image ? image.url : null;

    delete currentSpot.Images;
  }

  let formattedBookings = [];

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
      id: booking.id,
      spotId: booking.spotId,
      Spot: currentSpot,
      userIdid: booking.userId,
      startDate: new Date(booking.startDate).toISOString().split('T')[0],
      endDate: new Date(booking.endDate).toISOString().split('T')[0],
      createdAt: `${newDateCreatedAt} ${newTimeCreatedAt}`,
      updatedAt: `${newDateUpdatedAt} ${newTimeUpdatedAt}`,
    });
  });

  res.json({
    Bookings: formattedBookings,
  });
});

// Edit a Booking
router.put(
  '/:bookingId',
  requireAuth,
  isAuthorized,
  validateBooking,
  async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (new Date(booking.endDate) < new Date()) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

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
        (booking) => endDate >= booking.startDate && endDate <= booking.endDate
      );

      const errors = {};

      if (conflictingEndDate) {
        errors.endDate = 'End date conflicts with an existing booking';
      }

      if (conflictingStartDate) {
        errors.startDate = 'Start date conflicts with an existing booking';
      }

      return res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors,
      });
    } else {
      await booking.update(req.body);
    }

    let currentBooking = await Booking.findAll({
      where: {
        id: req.params.bookingId,
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
        userId: booking.userId,
        spotId: booking.spotId,
        startDate: new Date(booking.startDate).toISOString().split('T')[0],
        endDate: new Date(booking.endDate).toISOString().split('T')[0],
        createdAt: `${newDateCreatedAt} ${newTimeCreatedAt}`,
        updatedAt: `${newDateUpdatedAt} ${newTimeUpdatedAt}`,
      });
    });

    res.status(200).json(formattedBookings);
  }
);

router.delete('/:bookingId', requireAuth, isAuthorized, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  let currentBooking = booking.toJSON();
  console.log(currentBooking);

  if (new Date(currentBooking.startDate) <= new Date()) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  await booking.destroy();

  res.json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
