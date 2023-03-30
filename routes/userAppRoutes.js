var express = require('express');
var router = express.Router();

const { createUser, login, loginToken, profile, logoutToken, getProfile, signUp, singIn, singOut}  = require('../controllers/userAppController')


router.post('/register', createUser)
router.post('/login', login)
router.post('/loginToken', loginToken)
router.get('/dashboard', getProfile)
router.post('/logoutToken', logoutToken)

router.post('/signupAdmin', signUp)
router.post('/loginAdmin', singIn)
router.post('/singOutAdmin', singOut)

module.exports = router;