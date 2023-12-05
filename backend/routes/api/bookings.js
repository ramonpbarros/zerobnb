const express = require('express');
const { Booking, Spot, Image } = require('../../db/models');
const { requireAuth, isAuthorized } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

const router = express.Router();

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

module.exports = router;
