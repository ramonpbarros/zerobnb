const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Review, Booking } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === 'production';

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && 'Lax',
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt'],
        },
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error('Authentication required');
  err.title = 'Authentication required';
  err.errors = { message: 'Authentication required' };
  err.status = 401;
  return next(err);
};

// Require proper authorization: Spot must belong to the current user
const isAuthorized = async function (req, _res, next) {
  const currentUser = req.user.toJSON();
  const spotId = req.params.spotId;
  const reviewId = req.params.reviewId;
  const bookingId = req.params.bookingId;

  if (spotId) {
    const spot = await Spot.findOne({
      where: [
        {
          ownerId: spotId,
        },
      ],
    });

    let currentSpot;

    if (!spot) {
      const err = new Error();
      err.message = "Spot couldn't be found";
      err.status = 404;
      return next(err);
    } else {
      currentSpot = spot.toJSON();
    }

    if (currentUser.id === spot.id) {
      return next();
    } else if (currentSpot.ownerId !== currentUser.id) {
      const err = new Error();
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
    }
  }

  if (reviewId && reviewId != null) {
    const review = await Review.findOne({
      where: [
        {
          userId: reviewId,
        },
      ],
    });

    let currentReview;

    if (!currentReview) {
      const err = new Error();
      err.message = "Review couldn't be found";
      err.status = 404;
      return next(err);
    } else {
      currentReview = review.toJSON();
    }

    if (currentReview.userId === currentUser.id) {
      return next();
    } else if (currentReview.userId !== currentUser.id) {
      const err = new Error();
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
    }
  }

  if (bookingId) {
    const booking = await Booking.findOne({
      where: [
        {
          id: bookingId,
        },
      ],
    });

    let currentBooking;

    if (!booking) {
      const err = new Error();
      err.message = "Booking couldn't be found";
      err.status = 404;
      return next(err);
    } else {
      currentBooking = booking.toJSON();
    }

    if (currentUser.id === booking.userId) {
      return next();
    } else if (currentBooking.userId !== currentUser.id) {
      const err = new Error();
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
    }
  }
};

module.exports = {
  setTokenCookie,
  restoreUser,
  requireAuth,
  isAuthorized,
};
