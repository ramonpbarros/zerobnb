const express = require('express');
const { Op } = require('sequelize');
const { Booking, Spot, Image } = require('../../db/models');
const { requireAuth, isAuthorized } = require('../../utils/auth');
const { validateEditBooking } = require('../../utils/sequelize-validations');

const router = express.Router();

// Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const bookings = await Booking.findAll({
    where: {
      userId: currentUser.id,
    },
  });

  let formattedBookings = [];

  for (let i = 0; i < bookings.length; i++) {
    const currentBooking = bookings[i].toJSON();

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

    const newTimeUpdatedAt = new Date(currentBooking.updatedAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateUpdatedAt = new Date(currentBooking.updatedAt)
      .toISOString()
      .split('T')[0];

    const newTimeCreatedAt = new Date(currentBooking.createdAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateCreatedAt = new Date(currentBooking.createdAt)
      .toISOString()
      .split('T')[0];

    formattedBookings.push({
      id: currentBooking.id,
      spotId: currentBooking.spotId,
      Spot: currentSpot,
      userId: currentBooking.userId,
      startDate: new Date(currentBooking.startDate).toISOString().split('T')[0],
      endDate: new Date(currentBooking.endDate).toISOString().split('T')[0],
      createdAt: `${newDateCreatedAt} ${newTimeCreatedAt}`,
      updatedAt: `${newDateUpdatedAt} ${newTimeUpdatedAt}`,
    });
  }

  res.json({
    Bookings: formattedBookings,
  });
});

// Edit a Booking
router.put(
  '/:bookingId',
  requireAuth,
  isAuthorized,
  validateEditBooking,
  async (req, res) => {
    if (!req.params.bookingId) {
      return res.status(400).json({ message: 'Booking ID is missing' });
    }

    const booking = await Booking.findByPk(req.params.bookingId);

    if (new Date(booking.endDate) < new Date()) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    const existingBookings = await Booking.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: req.params.bookingId } }, // Exclude the current booking from conflict check
          {
            [Op.or]: [
              { startDate: { [Op.between]: [startDate, endDate] } },
              { endDate: { [Op.between]: [startDate, endDate] } },
              {
                startDate: { [Op.lte]: startDate },
                endDate: { [Op.gte]: endDate },
              },
            ],
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      const conflicts = {};
      existingBookings.forEach((existingBooking) => {
        if (
          (startDate >= existingBooking.startDate && startDate <= existingBooking.endDate) ||
          (endDate >= existingBooking.startDate && endDate <= existingBooking.endDate)
        ) {
          conflicts.startDate = 'Start date conflicts with an existing booking';
          conflicts.endDate = 'End date conflicts with an existing booking';
        }
      });

      return res.status(403).json({
        message: 'Sorry, this spot is already booked for the specified dates',
        errors: conflicts,
      });
    } else {
      await booking.update(req.body);
    }

    const updatedBooking = await Booking.findByPk(req.params.bookingId);

    const newTimeUpdatedAt = new Date(updatedBooking.updatedAt)
        .toISOString()
        .split('')
        .slice(11, 19)
        .join('');

      const newDateUpdatedAt = new Date(updatedBooking.updatedAt)
        .toISOString()
        .split('T')[0];

      const newTimeCreatedAt = new Date(updatedBooking.createdAt)
        .toISOString()
        .split('')
        .slice(11, 19)
        .join('');

      const newDateCreatedAt = new Date(updatedBooking.createdAt)
        .toISOString()
        .split('T')[0];


    const formattedBookings = {
      id: updatedBooking.id,
      spotId: updatedBooking.spotId,
      userId: updatedBooking.userId,
      startDate: new Date(updatedBooking.startDate).toISOString().split('T')[0],
      endDate: new Date(updatedBooking.endDate).toISOString().split('T')[0],
      createdAt: `${newDateCreatedAt} ${newTimeCreatedAt}`,
      updatedAt: `${newDateUpdatedAt} ${newTimeUpdatedAt}`,
    };

    res.status(200).json(formattedBookings);
  }
);

// Delete a booking
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
