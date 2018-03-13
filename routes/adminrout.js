var express = require('express');

var usered = require('../app/controller/UserController');
var router = express.Router();
router.get('/getUsers', function(req, res){
  console.log('from hgggggggggggggfrouter');

})
router.post('/registration', usered.registration);
router.post('/login',usered.login);
router.post('/paymentIntegration',usered.paymentIntegration);

module.exports = router;
