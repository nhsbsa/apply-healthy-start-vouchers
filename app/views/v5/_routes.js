// ********************************
// APPLY (VERSION 5)
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

router.post('/v5/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      
      if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
        res.redirect('/v5/apply/name')
      } else {
        res.redirect('/v5/apply/kickouts/not-eligible-national-insurance-number')
      }
  
    }
    else {
      res.redirect('/v5/apply/national-insurance-number')
    }
  
  })
  
  // What is your name?
  
  router.post('/v5/name', function (req, res) {
  
    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/v5/apply/date-of-birth')
    }
    else {
      res.redirect('/v5/apply/name')
    }
  
  })
  
  // Date of birth
  
  router.post('/v5/date-of-birth', function (req, res) {
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
  
    var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var ageDate =  new Date(today - dob.getTime())
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    req.session.data.yrs = yrs;
  
  
    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v5/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v5/apply/date-of-birth')
    }
  
  })
  
  // Are you pregnant?
  
  router.post('/v5/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v5/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/v5/apply/address')
    }
    else {
      res.redirect('/v5/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v5/due-date', function (req, res) {
  
    var duedateday = req.session.data['duedateday']
    var duedatemonth = req.session.data['duedatemonth']
    var duedateyear = req.session.data['duedateyear']
  
    var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);
  
    var today = moment();
  
    var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
    var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks
  
    
    if (duedateday && duedatemonth && duedateyear) {
  
      if (duedate < today) {
        res.redirect('/v5/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v5/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v5/apply/address')
      }
  
    }
    else {
      res.redirect('/v5/apply/due-date')
    }
  
  })
  
  // What is your address?
  
  router.post('/v5/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode']
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/v5/apply/email-address')
    } else {
      res.redirect('/v5/apply/address')
    }
  
  })
  
  // What is your email address?
  
  router.post('/v5/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/v5/apply/mobile-phone-number')
  
  })
  
  // What is your mobile phone number?
  
  router.post('/v5/mobile-phone-number', function (req, res) {
  
    var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
    res.redirect('/v5/apply/bank-details')
  
  })
  
  // Bank Details
  
  router.post('/v5/bank-details', function (req, res) {
  
    var accountName = req.session.data['accountname']
    var sortCode = req.session.data['sortcode']
    var accountNumber = req.session.data['accountnumber']
  
    if (accountName && sortCode && accountNumber){
      res.redirect('/v5/apply/check-your-answers')    
    }
    else {
      res.redirect('/v5/apply/bank-details')
    }
  
  })
  
  // Feedback
  
  router.post('/v5/feedback', function (req, res) {
    res.redirect('/v5/feedback')
  })

  // V5 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v5/check-your-answers', function (req, res) {

    var contact = req.session.data['contact'];
    var emailAddress = req.session.data['emailaddress'];
    var mobilePhoneNumber = req.session.data['mobilephonenumber'];
    var pregnant = req.session.data['pregnant']
    var firstName = req.session.data['firstname'];
    
    if (pregnant === "yes") {
  
    var refNo = 'HDJ2123F';
    var paymentAmount = '£24.80';
    var pregnancyPayment = '\n* £12.40 for a pregnancy';
    var childrenUnder4Payment = '\n* £12.40 for children between 1 and 4';
  
    var vitStart = moment().format('D MMMM YYYY');
    var vitEnd = moment().add(8, 'weeks').format("D MMMM YYYY");
    var vitTypeWomen = '\n* 1 pack(s) of vitamins for women';
  
    } else {
  
    var refNo = 'HDJ2123F';
    var paymentAmount = '£12.40';
    var childrenUnder4Payment = '\n* £12.40 for children between 1 and 4';
    
    }
  
    if (emailAddress) {
  
  
      if (pregnant === "yes") {
  
        notifyClient.sendEmail('fa19ba1e-138c-456c-9c11-791f772a4975', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
        .then(response => { console.log(response); res.redirect('/v5/apply/confirmation-successful'); })
        .catch(err => { console.error(err); res.redirect('/v5/apply/confirmation-successful'); })
  
      } else {
  
        notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
        .then(response => { console.log(response); res.redirect('/v5/apply/confirmation-successful'); })
        .catch(err => { console.error(err); res.redirect('/v5/apply/confirmation-successful'); })
    
      }
  
    }
    else if (mobilePhoneNumber) {
  
      if (pregnant === "yes") {
  
        // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
        // .then(response => { console.log(response); res.redirect('/v5/apply/confirmation-successful'); })
        // .catch(err => console.error(err))
  
        res.redirect('/v5/apply/confirmation-successful');
  
      } else {
  
        // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
        // .then(response => { console.log(response); res.redirect('/v5/apply/confirmation-successful'); })
        // .catch(err => console.error(err))
  
        res.redirect('/v5/apply/confirmation-successful');
    
      }
  
    } else if (!emailAddress && !mobilePhoneNumber) {
      res.redirect('/v5/apply/confirmation-successful');
  
    } else {
      res.redirect('/v5/apply/check-your-answers')
    }
  
  })

module.exports = router;