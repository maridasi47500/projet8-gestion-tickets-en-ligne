const account = require('../controllers/account/lib.js');
var express = require('express');
var router = express.Router();

router.get('/login',account.loginForm);
router.post('/login',account.login);
router.get('/signup',account.signupForm);
router.post('/signup',account.signup);
router.get('/signout',account.signout);
router.get('/',account.welcome);

module.exports = router;