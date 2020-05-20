const { Router } = require('express');
const { createPlace, getPlaceById } = require('../controllers/places');

const router = Router();

router.route('/').post(createPlace);

router.route('/:id').get(getPlaceById);

module.exports = router;
