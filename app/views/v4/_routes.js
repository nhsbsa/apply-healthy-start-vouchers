// ********************************
// APPLY (VERSION 4)
// ********************************

// External dependencies
const express = require('express');
const router = express.Router();
const moment = require('moment');
const stringSimilarity = require("string-similarity");
const geolib = require('geolib');
const https = require("https");

// API
const axios = require('axios');

// CONSTANTS
const today = new Date(Date.now());
const { listenerCount } = require('gulp');

// ********************************

// What is your national insurance number?

router.post('/v4/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
  
      if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
        res.redirect('/v4/apply/name')
      } else {
        res.redirect('/v4/apply/kickouts/not-eligible-national-insurance-number')
      }
  
    }
    else {
      res.redirect('/v4/apply/national-insurance-number')
    }
  
  })
  
  // What is your name?
  
  router.post('/v4/name', function (req, res) {
  
    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/v4/apply/date-of-birth')
    }
    else {
      res.redirect('/v4/apply/name')
    }
  
  })
  
  // Date of birth
  
  router.post('/v4/date-of-birth', function (req, res) {
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
  
    var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var ageDate =  new Date(today - dob.getTime())
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    req.session.data.yrs = yrs;
  
  
    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v4/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v4/apply/date-of-birth')
    }
  
  })
  
  // Are you pregnant?
  
  router.post('/v4/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v4/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/v4/apply/address')
    }
    else {
      res.redirect('/v4/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v4/due-date', function (req, res) {
  
    var duedateday = req.session.data['duedateday']
    var duedatemonth = req.session.data['duedatemonth']
    var duedateyear = req.session.data['duedateyear']
  
    var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);
  
    var today = moment();
  
    var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
    var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks
  
    
    if (duedateday && duedatemonth && duedateyear) {
  
      if (duedate < today) {
        res.redirect('/v4/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v4/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v4/apply/address')
      }
  
    }
    else {
      res.redirect('/v4/apply/due-date')
    }
  
  })
  
  // What is your address?
  
  router.post('/v4/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode']
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/v4/apply/bank-details')
    } else {
      res.redirect('/v4/apply/address')
    }
  
  })
  
  // Bank Details
  
  router.post('/v4/bank-details', function (req, res) {
  
    var accountName = req.session.data['accountname']
    var sortCode = req.session.data['sortcode']
    var accountNumber = req.session.data['accountnumber']
  
    if (accountName && sortCode && accountNumber){
      res.redirect('/v4/apply/check-your-answers')    
    }
    else {
      res.redirect('/v4/apply/bank-details')
    }
  
  })
  
  // Check your answers
  
  router.post('/v4/check-your-answers', function (req, res) {
    res.redirect('/v4/apply/confirmation-successful')
  })
  
  // Declaration
  
  router.post('/v4/declaration', function (req, res) {
    res.redirect('/v4/apply/confirmation-successful')
  })
  
  // Feedback
  
  router.post('/v4/feedback', function (req, res) {
    res.redirect('/v4/feedback')
  })

module.exports = router;