const { handleValidationErrors } = require('./validation');
const { check } = require('express-validator');

const validateCreateSpot = [
  check('address')
    .exists()
    .notEmpty()
    .withMessage('Street address is required'),
  check('city').exists().notEmpty().withMessage('City is required'),
  check('state').exists().notEmpty().withMessage('State is required'),
  check('country').exists().notEmpty().withMessage('Country is required'),
  check('lat')
    .exists()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists()
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists()
    .withMessage('Price per day is required')
    .isFloat({ gt: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors,
];

const validateEditSpot = [
  check('address')
    .optional()
    .exists()
    .notEmpty()
    .withMessage('Street address is required'),
  check('city').optional().exists().notEmpty().withMessage('City is required'),
  check('state')
    .optional()
    .exists()
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .optional()
    .exists()
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .optional()
    .exists()
    .withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .optional()
    .exists()
    .withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .optional()
    .exists()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .optional()
    .exists()
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .optional()
    .exists()
    .withMessage('Price per day is required')
    .isFloat({ gt: 0 })
    .withMessage('Price per day must be a positive number'),
  handleValidationErrors,
];

const validateCreateReview = [
  check('review')
    .exists()
    .withMessage('Review text is required')
    .isLength({ min: 1, max: 256 })
    .withMessage('Review text is required'),
  check('stars')
    .exists()
    .withMessage('Stars must be an integer from 1 to 5')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

const validateEditReview = [
  check('review')
    .optional()
    .exists()
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .optional()
    .exists()
    .withMessage('Stars must be an integer from 1 to 5')
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors,
];

const validateCreateBooking = [
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

const validateEditBooking = [
  check('startDate')
    .optional()
    .exists()
    .isAfter(new Date().toString())
    .withMessage('startDate cannot be in the past'),

  // check('startDate')
  //   .optional()
  //   .exists()
  //   .custom((value, { req }) => {
  //     if (value && new Date(value) < new Date()) {
  //       throw new Error('startDate cannot be in the past');
  //     }
  //     return true;
  //   }),

  check('endDate')
    .optional()
    .exists()
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

const validateGetAllSpots = [
  check('page')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 10 })
    .withMessage('Page must be an integer between 1 and 10')
    .toInt(),

  check('size')
    .optional({ nullable: true })
    .isInt({ min: 1, max: 20 })
    .withMessage('Size must be an integer between 1 and 20')
    .toInt(),

  check('minLat')
    .optional()
    .isFloat()
    .withMessage('Minimum latitude must be a decimal'),

  check('maxLat')
    .optional()
    .isFloat()
    .withMessage('Maximum latitude must be a decimal'),

  check('minLng')
    .optional()
    .isFloat()
    .withMessage('Minimum longitude must be a decimal'),

  check('maxLng')
    .optional()
    .isFloat()
    .withMessage('Maximum longitude must be a decimal'),

  check('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a decimal greater than or equal to 0'),

  check('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a decimal greater than or equal to 0'),

  handleValidationErrors,
];

module.exports = {
  validateCreateSpot,
  validateEditSpot,
  validateCreateReview,
  validateEditReview,
  validateCreateBooking,
  validateEditBooking,
  validateGetAllSpots,
};
