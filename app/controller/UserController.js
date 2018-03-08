var express = require('express');
var mongoose = require('mongoose');
var USERECORD = require('../model/user.js');
var bcrypt require('bcrypt');

var  registration = function(req,res){
  let requestObj = {
    let FirstName : req.body.FirstName,
    let LasName : req.body.LastName,
    let Phone :  req.body.LastName,
    let Password : req.body.password
  };
  USERECORD.create(requestObj,function(err,data){
    if(err){
      res.json({message : "error, There is unable to store record in db",status : 400 })
    }else if(data){
      bcrypt.hash(Password,10,funtion(err,hash){
        if(err){
          res.json({ message : "there is an err to hash the password",status : 400 })

        }else if(hash){
          res.json({message : "user registration sucessfully" , status  : 200 })
        }
        else {
          res.json({ message : "unable to bcrypt the password" });
        }


      })
    } else {
      res.json({ message :"there is unabe to get the data",status : 400 })
    }

  })
  export.registration = registration;




  }
}
