const { Router } = require('express');
const { addUser, login, getUsers } = require('../controllers/users');
const fileUpload = require('../middleware/fileUpload');

const router = Router();

router.route('/').post(fileUpload.single('image'), addUser).get(getUsers);

router.route('/login').post(login);

module.exports = router;
