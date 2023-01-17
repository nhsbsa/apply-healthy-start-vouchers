// ********************************
// APPLY (Current)
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

// Do you live in England, Wales or Northern Ireland?


router.post('/current/where-do-you-live', function (req, res) {

  const whereDoYouLive = req.session.data['where-do-you-live']

  if (whereDoYouLive == 'yes') {
    res.redirect('/current/apply/name');
  } else {
    res.redirect('/current/apply/kickouts/not-eligible-country');
  }

})

// What is your name?

router.post('/current/name', function (req, res) {

    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/current/apply/address')
    }
    else {
      res.redirect('/current/apply/name')
    }
  
  })
  
  // What is your address?
  
  router.post('/current/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/current/apply/date-of-birth')
    } else {
      res.redirect('/current/apply/address')
    }
  
  })
  
  // Date of birth
  
  router.post('/current/date-of-birth', function (req, res) {
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
  
    var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
    var dateofbirth = moment(dob).format('MM/DD/YYYY');
  req.session.data['dateofbirth'] = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(dateofbirth))
  
    var dobYrs = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var ageDate =  new Date(today - dobYrs.getTime())
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    var firstname = req.session.data['firstname'].trim().toUpperCase()
    var lastname = req.session.data['lastname'].trim().toUpperCase()
    var addressline1 = req.session.data['addressline1'].trim().toUpperCase()
    var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
    var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
  
    const addressRegex = RegExp('^[0-9]+$'); 
  
    if (addressRegex.test(addressline1) === true) {
  
      var addressline1 = [addressline1,addressline2].join(" ").toUpperCase();
  
    }
  
    if (yrs < 16) {
  
      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
        res.redirect('/current/apply/kickouts/confirmation-under-16')
      }
      else {
        res.redirect('/current/apply/date-of-birth')
      }    
  
    }
    else {
  
      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
        res.redirect('/current/apply/national-insurance-number')
      }
      else {
        res.redirect('/current/apply/date-of-birth')
      }    
  
    }
  
  
  })
  
  // What is your national insurance number?
  
  router.post('/current/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/current/apply/check-your-answers-personal-details')
    } else {
      res.redirect('/current/apply/national-insurance-number')
    }

  })

    // Check your answers - personal details

    router.post('/current/cya-personal-details', (req, res) => {

      var dateofbirthday = req.session.data['dateofbirthday']
      var dateofbirthmonth = req.session.data['dateofbirthmonth']
      var dateofbirthyear = req.session.data['dateofbirthyear']
    
      var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
      var dateofbirth = moment(dob).format('MM/DD/YYYY');
    req.session.data['dateofbirth'] = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(dateofbirth))
  
      var dobYrs = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
      var ageDate = new Date(today - dobYrs.getTime())
      var temp = ageDate.getFullYear();
      var yrs = Math.abs(temp - 1970);
  
      var firstname = req.session.data['firstname'].trim().toUpperCase()
      var lastname = req.session.data['lastname'].trim().toUpperCase()
      req.session.fullName = firstname + ' ' + lastname
      var addressline1 = req.session.data['addressline1'].trim().toUpperCase()
      var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
      var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
      var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
      if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
        res.redirect('/current/apply/are-you-pregnant')
      }
      else {
        res.redirect('/current/apply/kickouts/confirmation-no-match')
      }
      
    })
  
  // Are you pregnant?
  
  router.post('/current/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/current/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/current/apply/children-under-four')
    }
    else {
      res.redirect('/current/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/current/due-date', function (req, res) {
  
    var duedateday = req.session.data['duedateday']
    var duedatemonth = req.session.data['duedatemonth']
    var duedateyear = req.session.data['duedateyear']
  
    var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);
    req.session.data['duedate'] = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(duedate))
  
    var today = moment();
  
    var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
    var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks
  
    
    if (duedateday && duedatemonth && duedateyear) {
  
      if (duedate < today) {
        res.redirect('/current/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/current/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/current/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/current/apply/due-date')
    }
  
  })
  // Do you have any children under the age of 4?
  
  router.post('/current/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/current/apply/email-address')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/current/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/current/apply/childs-first-name')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/current/apply/kickouts/not-eligible')
    } else {
      res.redirect('/current/apply/children-under-four')
    }
  
  })
  // Do you have any children under the age of 4? > Childs first name
  
  router.post('/current/childs-first-name', function (req, res) {
  
    var childsfirstname = req.session.data['childsfirstname']
    var childslastname = req.session.data['childslastname']

    if (childsfirstname && childslastname) {
      res.redirect('/current/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/current/apply/childs-first-name')
    }

  })
     

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/current/childs-date-of-birth', function (req, res) {

      var childsdateofbirthday = req.session.data['childsdateofbirthday']
      var childsdateofbirthmonth = req.session.data['childsdateofbirthmonth']
      var childsdateofbirthyear = req.session.data['childsdateofbirthyear']

      var childsdateofbirth = moment(childsdateofbirthday + '-' + childsdateofbirthmonth + '-' + childsdateofbirthyear, 'DD-MM-YYYY').format('YYYY-MM-DD');
      var childsdateofbirthDisplay = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(childsdateofbirth))

      var today = moment().format('YYYY-MM-DD');
      var fouryearsfromtoday = moment().subtract(4, 'years').format('YYYY-MM-DD');

      console.log('Childs DOB: '+ childsdateofbirth);
      console.log('Today: '+ today);
      console.log('Four years from today: '+ fouryearsfromtoday);

      if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {

        if (moment(childsdateofbirth).isBefore(today)) {

            if (moment(childsdateofbirth).isAfter(fouryearsfromtoday)) {

              var childList = req.session.data.childList
              
              // If no array exists, create one called 'childList'. If one already exists, do nothing.
              
              childList = ( typeof childList != 'undefined' && childList instanceof Array ) ? childList : []
              
              // Create a variable of the posted information
              
              var childsfirstname = req.session.data['childsfirstname']
              var childslastname = req.session.data['childslastname']
              
              // Add the posted information into the 'childList' array
              
              childList.push({"ChildsFirstName": childsfirstname, "ChildsLastName": childslastname, "ChildsDOB": childsdateofbirthDisplay});
              
              req.session.data.childList = childList;
              
              console.log(childList)
              
              console.log('Number of children:', childList.length)
              
              // Redirect to the 'Do you get another?' page
              
              res.redirect('/current/apply/children-under-four-answers');          



            } else {
              res.redirect('/current/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/current/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/current/apply/childs-date-of-birth')
      }


    })
    // Do you have any children under the age of 4? > Do you have another child under four?
  
    router.post('/current/children-under-four-answers', function (req, res) {
  
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

      var lastname = req.session.data['lastname'].trim().toUpperCase()

      if (childrenunderfouranswers === "yes") {
        res.redirect('/current/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no") {
        res.redirect('/current/apply/email-address')
      }
      else {
        res.redirect('/current/apply/children-under-four-answers')
      }

    })

  
  
  // What is your email address?
  
  router.post('/current/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/current/apply/mobile-phone-number')
  
  })
  
  // What is your mobile phone number?
  
  router.post('/current/mobile-phone-number', function (req, res) {
  
    var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
    res.redirect('/current/apply/check-your-answers')
  
  })
  
  // Feedback
  
  router.post('/current/feedback', function (req, res) {
    res.redirect('/current/feedback')
  })


// Current Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/current/check-your-answers', function (req, res) {
  res.redirect('/current/apply/confirmation-successful');
})
  
module.exports = router;