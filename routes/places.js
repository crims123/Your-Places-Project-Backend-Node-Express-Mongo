const { Router } = require('express');
const { createPlace } = require('../controllers/places');

const router = Router();

router.route('/').post(createPlace);

module.exports = router;
