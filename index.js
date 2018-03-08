var express  = require('express');
var bodyparser = require('body-parser')
var mongoose  = require('mongoose');
const companyRecord = require('./model/user');
var STUD = require('./routes/adminrout');
var router = express.Router();
var app = express();
app.use(bodyparser.urlencoded({
  extended : false
}));
app.use(bodyparser.json());


app.listen(8050,function(req,res){
  console.log("port 8050 is Running......................... ");
})
