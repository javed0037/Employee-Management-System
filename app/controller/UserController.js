var express = require('express');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var MYcompanyRecord = require('../Model/user.js');
var bcrypt =  require('bcrypt');
var jwt = require('jsonwebtoken');
var paypal = require('paypal-rest-sdk');
var morgan = require('morgan');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYVTNK773GJPFGR0tntTZFWAl_tJkgN-qbMafhRVgAwO0d0jXsNuT1KdcyXaeWlqmySbSc-unasn2fjO',
  'client_secret': 'ECafsQcIVKtfPxhWuYm4izV3KAtBUxZ6UBQoPXTsaEBYQxxhBomzDizHwpfMqrf6Kg-zey5ehgDnv6Ju'
});



var registration = function(req, res) {

      let Password = req.body.Password;
      let Email = req.body.email;
      let confirmpassword = { confirmpassword : req.body.confirmpassword };
      if(confirmpassword.confirmpassword === Password) {

            MYcompanyRecord.findOne({Email:req.body.Email},{},function(err,data){
              if(err){  res.json({ message : "There are error due to ",err  }) }
                 if(!data){
                    bcrypt.hash(Password, 10, function(err, hash) {
                      if (err) {
                          res.json({ message: "unable to bcrypt the password",status: 200 })
                        } else if (hash){
                              let requestObj = {
                                  FirstName: req.body.FirstName,
                                  LasName: req.body.LastName,
                                  Phone: req.body.Phone,
                                  Email : req.body.Email,
                                  Password: hash
                                  };
                                  if (requestObj.FirstName && requestObj.LasName && requestObj.Phone && requestObj.Email) {
                                    MYcompanyRecord.create(requestObj, function(err, data) {
                                      if (err) {
                                            console.log('errrrrrrrrrrrrrrrrrr', err);
                                             res.json({ message: "error, There is unable to store record in db",status: 400 })
                                           } else if (data) {
                                               res.json({meassage :"New Account has been register successfully",status : 200})
                                               var transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    user: 'javedkhan199501@gmail.com',
                                                    pass: 'arshwrarshi'
                                                }
                                            });
                                            var mailOptions = {
                                                from: 'javedkhan199501@gmail.com',
                                                to: 'javedkhan19950@gmail.com',
                                                subject: 'Sending Email using Node.js',
                                                text: 'this is the link for reset the password'
                                            };
                                            transporter.sendMail(mailOptions, function(error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            })
                                          }
                                             else {
                               console.log("hi there are hash", data.Email);
                                res.json({ message: "There are an error to get the data", status: 400 })
                            }
                          })
                        }
                          else {res.json({ message : "Please enter the all required field ",meaasge : 400 })}

                    }
                     else {
                        res.json({  message: "Password is unable to bcrypt the password" , status: 400 })
                    }
                })
              }
              else {
                res.json({messagge : "This email id is already register with us",status : 400})}
             })
      }
      else {
            res.json({ message: "Password and confirmPassword not match " });
        }
    }
    login = function(req,res) {
                var reqObj = {
                   Email : req.body.Userid,
                   Password : req.body.UserPassword
                };
                if(reqObj.Email && reqObj.Password){
                  MYcompanyRecord.findOne({Email :req.body.Userid},{},function(err ,data){
                    if(err){
                      res.json({message : "Err, unable to get the data",err,status : 400})
                    }
                    if(data) {
                      console.log('Hi, javedkhannnnnnnnnnnnnnnnnnnnnn',data);
                      if(data.Verifymail.verificationStatus == true){
                      bcrypt.compare(req.body.UserPassword,data.Password,function(err  ,success){
                        if(err){

                          res.json({message : "unable to campare the password",status : 400})

                        } else if(success){
                             var token = jwt.sign({id:data._id},'secret',{ expiresIn: '1h' });
                             return res.json({ message : "User login successfully",auth : true,token : token , data : data })

                       var userid =  function(req, res) {
                        var token = req.headers['token'];
                        jwt.verify(token, "name", function(err, decoded) {
                          if (err) return res.json(err);
                          return res.json(decoded);
                        });
                }
                 }else {
                   res.json({ message : "PLease enter the correct password ",})
                 }
               })
             }else{res.json({message :  "Your emailId is not verified ,First Please verify the email",status : 400})}
             }
               else {res.json({message : "unable to get data in this else",status : 400})}

              })
            }else {
            res.json({message : "Please enter the both user name and password carefully",status : 400})
          }
        }
        paymentIntegration = function(req,res) {
          var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:8050",
                    "cancel_url": "http://cancel.url:8050"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Red  Sok Hat",
                            "sku": "001",
                            "price": "25.00",
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": "1.00"
                    },
                    "description": "This is the payment description."
                }]
       };
                   paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                  console.log('errrrrrrrrrrrrrr',payment);
                    throw error;
                } else {
                    console.log("Create Payment Response");
                    console.log(payment);
                }
});



        }
        var paymentIntegration = function(req, res){
          const create_payment_json = {
         "intent": "sale",
         "payer": {
             "payment_method": "paypal"
         },
         "redirect_urls": {
             "return_url": "http://localhost:8050/success",
             "cancel_url": "http://localhost:8050/cancel"
         },
         "transactions": [{
             "item_list": {
                 "items": [{
                     "name": "Red Sox Hat",
                     "sku": "001",
                     "price": "25.00",
                     "currency": "USD",
                     "quantity": 1
                 }]
             },
             "amount": {
                 "currency": "USD",
                 "total": "25.00"
             },
             "description": "Hat for the best team ever"
         }]
     };

     paypal.payment.create(create_payment_json, function (error, payment) {
       if (error) {
           throw error;
       } else {
           for(let i = 0;i < payment.links.length;i++){
             if(payment.links[i].rel === 'approval_url'){
               res.redirect(payment.links[i].href);
             }
           }
       }
     });

     }


      exports.registration = registration;
      exports.login = login;
      exports.paymentIntegration = paymentIntegration;
