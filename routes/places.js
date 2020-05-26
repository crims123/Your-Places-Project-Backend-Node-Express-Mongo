const { Router } = require('express');
const {
  createPlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
  deletePlace,
} = require('../controllers/places');
const verifyAuth = require('../middleware/verifyAuth');

const router = Router();

router.route('/').post(verifyAuth, createPlace);

router
  .route('/:id')
  .get(verifyAuth, getPlaceById)
  .put(verifyAuth, updatePlace)
  .delete(verifyAuth, deletePlace);

router.route('/user/:id').get(getPlacesByUserId);

module.exports = router;
