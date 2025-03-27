// ********************************
// APPLY (v26-apply-journey)
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


router.post('/v26-apply-journey/where-do-you-live', function (req, res) {

  const whereDoYouLive = req.session.data['where-do-you-live']

  if (whereDoYouLive == 'yes') {
    res.redirect('/v26-apply-journey/apply/name');
  } else {
    res.redirect('/v26-apply-journey/apply/kickouts/not-eligible-country');
  }

})


// What is your name?

router.post('/v26-apply-journey/name', function (req, res) {

    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/v26-apply-journey/apply/postcode')
    }
    else {
      res.redirect('/v26-apply-journey/apply/name')
    }
  
  })
  



  // What is your postcode?
  
  router.post('/v26-apply-journey/apply/postcode', function (req, res) {

    res.redirect('/v26-apply-journey/apply/address-2');
  
  })




  // What is your address 2? (== Select your address)

  function capitalizeWords(str) {
    return str
        .split(' ') // Split string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
        .join(' '); // Join the words back into a single string
}

  
  router.post('/v26-apply-journey/apply/address-2', function (req, res) {

    
    // Get the selected address from the form data
    var selectedAddress = req.body['select-1'];

    // Check if an address was selected
    if (selectedAddress) {
        // Split the selected address into parts (AddressLine1, AddressLine2, Town/City, Postcode)
        var addressParts = selectedAddress.split(',');


    // Assign the address components to variables and capitalize only the first letter of each word
    var addressline1 = addressParts[0] ? capitalizeWords(addressParts[0].trim()) : '';
    var addressline2 = addressParts[1] ? capitalizeWords(addressParts[1].trim()) : '';
    var towncity = addressParts[2] ? addressParts[2].trim().toUpperCase() : ''; // should remain in uppercase
    var postcode = addressParts[3] ? addressParts[3].trim().toUpperCase() : ''; // should remain in uppercase

        // Save the parsed address to session data
        req.session.data['addressline1'] = addressline1;
        req.session.data['addressline2'] = addressline2;
        req.session.data['towncity'] = towncity;
        req.session.data['postcode'] = postcode;
    }

    // Redirect to the next page after processing the address
    res.redirect('/v26-apply-journey/apply/date-of-birth');
});













  
  // Date of birth -Chae-
  
  router.post('/v26-apply-journey/date-of-birth', function (req, res) {


    // Ensure session data exists 
    if (!req.session.data) {
      req.session.data = {};
  }

    // Extract date of birth fields safely
  var dateofbirthday = req.session.data['dateofbirthday'] || '';
  var dateofbirthmonth = req.session.data['dateofbirthmonth'] || '';
  var dateofbirthyear = req.session.data['dateofbirthyear'] || '';

  var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
  var dateofbirth = dob.isValid() ? moment(dob).format('MM/DD/YYYY') : '';

  if (dob.isValid()) {
      req.session.data['dateofbirth'] = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(dob.toDate());
  } else {
      req.session.data['dateofbirth'] = '';
  }

  // Ensure 'today' is defined
  var today = new Date();
  var dobYrs = new Date(dateofbirthyear, dateofbirthmonth - 1, dateofbirthday); 
  var ageDate = new Date(today - dobYrs.getTime());
  var yrs = Math.abs(ageDate.getUTCFullYear() - 1970);

  // Extract and format user details safely
  var firstname = req.session.data['firstname']?.trim().toUpperCase() || '';
  var lastname = req.session.data['lastname']?.trim().toUpperCase() || '';
  var addressline1 = req.session.data['addressline1']?.trim().toUpperCase() || '';
  var addressline2 = req.session.data['addressline2']?.trim().toUpperCase() || '';
  var postcode = req.session.data['postcode']?.replace(/\s+/g, '').toUpperCase() || '';

  // Merge address lines if first line is a number
  const addressRegex = /^[0-9]+$/;
  if (addressRegex.test(addressline1)) {
      addressline1 = [addressline1, addressline2].join(" ").toUpperCase();
  }

  // Redirect based on age
  if (yrs < 16) {
      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
          res.redirect('/v26-apply-journey/apply/kickouts/confirmation-under-16');
      } else {
          res.redirect('/v26-apply-journey/apply/date-of-birth');
      }
  } else {
      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
          res.redirect('/v26-apply-journey/apply/national-insurance-number');
      } else {
          res.redirect('/v26-apply-journey/apply/date-of-birth');
      }
  }
});







  
  // What is your national insurance number?
  
  router.post('/v26-apply-journey/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/v26-apply-journey/apply/check-your-answers-personal-details')
    } else {
      res.redirect('/v26-apply-journey/apply/national-insurance-number')
    }

  })







    // Check your answers - personal details

    router.post('/v26-apply-journey/cya-personal-details', (req, res) => {
    //res.render('/v26-apply-journey/cya-personal-details', { data: req.session.data }); //Ensure Data is Properly Passed (it works without this)


      // Ensure session data exists
    if (!req.session.data) {
      req.session.data = {};
  }


      // Extract and format user input safely
      var firstname = req.session.data['firstname']?.trim().toUpperCase() || '';
      var lastname = req.session.data['lastname']?.trim().toUpperCase() || '';
      req.session.fullName = firstname + ' ' + lastname;


      var addressline1 = req.session.data['addressline1']?.trim().toUpperCase() || '';
      var addressline2 = req.session.data['addressline2']?.trim().toUpperCase() || '';
      var postcode = req.session.data['postcode']?.replace(/\s+/g, '').toUpperCase() || '';
      var nationalinsurancenumber = req.session.data['nationalinsurancenumber']?.toUpperCase().replace(/\s+/g, '') || '';
      
     

      // Ensure date of birth is correctly processed
      var dateofbirthday = req.session.data['dateofbirthday'] || '';
      var dateofbirthmonth = req.session.data['dateofbirthmonth'] || '';
      var dateofbirthyear = req.session.data['dateofbirthyear'] || '';

      var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
      var dateofbirth = dob.isValid() ? moment(dob).format('MM/DD/YYYY') : '';

      if (dob.isValid()) {
          req.session.data['dateofbirth'] = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(dob.toDate());
      }

      
    // Correctly define dobYrs in this route
    var dobYrs = new Date(dateofbirthyear, dateofbirthmonth - 1, dateofbirthday); // Make sure the month is zero-indexed
    var yrs = moment().diff(moment(dobYrs), 'years'); // Calculate age




      // Save address data to session to persist across pages
      req.session.data['addressline1'] = addressline1;
      req.session.data['addressline2'] = addressline2;



      // Before rendering the HTML, log the session data
      console.log("Session Data:", req.session.data);



      if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999') {
        res.redirect('/v26-apply-journey/apply/are-you-pregnant')
      }
      else {
        res.redirect('/v26-apply-journey/apply/kickouts/confirmation-no-match')
      }
      
    })
  



  // Are you pregnant?
  
  router.post('/v26-apply-journey/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v26-apply-journey/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/v26-apply-journey/apply/children-under-four')
    }
    else {
      res.redirect('/v26-apply-journey/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v26-apply-journey/due-date', function (req, res) {
  
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
        res.redirect('/v26-apply-journey/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v26-apply-journey/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v26-apply-journey/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/v26-apply-journey/apply/due-date')
    }
  
  })



  // Do you have any children under the age of 4?
  
  router.post('/v26-apply-journey/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/v26-apply-journey/apply/email-address')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v26-apply-journey/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v26-apply-journey/apply/childs-first-name')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v26-apply-journey/apply/kickouts/not-pregnant-no-children')
    } else {
      res.redirect('/v26-apply-journey/apply/children-under-four')
    }
  
  })



  // Do you have any children under the age of 4? > Childs first name
  
  router.post('/v26-apply-journey/childs-first-name', function (req, res) {
  
    var childsfirstname = req.session.data['childsfirstname']
    var childslastname = req.session.data['childslastname']

    if (childsfirstname && childslastname) {
      res.redirect('/v26-apply-journey/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/v26-apply-journey/apply/childs-first-name')
    }

  })
  



    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v26-apply-journey/childs-date-of-birth', function (req, res) {

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
              
              res.redirect('/v26-apply-journey/apply/children-under-four-answers');          



            } else {
              res.redirect('/v26-apply-journey/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v26-apply-journey/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v26-apply-journey/apply/childs-date-of-birth')
      }


    })




    // Do you have any children under the age of 4? > Do you have another child under four?
  
    router.post('/v26-apply-journey/children-under-four-answers', function (req, res) {
  
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
        res.redirect('/v26-apply-journey/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no") {
        res.redirect('/v26-apply-journey/apply/email-address')
      }
      else {
        res.redirect('/v26-apply-journey/apply/children-under-four-answers')
      }

    })

  
  
  // What is your email address?
  
  router.post('/v26-apply-journey/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/v26-apply-journey/apply/mobile-phone-number')
  
  })
  
  // What is your mobile phone number?
  
  router.post('/v26-apply-journey/mobile-phone-number', function (req, res) {
  
    var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
    res.redirect('/v26-apply-journey/apply/check-your-answers')
  
  })
  
  // Feedback
  
  router.post('/current/feedback', function (req, res) {
    res.redirect('/current/feedback')
  })


// Final Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v26-apply-journey/check-your-answers', function (req, res) {

        // Function to capitalize each word. Adding this because address appears all in cap
        function capitalizeWords(str) {
          return str
              .split(' ') // Split into words
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
              .join(' '); // Join back
        }

        // Store formatted address in session
        req.session.data['addressline1'] = capitalizeWords(req.session.data['addressline1'] || '');
        req.session.data['addressline2'] = capitalizeWords(req.session.data['addressline2'] || '');
        req.session.data['towncity'] = req.session.data['towncity']?.toUpperCase() || ''; // Keep town in uppercase
        req.session.data['postcode'] = req.session.data['postcode']?.replace(/\s+/g, '').toUpperCase() || ''; // Keep postcode uppercase


  res.redirect('/v26-apply-journey/apply/confirmation-successful');
})
  
module.exports = router;