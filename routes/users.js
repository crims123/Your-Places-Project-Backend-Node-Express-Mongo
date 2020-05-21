const { Router } = require('express');
const { addUser, login, getUsers } = require('../controllers/users');
const verifyAuth = require('../middleware/verifyAuth');

const router = Router();

router.route('/').post(addUser).get(getUsers);

router.route('/login').post(login);

module.exports = router;
