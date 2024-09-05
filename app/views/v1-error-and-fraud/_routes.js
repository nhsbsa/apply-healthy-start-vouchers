// ********************************
// APPLY (v1-error-and-fraud)
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


router.post('/v1-error-and-fraud/where-do-you-live', function (req, res) {

  const whereDoYouLive = req.session.data['where-do-you-live']

  if (whereDoYouLive == 'yes') {
    res.redirect('/v1-error-and-fraud/apply/date-of-birth');
  } else {
    res.redirect('/v1-error-and-fraud/apply/kickouts/not-eligible-country');
  }

});

  // Date of birth

  router.post('/v1-error-and-fraud/date-of-birth', function (req, res) {

    var dateofbirthday = req.session.data['dateofbirthday'];
    var dateofbirthmonth = req.session.data['dateofbirthmonth'];
    var dateofbirthyear = req.session.data['dateofbirthyear'];

    var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
    var dateofbirth = moment(dob).format('MM/DD/YYYY');
    req.session.data['dateofbirth'] = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateofbirth));

    var dobYrs = new Date(dateofbirthyear, dateofbirthmonth - 1, dateofbirthday); // month is 0-indexed
    var ageDate = new Date(Date.now() - dobYrs.getTime());
    var temp = ageDate.getUTCFullYear();
    var yrs = Math.abs(temp - 1970);

    // Provide default values to avoid errors
    var firstname = (req.session.data['firstname'] || '').trim().toUpperCase();
    var lastname = (req.session.data['lastname'] || '').trim().toUpperCase();
    var addressline1 = (req.session.data['addressline1'] || '').trim().toUpperCase();
    var addressline2 = (req.session.data['addressline2'] || '').trim().toUpperCase();
    var postcode = (req.session.data['postcode'] || '').replace(/\s+/g, '').toUpperCase();

    const addressRegex = RegExp('^[0-9]+$');

    if (addressRegex.test(addressline1) === true) {
      addressline1 = [addressline1, addressline2].join(" ").toUpperCase();
    }

    if (yrs < 16) {
      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
        res.redirect('/v1-error-and-fraud/apply/kickouts/confirmation-under-16');
      } else {
        res.redirect('/v1-error-and-fraud/apply/date-of-birth'); // add error screen
      }
    } else {
      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
        res.redirect('/v1-error-and-fraud/apply/nhs');
      } else {
        res.redirect('/v1-error-and-fraud/apply/date-of-birth'); // add error screen
      }
    }
  });

  // Do you know your NHS number? 

  router.post('/v1-error-and-fraud/nhs', function (req, res){
    const nhs = req.session.data['nhs'];

    if (nhs == 'yes') {
      res.redirect('/v1-error-and-fraud/apply/nhs-numb');
    } else {
      res.redirect('/v1-error-and-fraud/apply/name');
    };

  });

  // What is your NHS number? 

  router.post('/v1-error-and-fraud/nhs-numb', function (req, res){

    const nhsNumb = req.session.data['nhs-numb'];

    if (nhsNumb) {
      res.redirect('/v1-error-and-fraud/apply/national-insurance-number');
    } else {
      res.redirect('/v1-error-and-fraud/apply/error'); // add error state
    };
  });


  // What is your name?

  router.post('/v1-error-and-fraud/name', function (req, res) {

      var firstname = req.session.data['firstname']
      var lastname = req.session.data['lastname']
    
      if (firstname && lastname) {
        res.redirect('/v1-error-and-fraud/apply/postcode')
      }
      else {
        res.redirect('/v1-error-and-fraud/apply/name')   // add error state
      }
    
    });

    
    // What is your postcode?
    
    router.post('/v1-error-and-fraud/postcode', function (req, res) {
    
      delete req.session.data['selectaddress']
    
      var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
    
      if (postcode) {
        res.redirect('/v1-error-and-fraud/apply/national-insurance-number')
      } else {
        res.redirect('/v1-error-and-fraud/apply/postcode-error') //error state
      }
    
    });
    

  
  // What is your national insurance number?
  
  router.post('/v1-error-and-fraud/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/v1-error-and-fraud/apply/check-your-answers-personal-details')
    } else {
      res.redirect('/v1-error-and-fraud/apply/national-insurance-number-error') // error state
    }

  });



    // Check your answers - personal details

    router.post('/v1-error-and-fraud/cya-personal-details', (req, res) => {
      res.redirect('/v1-error-and-fraud/apply/get-your-security-code');
    });


    // is your mobile number correct? 

    router.post('/v1-error-and-fraud/get-your-security-code', function (req, res) {

      var getyoursecuritycode = req.session.data['getyoursecuritycode']

      if (getyoursecuritycode === "yes") {
        res.redirect('/v1-error-and-fraud/apply/security-code-text-message')
      }
      else if (getyoursecuritycode === "no") {
        res.redirect('/v1-error-and-fraud/apply/kickouts/changed-phone-number') 
      }   

    });

    // Check your phone

    router.post('/v1-error-and-fraud/security-code-text-message', function (req, res) {

      var securitycodetextmessage = req.session.data['securitycodetextmessage']

      if (securitycodetextmessage) {
        res.redirect('/v1-error-and-fraud/apply/partner')
      }
      else if (securitycodetextmessage) {
        res.redirect('/v1-error-and-fraud/apply/kickouts/changed-phone-number')
      }   

    });

    // Do you live with a partner?

    router.post('/v1-error-and-fraud/partner', function (req, res) {

      var partner = req.session.data['partner']

      if (partner == 'yes') {
        res.redirect('/v1-error-and-fraud/apply/partner-name')
      }
      else {
        res.redirect('/v1-error-and-fraud/apply/are-you-pregnant')
      }   

    });

    // What is your partner name?

    router.post('/v1-error-and-fraud/name-partner', function (req, res) {

      var firstname = req.session.data['firstname-partner']
      var lastname = req.session.data['lastname-partner']
    
      if (firstname && lastname) {
        res.redirect('/v1-error-and-fraud/apply/partner-date-of-birth')
      }
      else {
        res.redirect('/v1-error-and-fraud/apply/partner-name')   // add error state
      }
    
    });


    // What is your partner date of birth?

    router.post('/v1-error-and-fraud/date-of-birth-partner', function (req, res) {

      var dateofbirthday = req.session.data['dateofbirthday'];
      var dateofbirthmonth = req.session.data['dateofbirthmonth'];
      var dateofbirthyear = req.session.data['dateofbirthyear'];
  
      var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
      var dateofbirth = moment(dob).format('MM/DD/YYYY');
      req.session.data['dateofbirth-partner'] = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateofbirth));
  
      var dobYrs = new Date(dateofbirthyear, dateofbirthmonth - 1, dateofbirthday); // month is 0-indexed
      var ageDate = new Date(Date.now() - dobYrs.getTime());
      var temp = ageDate.getUTCFullYear();
      var yrs = Math.abs(temp - 1970);
  
      // Provide default values to avoid errors
      var firstname = (req.session.data['firstname'] || '').trim().toUpperCase();
      var lastname = (req.session.data['lastname'] || '').trim().toUpperCase();
      var addressline1 = (req.session.data['addressline1'] || '').trim().toUpperCase();
      var addressline2 = (req.session.data['addressline2'] || '').trim().toUpperCase();
      var postcode = (req.session.data['postcode'] || '').replace(/\s+/g, '').toUpperCase();
  
      const addressRegex = RegExp('^[0-9]+$');
  
      if (addressRegex.test(addressline1) === true) {
        addressline1 = [addressline1, addressline2].join(" ").toUpperCase();
      }

      if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
        res.redirect('/v1-error-and-fraud/apply/partner-national-insurance-number');
      } else {
        res.redirect('/v1-error-and-fraud/apply/partner-date-of-birth'); // add error screen
      }
  
    });



    // What is your partner national insurance number?

    router.post('/v1-error-and-fraud/national-insurance-number-partner', function (req, res) {

      var nationalinsurancenumberPartner = req.session.data['nationalinsurancenumberpartner'].toUpperCase().replace(/\s+/g, '');
    
      if (nationalinsurancenumberPartner) {
        res.redirect('/v1-error-and-fraud/apply/are-you-pregnant')
      } else {
        res.redirect('/v1-error-and-fraud/apply/national-insurance-number-error') // error state
      }
  
    });




  
  // Are you pregnant?
  
  router.post('/v1-error-and-fraud/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant'];
    var partner = req.session.data['firstname-partner'];
  
    if (pregnant === "yes" && partner) {
      res.redirect('/v1-error-and-fraud/apply/who-is-pregnant')
    }
    else if (pregnant === "yes" && !partner) {
      res.redirect('/v1-error-and-fraud/apply/due-date')
    }
    else {
      res.redirect('/v1-error-and-fraud/apply/children-under-four')
    }
  
  });

  // Who is pregnant? 

  router.post('/v1-error-and-fraud/who-is-pregnant', function (req, res) {
  
    res.redirect('/v1-error-and-fraud/apply/due-date')

  });
  

  // What is the Due Date?
  
  router.post('/v1-error-and-fraud/due-date', function (req, res) {
  
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
        res.redirect('/v1-error-and-fraud/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v1-error-and-fraud/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v1-error-and-fraud/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/v1-error-and-fraud/apply/due-date')
    }
  
  });

  // Do you have any children under the age of 4?
  
  router.post('/v1-error-and-fraud/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/v1-error-and-fraud/apply/check-your-answers')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v1-error-and-fraud/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v1-error-and-fraud/apply/childs-first-name')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v1-error-and-fraud/apply/kickouts/not-eligible')
    } else {
      res.redirect('/v1-error-and-fraud/apply/children-under-four') // error state
    }
  
  });

  // What is your child's first name
  router.post('/v1-error-and-fraud/childs-first-name', function (req, res) {
    var childsfirstname = req.session.data['childsfirstname'];
    var childslastname = req.session.data['childslastname'];

    if (childsfirstname && childslastname) {
      res.redirect('/v1-error-and-fraud/apply/childs-date-of-birth');
    } else {
      res.redirect('/v1-error-and-fraud/apply/childs-first-name'); // error state
    }
  });

  // What is the child's date of birth?
  router.post('/v1-error-and-fraud/childs-date-of-birth', function (req, res) {
    var childsdateofbirthday = req.session.data['childsdateofbirthday'];
    var childsdateofbirthmonth = req.session.data['childsdateofbirthmonth'];
    var childsdateofbirthyear = req.session.data['childsdateofbirthyear'];

    var childsdateofbirth = moment(childsdateofbirthday + '-' + childsdateofbirthmonth + '-' + childsdateofbirthyear, 'DD-MM-YYYY').format('YYYY-MM-DD');
    var childsdateofbirthDisplay = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(childsdateofbirth));

    var today = moment().format('YYYY-MM-DD');
    var fouryearsfromtoday = moment().subtract(4, 'years').format('YYYY-MM-DD');

    if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {
      if (moment(childsdateofbirth).isBefore(today) && moment(childsdateofbirth).isAfter(fouryearsfromtoday)) {

        // Retrieve or initialize the childList array
        var childList = req.session.data.childList || [];

        // Retrieve the child's first and last name
        var childsfirstname = req.session.data['childsfirstname'];
        var childslastname = req.session.data['childslastname'];

        // Add the child's name and date of birth to the childList array
        childList.push({
          "ChildsFirstName": childsfirstname,
          "ChildsLastName": childslastname,
          "ChildsDOB": childsdateofbirthDisplay,
          "ChildsNhsNumb": null // Placeholder for the NHS number (if they provide it later)
        });

        // Save the updated childList back to the session
        req.session.data.childList = childList;

        // Redirect to the 'Do you know their NHS number?' page
        res.redirect('/v1-error-and-fraud/apply/children-under-four-nhs');

      } else {
        // Redirect back if the date of birth is invalid (too young or future date)
        res.redirect('/v1-error-and-fraud/apply/childs-date-of-birth');
      }
    } else {
      // Redirect back if the date of birth is incomplete
      res.redirect('/v1-error-and-fraud/apply/childs-date-of-birth');
    }
  });


  // Do you know the child's NHS number?
  router.post('/v1-error-and-fraud/children-under-four-nhs', function (req, res) {
    var childNhs = req.session.data['child-nhs'];

    if (childNhs === 'yes') {
      res.redirect('/v1-error-and-fraud/apply/child-nhs-numb');
    } else {
      res.redirect('/v1-error-and-fraud/apply/children-under-four-answers');
    }
  });


  // What is your child's NHS number?
  router.post('/v1-error-and-fraud/child-nhs-numb', function (req, res) {
    var childsNhsNumb = req.session.data['child-nhs-numb'];


    if (childsNhsNumb) {
      // Retrieve the childList from the session
      var childList = req.session.data.childList;

      // Find the last child added (this assumes the NHS number is provided for the last child entered)
      if (childList && childList.length > 0) {
        // Update the last child's NHS number
        childList[childList.length - 1].ChildsNhsNumb = childsNhsNumb;

        // Save the updated childList back to the session
        req.session.data.childList = childList;

        res.redirect('/v1-error-and-fraud/apply/children-under-four-answers');
      } else {
        // Handle the case where no children have been added yet (this shouldn't happen normally)
        res.redirect('/v1-error-and-fraud/apply/child-nhs-num');
      }
    } else {
      // Redirect if NHS number is not provided
      res.redirect('/v1-error-and-fraud/apply/child-nhs-num');
    }
  });



    // Do you have another child under four?
  
    router.post('/v1-error-and-fraud/children-under-four-answers', function (req, res) {
  
      var childrenunderfouranswers = req.session.data['childrenunderfouranswers']

      if (childrenunderfouranswers === "yes") {
        res.redirect('/v1-error-and-fraud/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no") {
        res.redirect('/v1-error-and-fraud/apply/email-address')
      }
      else {
        res.redirect('/v1-error-and-fraud/apply/email-address')
      }

    });

    // What is your email address?

    router.post('/v1-error-and-fraud/email-address', function (req, res) {
    
      var emailaddress = req.session.data['emailaddress']
    
      res.redirect('/v1-error-and-fraud/apply/delivery-address')
    
    });


    // Is this the address you would like the Healthy Start card delivered to?

    router.post('/v1-error-and-fraud/delivery-address', function(req, res) {

      var delivery = req.session.data['delivery'];

      if (delivery === 'yes'){
        res.redirect('/v1-error-and-fraud/apply/check-your-answers')
      }
      else{
        res.redirect('/v1-error-and-fraud/apply/new-address')
      }
    });






  
  
//   // What is your email address?
  
//   router.post('/current/email-address', function (req, res) {
  
//     var emailaddress = req.session.data['emailaddress']
  
//     res.redirect('/current/apply/mobile-phone-number')
  
//   })
  
//   // What is your mobile phone number?
  
//   router.post('/current/mobile-phone-number', function (req, res) {
  
//     var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
//     res.redirect('/current/apply/check-your-answers')
  
//   })
  
//   // Feedback
  
//   router.post('/current/feedback', function (req, res) {
//     res.redirect('/current/feedback')
//   })


// // Current Check Your Answers

// // N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

// router.post('/current/check-your-answers', function (req, res) {
//   res.redirect('/current/apply/confirmation-successful');
// })
  
module.exports = router;