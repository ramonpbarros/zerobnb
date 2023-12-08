const express = require('express');
const { Review, Spot, User, Image } = require('../../db/models');
const { requireAuth, isAuthorized } = require('../../utils/auth');
const { validateEditReview } = require('../../utils/sequelize-validations');

const router = express.Router();

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const reviews = await Review.findAll({
    include: [{ model: User }, { model: Spot }, { model: Image }],
    where: {
      userId: currentUser.id,
    },
  });

  const allReviews = await Promise.all(
    reviews.map(async (review) => {
      const reviewJson = review.toJSON();

      const newTimeUpdatedAt = new Date(review.updatedAt)
        .toISOString()
        .split('')
        .slice(11, 19)
        .join('');

      const newDateUpdatedAt = new Date(review.updatedAt)
        .toISOString()
        .split('T')[0];

      const newTimeCreatedAt = new Date(review.createdAt)
        .toISOString()
        .split('')
        .slice(11, 19)
        .join('');

      const newDateCreatedAt = new Date(review.createdAt)
        .toISOString()
        .split('T')[0];

      reviewJson.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
      reviewJson.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

      if (reviewJson.User) {
        const { username, ...userWithoutUsername } = reviewJson.User;
        reviewJson.User = userWithoutUsername;
      }

      if (reviewJson.Spot) {
        const spotRefactoredKeys = reviewJson.Spot;
        const images = await Image.findAll({
          where: {
            imageableType: 'Spot',
            imageableId: reviewJson.Spot.id,
          },
        });

        if (images && images.length > 0) {
          spotRefactoredKeys.previewImage = images[0].url;
        }

        const { description, createdAt, updatedAt, ...spotWithoutUnnecessary } =
          spotRefactoredKeys;
        reviewJson.Spot = spotWithoutUnnecessary;
      }

      if (reviewJson.Images) {
        const images = await Image.findAll({
          where: {
            imageableType: 'Review',
            imageableId: reviewJson.Spot.id,
          },
        });

        const imagesWithIdAndUrl = images.map((image) => ({
          id: image.id,
          url: image.url,
        }));

        reviewJson.ReviewImages = imagesWithIdAndUrl;
      }

      delete reviewJson.Images;

      return reviewJson;
    })
  );

  res.json({ Reviews: allReviews });
});

// Add an Image to a Review based on the Review's id
router.post(
  '/:reviewId/images',
  requireAuth,
  isAuthorized,
  async (req, res) => {
    const { url } = req.body;

    const review = await Review.findByPk(req.params.reviewId);

    const images = await review.getImages({});

    if (images.length < 11) {
      const newImage = await Image.create({
        imageableId: review.id,
        imageableType: 'Review',
        url,
        preview: false,
      });

      res.json({
        id: newImage.id,
        url: newImage.url,
      });
    } else {
      return res.status(403).json({
        message: 'Maximum number of images for this resource was reached',
      });
    }
  }
);

// Edit a Review
router.put(
  '/:reviewId',
  requireAuth,
  isAuthorized,
  validateEditReview,
  async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    const reviewUpdated = await review.update(req.body);

    let currentReview = reviewUpdated.toJSON()

    const newTimeUpdatedAt = new Date(currentReview.updatedAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateUpdatedAt = new Date(currentReview.updatedAt)
      .toISOString()
      .split('T')[0];

    const newTimeCreatedAt = new Date(currentReview.createdAt)
      .toISOString()
      .split('')
      .slice(11, 19)
      .join('');

    const newDateCreatedAt = new Date(currentReview.createdAt)
      .toISOString()
      .split('T')[0];

    currentReview.createdAt = `${newDateCreatedAt} ${newTimeCreatedAt}`;
    currentReview.updatedAt = `${newDateUpdatedAt} ${newTimeUpdatedAt}`;

    res.json(currentReview);
  }
);

// Delete a Review
router.delete('/:reviewId', requireAuth, isAuthorized, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);

  await review.destroy();

  res.json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
