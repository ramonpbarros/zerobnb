const express = require('express');
const { Review, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const imageId = Number(req.params.imageId);

  const image = await Image.findOne({
    where: {
      id: imageId,
      imageableType: 'Review',
    },
  });

  if (!image) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }

  const currentImage = image.toJSON();

  const review = await Review.findOne({
    where: {
      id: currentImage.imageableId,
    },
  });

  const currentReview = review.toJSON();

  if (currentUser.id != currentReview.userId) {
    return res.status(403).json({
      message: 'Forbbiden',
    });
  }

  await image.destroy();

  res.json({
    message: 'Successfully deleted',
  });
});

module.exports = router;
