const express = require('express');
const { Review, Spot, User, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');

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

      if (reviewJson.Images && reviewJson.Images.length > 0) {
        const imagesWithIdAndUrl = reviewJson.Images.map((image) => ({
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

module.exports = router;
