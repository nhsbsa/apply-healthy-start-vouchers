// ********************************
// APPLY (VERSION 3)
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

// V3 Declaration

router.post('/v3/declaration', function (req, res) {

    var emailAddress = req.session.data['emailaddress'];
    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].replace(/\s+/g, '');
  
    var refNo = 'HDJ2123F';
    var firstName = req.session.data['firstname'];
    var paymentAmount = '£12.40';
    var childrenUnder4Payment = '£3.10 every week for each of your children between the ages of 1 and 4 years old.';
  
    if (nationalinsurancenumber === 'QQ123456C') {
      notifyClient.sendEmail('f2653d20-a1d6-46be-978e-a6234cb6b674', emailAddress, { personalisation: { 'refNo': refNo, 'firstName': firstName, 'paymentAmount': paymentAmount, 'childrenUnder4Payment': childrenUnder4Payment } } );
      res.redirect('/v3/apply/confirmation-successful')
    }
    else if (nationalinsurancenumber === 'QQ123456D') {
      res.redirect('/v3/apply/confirmation-no-match')
    }
    else {
      res.redirect('/v3/apply/declaration')
    }
  
  })

// What is your national insurance number?

router.post('/v3/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'QQ123456D') {
      res.redirect('/v3/apply/name')
    }
    else if (nationalinsurancenumber === '') {
      res.redirect('/v3/apply/national-insurance-number')
    }
    else {
      res.redirect('/v3/apply/kickouts/not-eligible-national-insurance-number')
    }
  
  })
  
  // What is your name?
  
  router.post('/v3/name', function (req, res) {
  
    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/v3/apply/date-of-birth')
    }
    else {
      res.redirect('/v3/apply/name')
    }
  
  })
  
  // Date of birth
  
  router.post('/v3/date-of-birth', function (req, res) {
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
  
    var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var ageDate =  new Date(today - dob.getTime())
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    req.session.data.yrs = yrs;
  
    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v3/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v3/apply/date-of-birth')
    }
  
  })
  
  // Are you pregnant?
  
  router.post('/v3/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v3/apply/children-under-four')
    }
    else if (pregnant === "no") {
      res.redirect('/v3/apply/children-under-four')
    }
    else {
      res.redirect('/v3/apply/are-you-pregnant')
    }
  
  })
  
  // Do you have any children under the age of 4?
  
  router.post('/v3/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/v3/apply/kickouts/not-eligible-children-under-four')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v3/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v3/apply/due-date')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v3/apply/kickouts/not-eligible')
    } else {
      res.redirect('/v3/apply/children-under-four')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v3/due-date', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
  
    var duedateday = req.session.data['duedateday']
    var duedatemonth = req.session.data['duedatemonth']
    var duedateyear = req.session.data['duedateyear']
  
    var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);
    req.session.data['duedate'] = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(duedate))
  
    var today = moment();
  
    var fulltermpregnancy = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks
    
    if (duedateday && duedatemonth && duedateyear) {
  
      if (duedate < today) {
        res.redirect('/v3/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v3/apply/due-date')
      } else if (childrenunderfour === "yes") {
        res.redirect('/v3/apply/childs-first-name')
      } else if (childrenunderfour === "no") {
        res.redirect('/v3/apply/bank-details')
      } else {
        res.redirect('/v3/apply/due-date')
      }
        
    }
    else {
      res.redirect('/v3/apply/due-date')
    }
  
  })
  
  // Do you have any children under the age of 4? > Childs first name
  
  router.post('/v3/childs-first-name', function (req, res) {
  
    var childsfirstname = req.session.data['childsfirstname']
  
    if (childsfirstname) {
      res.redirect('/v3/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/v3/apply/childs-first-name')
    }
  
  })
  
  // Do you have any children under the age of 4? > Childs date of birth
  
  router.post('/v3/childs-date-of-birth', function (req, res) {
  
    var childsdateofbirthday = req.session.data['childsdateofbirthday']
    var childsdateofbirthmonth = req.session.data['childsdateofbirthmonth']
    var childsdateofbirthyear = req.session.data['childsdateofbirthyear']
  
    var childsdateofbirth = moment(childsdateofbirthyear + '-' + childsdateofbirthmonth + '-' + childsdateofbirthday);
    var childsdateofbirthDisplay = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(childsdateofbirth))
  
    var fouryearsfromtoday = moment().subtract(4, 'years');
  
  
    if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {
  
      if (childsdateofbirth > fouryearsfromtoday) {
  
          if (childsdateofbirth < moment()) {
            
            var childList = req.session.data.childList
            
            // If no array exists, create one called 'childList'. If one already exists, do nothing.
            
            childList = ( typeof childList != 'undefined' && childList instanceof Array ) ? childList : []
            
            // Create a variable of the posted information
            
            var childsfirstname = req.session.data['childsfirstname']
            
            // Add the posted information into the 'childList' array
            
            childList.push({"Name": childsfirstname, "DOB": childsdateofbirthDisplay});
            
            req.session.data.childList = childList;
            
            console.log(childList)
            
            console.log('Number of children:', childList.length)
            
            // Redirect to the 'Do you get another?' page
            
            res.redirect('/v3/apply/children-under-four-answers');          
  
  
  
          } else {
            res.redirect('/v3/apply/childs-date-of-birth')
          }
  
      } else {
        res.redirect('/v3/apply/childs-date-of-birth-older-than-four')
      }
      
    }
    else {
      res.redirect('/v3/apply/childs-date-of-birth')
    }
  
  })
  
  // Do you have any children under the age of 4? > Do you have another child under four?
  
  router.post('/v3/children-under-four-answers', function (req, res) {
  
    var childrenunderfouranswers = req.session.data['childrenunderfouranswers']
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
    var pregnant = req.session.data['pregnant']
    var childrenunderfour = req.session.data['childrenunderfour']
    var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var ageDate =  new Date(today - dob.getTime())
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    if (childrenunderfouranswers === "yes") {
      res.redirect('/v3/apply/childs-first-name')
    }
    else if (childrenunderfouranswers === "no" && pregnant === "yes" && yrs >= 18 && yrs <20) {
      res.redirect('/v3/apply/full-time-education')
    }
    else if (childrenunderfouranswers === "no" && pregnant === "yes" && yrs < 18) {
      res.redirect('/v3/apply/address')
    }
    else if (childrenunderfouranswers === "no" && pregnant === "yes" && yrs >= 20) {
      res.redirect('/v3/apply/address')
    }
    else if (childrenunderfouranswers === "no" && childrenunderfour === "yes" && yrs >= 18 && yrs <20) {
      res.redirect('/v3/apply/full-time-education')
    }
    else if (childrenunderfouranswers === "no" && childrenunderfour === "yes" && yrs < 18) {
      res.redirect('/v3/apply/address')
    }
    else if (childrenunderfouranswers === "no" && childrenunderfour === "yes" && yrs >= 20) {
      res.redirect('/v3/apply/address')
    }
    else {
      res.redirect('/v3/apply/children-under-four-answers')
    }
  
  })
  
  // Remove child
  
  router.post('/v3/remove-child', function (req, res) {
  
    var removeChild = req.session.data['removechild']
  
    if (removeChild === "yes") {
  
      var childList = req.session.data.childList
      childList.pop()
      console.log('Number of children:', childList.length)
  
      res.redirect('/v3/apply/children-under-four-answers')
    }
    else if (removeChild === "no") {
      res.redirect('/v3/apply/children-under-four-answers')
    }
    else {
      res.redirect('/v1/apply/remove-child')
    }
  
  })
  
  // What is your address?
  
  router.post('/v3/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode']
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/v3/apply/email-address')
    } else {
      res.redirect('/v3/apply/address')
    }
  
  })
  
  // What is your email address?
  
  router.post('/v3/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/v3/apply/bank-details')
  
  })
  
  // Bank Details
  
  router.post('/v3/bank-details', function (req, res) {
  
    var accountName = req.session.data['accountname']
    var sortCode = req.session.data['sortcode']
    var accountNumber = req.session.data['accountnumber']
  
    if (accountName && sortCode && accountNumber){
      res.redirect('/v3/apply/check-your-answers')    
    }
    else {
      res.redirect('/v3/apply/bank-details')
    }
  
  })
  
  // Check your answers
  
  router.post('/v3/check-your-answers', function (req, res) {
    res.redirect('/v3/apply/declaration')
  })
  
  // Feedback
  
  router.post('/v3/feedback', function (req, res) {
    res.redirect('/v3/feedback')
  })

module.exports = router;