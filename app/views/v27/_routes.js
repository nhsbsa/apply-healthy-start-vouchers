// ********************************
// APPLY - NHS LOGIN (v27)
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







// Which service would you like to use?


router.post('/v27/which-service', function (req, res) {

  var whichservice = req.session.data['whichservice']; 

  if (whichservice === "new-application") {
    res.redirect('/v27/where-do-you-live')
  }
    if (whichservice === "card-issue") {
      res.redirect('/v27/apply/kickouts/card-issue')
    }
    if (whichservice === "update-my-details") {
      res.redirect('/v25/before-you-start-manage')
    }

    })




    // Where do you live?

    router.post('/v27/where-do-you-live', function (req, res) {

      
    var location = req.session.data['location']

    if (location === "england or wales") {
      res.redirect('/v27/before-you-start')
    }
    if (location === "northern ireland") {
      res.redirect('/v27/before-you-start-ni')
    }
    if (location === "somewhere else") {
      res.redirect('/v27/apply/kickouts/not-eligible-country')
    }

    })






  // You did not agree to share your NHS login information

  router.post('/v27/nhs-login/no-consent', function (req, res) {

    var consent = req.session.data['consent'];


    if (consent === "agree") {
      res.redirect('/v27/nhs-login/consent')
    }
    if (consent === "disagree") {
      res.redirect('/v27/nhs-login/email-address')
    }
  })





  // What is your NHS Number?
  

 
router.post('/v27/nhs-login/nhs-number', function (req, res) {


  var nhsnumber = req.session.data['nhsnumber']
  var checkbox = req.session.data['checkbox']


  if (nhsnumber) { 
    res.redirect('/v27/nhs-login/date-of-birth') 
  } 
  
  else if (checkbox === "donotknow") { 
    res.redirect('/v27/nhs-login/name')  
  } 

})






// What is your name?

router.post('/v27/name', function (req, res) {

    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/v27/apply/postcode')
    }
    else {
      res.redirect('/v27/apply/name')
    }
  
  })
  
  



  // What is your postcode?
  
  router.post('/v27/postcode', function (req, res) {

    res.redirect('/v27/apply/address-2');
  
  })








  // APPLY (NI) - What is your address 2? (== Select your address)

  router.post('/v27/apply/address-2', function (req, res) {

    res.redirect('/v27/apply/date-of-birth');
  
  })




  // APPLY (NI) - What is your address? (== Enter address manually, == My address is not listed)
  
  router.post('/v27/address', function (req, res) {

    res.redirect('/v27/apply/date-of-birth');
  
  })


  

  // NHS Login - What is your address 2? (== Select your address)

  router.post('/v27/nhs-login/select-address', function (req, res) {

    res.redirect('/v27/apply/check-your-answers-nhs-login');
  
  })




  // Check your answers (== after NHS Login)

  router.post('/v27/apply/cya-nhs-login', function (req, res) {

    var information = req.session.data['information']
    
    
    if (information === "yes") {
      res.redirect('/v27/apply/national-insurance-number-nhs-login');
    }
    else if (information === "no") {
      res.redirect('/v27/apply/kickouts/contact-your-gp')
    }
    else {
      res.redirect('/v27/apply/cya-nhs-login')
    }

  })

    
   




  // What is your National Insurance number? (== after NHS Login)


  router.post('/v27/national-insurance-number-nhs-login', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/v27/apply/are-you-pregnant')
    } else {
      res.redirect('/v27/apply/national-insurance-number-nhs-login')
    }

  })









  
    // Date of birth
    
  router.post('/v27/date-of-birth', function (req, res) {
  
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
    req.session.applicantAge = yrs
  
    // Checking the actual age of the beneficiary 
    var ageInMilliseconds = new Date() - new Date(dateofbirth);
    var actualAge = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years
  
    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      if (yrs < 16) {
        res.redirect('/v27/apply/kickouts/confirmation-under-16')
      } else {
        res.redirect('/v27/apply/national-insurance-number');
      }
    } else {
      res.redirect('/v27/apply/date-of-birth')
    }
  
  
  })



  
  // What is your national insurance number?
  
  router.post('/v27/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/v27/apply/check-your-answers-personal-details')
    } else {
      res.redirect('/v27/apply/national-insurance-number')
    }

  })




  // Check your answers - personal details

  
      router.post('/v27/cya-personal-details', (req, res) => {
  
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
    

        //I added ' || ""' before .trim to prevent the .trim() error. This provides default values for undefined session data. (BY CHAE, 20 FEB 2025)
        var firstname = req.session.data['firstname'] || "".trim().toUpperCase()
        var lastname = req.session.data['lastname'] || "".trim().toUpperCase()
        req.session.fullName = firstname + ' ' + lastname
        var addressline1 = req.session.data['addressline1'] || "".trim().toUpperCase()
        //var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
        var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
        var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
    
        if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '15 PALM ROAD') {
          res.redirect('/current/apply/are-you-pregnant')
        }
        else {
          res.redirect('/v27/apply/are-you-pregnant')
        }
        
      })







  // Are you pregnant?
  
  router.post('/v27/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v27/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/v27/apply/children-under-four')
    }
    else {
      res.redirect('/v27/apply/are-you-pregnant')
    }
  
  })
  






  // Are you pregnant? > Due Date == Wwhat is your due date?
  
  router.post('/v27/due-date', function (req, res) {
  
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
        res.redirect('/v27/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v27/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v27/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/v27/apply/due-date')
    }
  
  })






  // Do you have any children under the age of 4?
  
  router.post('/v27/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/v27/apply/email-address')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v27/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v27/apply/childs-first-name')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v27/apply/kickouts/not-pregnant-no-children')
    } else {
      res.redirect('/v27/apply/children-under-four')
    }
  
  })




  // Do you have any children under the age of 4? > Childs first name
  
  router.post('/v27/childs-first-name', function (req, res) {
  
    var childsfirstname = req.session.data['childsfirstname']
    var childslastname = req.session.data['childslastname']

    if (childsfirstname && childslastname) {
      res.redirect('/v27/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/v27/apply/childs-first-name')
    }

  })





     

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v27/childs-date-of-birth', function (req, res) {

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
              
              res.redirect('/v27/apply/children-under-four-answers');          



            } else {
              res.redirect('/v27/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v27/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v27/apply/childs-date-of-birth')
      }


    })






    // Do you have any children under the age of 4? > Do you have any other children under 4 yearsa old? == Children under 4 years old that you have told us about
  
    router.post('/v27/children-under-four-answers', function (req, res) {
  
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

      //I added ' || ""' before .trim to prevent the .trim() error. This provides default values for undefined session data. (BY CHAE, 20 FEB 2025)
      var lastname = req.session.data['lastname'] || "".trim().toUpperCase()

      if (childrenunderfouranswers === "yes") {
        res.redirect('/v27/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no") {
        res.redirect('/v27/apply/email-address')
      }
      else {
        res.redirect('/v27/apply/children-under-four-answers')
      }

    })

  
  
  // What is your email address?
  
  router.post('/v27/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/v27/apply/mobile-phone-number')
  
  })
  
  // What is your mobile phone number?
  
  router.post('/v27/mobile-phone-number', function (req, res) {
  
    var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
    res.redirect('/v27/apply/check-your-answers')
  
  })
  





  // Feedback
  
  router.post('/current/feedback', function (req, res) {
    res.redirect('/current/feedback')
  })


// Current Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v27/check-your-answers', function (req, res) {
  res.redirect('/v27/apply/confirmation-successful');
})
  
module.exports = router;