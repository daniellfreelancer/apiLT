var express = require('express');
var router = express.Router();

const { createUser, login, loginToken, profile, logoutToken, getProfile}  = require('../controllers/userAppController')


router.post('/register', createUser)
router.post('/login', login)
router.post('/loginToken', loginToken)
router.get('/dashboard', getProfile)
router.post('/logoutToken', logoutToken)

module.exports = router;