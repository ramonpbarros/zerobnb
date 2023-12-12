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
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
      const err = new Error();
      err.message = "Spot couldn't be found";
      err.status = 404;
      return next(err);
    }

    if (currentUser.id === spot.ownerId) {
      return next();
    } else if (spot.ownerId !== currentUser.id) {
      const err = new Error();
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
    }
  }

  if (reviewId) {
    const review = await Review.findByPk(reviewId)

    if (!review) {
      const err = new Error();
      err.message = "Review couldn't be found";
      err.status = 404;
      return next(err);
    }

    if (review.userId === currentUser.id) {
      return next();
    } else if (review.userId !== currentUser.id) {
      const err = new Error();
      err.message = 'Forbidden';
      err.status = 403;
      return next(err);
    }
  }

  if (bookingId) {
    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
      const err = new Error();
      err.message = "Booking couldn't be found";
      err.status = 404;
      return next(err);
    }

    if (currentUser.id === booking.userId) {
      return next();
    } else if (booking.userId !== currentUser.id) {
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
