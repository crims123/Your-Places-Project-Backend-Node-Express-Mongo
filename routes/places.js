const { Router } = require('express');
const {
  createPlace,
  getPlaceById,
  getUserPlaces,
} = require('../controllers/places');
const verifyAuth = require('../middleware/verifyAuth');

const router = Router();

router.route('/').post(verifyAuth, createPlace).get(verifyAuth, getUserPlaces);

router.route('/:id').get(verifyAuth, getPlaceById);

module.exports = router;
