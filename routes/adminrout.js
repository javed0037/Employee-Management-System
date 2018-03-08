var express = require('express');
var router = express.Router();
var usered = require('../controller/UserController');
router.get('/getUsers', function(req, res){
  console.log('from router');

})
router.post('/registration', usered.registration);

modeule.exports = router;
