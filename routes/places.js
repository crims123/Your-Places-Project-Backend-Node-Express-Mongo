const { Router } = require('express');
const {
  createPlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
  deletePlace,
} = require('../controllers/places');
const verifyAuth = require('../middleware/verifyAuth');
const fileUpload = require('../middleware/fileUpload');

const router = Router();

router.route('/').post(verifyAuth, fileUpload.single('image'), createPlace);

router
  .route('/:id')
  .get(verifyAuth, getPlaceById)
  .put(verifyAuth, updatePlace)
  .delete(verifyAuth, deletePlace);

router.route('/user/:id').get(getPlacesByUserId);

module.exports = router;
