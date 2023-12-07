const express = require('express');
const { Spot, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
  const currentUser = req.user.toJSON();

  const imageId = Number(req.params.imageId);

  const image = await Image.findOne({
    where: {
      id: imageId,
      imageableType: 'Spot',
    },
  });

  if (!image) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  const currentImage = image.toJSON();

  const spot = await Spot.findOne({
    where: {
      id: currentImage.imageableId,
    },
  });

  const currentSpot = spot.toJSON();

  if (currentUser.id != currentSpot.ownerId) {
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
