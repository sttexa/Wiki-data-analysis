var express = require('express');
var router = express.Router();
var logincontroller = require('../controllers/Login_controller')



router.post('/login_check', logincontroller.login_check);

router.post('/save', logincontroller.save);

router.get('/', logincontroller.index);

module.exports = router;

