// ********************************
// USER ACCOUNT (v1)
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



// Add body parsing just for this router
router.use(express.urlencoded({ extended: true })); 



// ********************************




// Where do you live?

    router.post('/account/v1/where-do-you-live', function (req, res) {

      
    var location = req.session.data['location']

    if (location === "england") {
      res.redirect('/account/v1/before-you-start')
    }
    if (location === "wales") {
    res.redirect('/account/v1/before-you-start-ni')
    }
    if (location === "northern ireland") {
      res.redirect('/account/v1/before-you-start-ni')
    }
    if (location === "somewhere else") {
      res.redirect('/account/v1/apply/kickouts/not-eligible-country')
    }

    })



// Before you start

router.post('/account/v1/before-you-start', function (req, res) {

res.redirect('/account/v1/nhs-login/email-address');

  })


// Enter your email address

router.post('/account/v1/nhs-login/email-address', (req, res) => {
  const { emailAddress } = req.body;
  req.session.emailAddress = emailAddress;
  console.log('Saved email to session:', req.session.emailAddress);
  res.redirect('/account/v1/nhs-login/password');
});


// Enter your password


router.post('/account/v1/nhs-login/password', (req, res) => {
  res.redirect('/account/v1/nhs-login/security-code');
});


// Enter the security code

// router.post('/account/v1/nhs-login/security-code', (req, res) => {
//   const emailAddress = (req.session.emailAddress || '').trim().toLowerCase();
//   console.log('Session email is:', emailAddress);


//   if (emailAddress === 'rileyjones1999@gmail.com') {
//     res.redirect('/account/v1/nhs-login/consent');
//   } else {
//     res.redirect('/account/v1/nhs-login/nhs-number');
//   }
// });






// Authorise

router.post('/account/v1/nhs-login/security-code', (req, res) => {
  const emailAddress = (req.session.emailAddress || '').trim().toLowerCase();
  console.log('Session email is:', emailAddress);


  if (emailAddress === 'rileyjones1999@gmail.com') {
    res.redirect('/account/v1/nhs-login/authorise');
  } else {
    res.redirect('/account/v1/nhs-login/nhs-number');
  }
});


// router.post('/account/v1/nhs-login/security-code', (req, res) => {

// res.redirect('/account/v1/nhs-login/authorise');

//   })







// Do you know your NHS Number?

router.post('/account/v1/nhs-login/nhs-number', (req, res) => {

  const { nhsNumberLogin, nhsNumber_value } = req.body;
  req.session.nhsNumberLogin = nhsNumberLogin;
  req.session.nhsNumber_value = nhsNumber_value;

  console.log('Saved NHS number to session:', req.session.nhsNumberLogin);
  console.log('Saved NHS number value to session:', req.session.nhsNumber_value); 


  if (nhsNumberLogin === "yes") {
    res.redirect('/account/v1/nhs-login/date-of-birth')
  }
  else if (nhsNumberLogin === "no") {
   res.redirect('/account/v1/nhs-login/name')
  }
  else {
    // fallback
    res.redirect('/account/v1/nhs-login/ERROR');
  }

})


// Enter your full name

router.post('/account/v1/nhs-login/name', (req, res) => {
  const { firstName, middleNames, lastName } = req.body;

  // helper: capitalise the first letter only
  const capFirst = (str) => {
    return str 
      ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() 
      : '';
  };

  req.session.firstName = capFirst(firstName);
  req.session.middleNames = capFirst(middleNames);
  req.session.lastName = capFirst(lastName);

  console.log('Saved name details:', req.session.firstName, req.session.middleNames, req.session.lastName);

  res.redirect('/account/v1/nhs-login/date-of-birth');
});




// Enter your date of birth

router.post('/account/v1/nhs-login/date-of-birth', (req, res) => {
  const { dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear } = req.body;

  // 👇 Step 1: log what comes in from the form
  console.log('Received DOB parts:', {
    day: dateOfBirthDay,
    month: dateOfBirthMonth,
    year: dateOfBirthYear
  });

  // Save raw values in case you need them separately
  req.session.dateOfBirthDay = dateOfBirthDay;
  req.session.dateOfBirthMonth = dateOfBirthMonth;
  req.session.dateOfBirthYear = dateOfBirthYear;

  // Combine into a single UK-formatted string
  const dob = moment(
    `${dateOfBirthDay}-${dateOfBirthMonth}-${dateOfBirthYear}`,
    "DD-MM-YYYY"
  );

  // 👇 Step 2: validate + save
  if (!dob.isValid()) {
    console.log('⚠️ DOB is invalid:', dateOfBirthDay, dateOfBirthMonth, dateOfBirthYear);
    req.session.dateOfBirth = 'INVALID DATE';
  } else {
    req.session.dateOfBirth = dob.format("D MMMM YYYY"); // e.g. "15 August 1990"
  }

  console.log('Saved DOB:', req.session.dateOfBirth);

  res.redirect('/account/v1/nhs-login/postcode');
});











// Enter your postcode

router.post('/account/v1/nhs-login/postcode', (req, res) => {
  let { postcode } = req.body;

  // ✅ Format BEFORE saving
  function formatUKPostcode(postcode) {
    if (!postcode) return '';
    const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
    const outward = cleaned.slice(0, cleaned.length - 3);
    const inward = cleaned.slice(-3);
    return `${outward} ${inward}`;
  }

  const formattedPostcode = formatUKPostcode(postcode);

  // ✅ Save formatted version to session
  req.session.postcode = formattedPostcode;

  // ✅ Log to confirm
  console.log('Saved formatted postcode:', req.session.postcode);

  // ✅ Redirect AFTER saving
  res.redirect('/account/v1/nhs-login/check-your-details');

});




// Check your details


router.get('/account/v1/nhs-login/check-your-details', (req, res) => {
  console.log('Rendering check-your-details with session data:', req.session);
  res.render('/account/v1/nhs-login/check-your-details', {
    data: {
      firstName: req.session.firstName,
      middleNames: req.session.middleNames,
      lastName: req.session.lastName,
      dateOfBirth: req.session.dateOfBirth,
      postcode: req.session.postcode
    }
  });
});




router.post('/account/v1/nhs-login/check-your-details', (req, res) => {
  res.redirect('/account/v1/nhs-login/consent');
});




// Agree to share your NHS login information

router.post('/account/v1/nhs-login/consent', (req, res) => {
  const emailAddress = (req.session.emailAddress || '').trim().toLowerCase();
  console.log('Session email is:', emailAddress);


  if (emailAddress === 'rileyjones1999@gmail.com') {
    res.redirect('/account/v1/account-dashboard');
  } else {
    res.redirect('/account/v1/apply/apply-for-healthy-start');
  }
});






// You did not agree to share your NHS login information


router.post('/account/v1/nhs-login/not-agree-to-share', (req, res) => {


    var consent = req.session.data['consent']

    if (consent === "agree") {
      res.redirect('/account/v1/nhs-login/consent')
    }
    else if (consent === "disagree") {
      res.redirect('/account/v1/apply/kickouts/no-consent')
    }

})



//Do you want to apply for Healthy Start?

router.post('/account/v1/apply/apply-for-healthy-start', (req, res) => {

const application = req.body.application;

    if (application === "yes") {
        res.redirect('/account/v1/apply/confirm-your-details');
    } else {
        res.redirect('/account/v1/apply/kickouts/no-active-claim');
    }
});




// You chose not to create a Healthy Start application

// router.post('/account/v1/apply/chose-not-to-create', (req, res) => {

  
//     var consent = req.session.data['consent']

//     if (consent === "agree") {
//       res.redirect('/account/v1/apply/apply-for-healthy-start')
//     }
//     else if (consent === "disagree") {
//       res.redirect('/account/v1/apply/kickouts/no-active-claim')
//     }

// });




// Confirm your details

  router.post('/account/v1/apply/confirm-your-details', (req, res) => {

    var information = req.session.data['information']
    
    if (information === "yes") {
      res.redirect('/account/v1/apply/national-insurance-number');
    }
    else {
      res.redirect('/account/v1/apply/kickouts/contact-your-gp')
    }

  })



  // What is your NINO?


  router.post('/account/v1/apply/national-insurance-number', (req, res) => {

    var nationalInsuranceNumber = req.session.data['nationalInsuranceNumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalInsuranceNumber == 'AB123456C') {
      res.redirect('/account/v1/apply/kickouts/no-api-match-benefit')
    } else {
      res.redirect('/account/v1/apply/are-you-pregnant')
    }

  })



// Are you pregnant?


  router.post('/account/v1/apply/are-you-pregnant', (req, res) => {

    var pregnant = req.session.data['pregnant']
    
    if (pregnant === "yes") {
      res.redirect('/account/v1/apply/due-date');
    }
    else {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/account/v1/apply/children-under-four')
    }

  })

  // Are you pregnant? > Due Date == What is your due date?
  
  router.post('/account/v1/apply/due-date', function (req, res) {
  
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
        res.redirect('/account//v1/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/account/v1/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/account/v1/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/account/v1/apply/due-date')
    }
  
  })



  // Do you have a child under 4 years old?


  router.post('/account/v1/apply/children-under-four', (req, res) => {

    var childrenUnderFour = req.session.data['childrenUnderFour']
    var pregnant = req.session.data['pregnant']


    if (pregnant === "yes" && childrenUnderFour === "no") {
      res.redirect('/account/v1/apply/email-address')
    } else if (pregnant === "no" && childrenUnderFour === "yes") {
      res.redirect('/account/v1/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenUnderFour === "yes") {
      res.redirect('/account/v1/apply/childs-first-name')
    } else if (childrenUnderFour === "no" && pregnant ==="no") {
      res.redirect('/account/v1/apply/kickouts/not-pregnant-no-children')
    } else {
      res.redirect('/account/v1/apply/children-under-four')
    }
  

  })


// What is your child’s name?
  router.post('/account/v1/apply/childs-first-name', (req, res) => {
  
    var childsfirstname = req.session.data['childsfirstname']
    var childslastname = req.session.data['childslastname']

    if (childsfirstname && childslastname) {
      res.redirect('/account/v1/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/account/v1/apply/childs-first-name')
    }

  })




// What is child’s date of birth?


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
              
              res.redirect('/account/v1/apply/children-under-four-answers');          



            } else {
              res.redirect('/account/v1/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/account/v1/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/account/v1/apply/childs-date-of-birth')
      }


    })





    // Children under 4 years old that you have told us about


    router.post('/account/v1/apply/children-under-four-answers', function (req, res) {
  
      var childrenunderfouranswers = req.session.data['childrenunderfouranswers']

      var dateofbirthday = req.session.data['dateofbirthday']
      var dateofbirthmonth = req.session.data['dateofbirthmonth']
      var dateofbirthyear = req.session.data['dateofbirthyear']
      var pregnant = req.session.data['pregnant']
      var childrenUnderFour = req.session.data['childrenUnderFour']
      var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
      var ageDate =  new Date(today - dob.getTime())
      var temp = ageDate.getFullYear();
      var yrs = Math.abs(temp - 1970);

      //I added ' || ""' before .trim to prevent the .trim() error. This provides default values for undefined session data. (BY CHAE, 20 FEB 2025)
      var lastname = req.session.data['lastname'] || "".trim().toUpperCase()

      if (childrenunderfouranswers === "yes") {
        res.redirect('/account/v1/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no") {
        res.redirect('/account/v1/apply/email-address')
      }
      else {
        res.redirect('/account/v1/apply/children-under-four-answers')
      }

    })


    


// What is your email address?
 
// GET route to display the email address page with prefilled data
router.get('/account/v1/apply/email-address', function (req, res) {
  res.render('your-email-template', {
    data: {
      emailaddress: req.session.data['emailaddress'] || ''
    }
  });
});

// Your existing POST route
router.post('/account/v1/apply/email-address', function (req, res) {
  var emailaddress = req.session.data['emailaddress']
  res.redirect('/account/v1/apply/mobile-phone-number')
})

  
  // What is your mobile phone number?
  
  router.post('/account/v1/apply/mobile-phone-number', function (req, res) {
  
    var mobilephonenumber = req.session.data['mobilephonenumber']
  
    res.redirect('/account/v1/apply/check-your-answers')
  
  })
  

// Check your answers
// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/account/v1/apply/check-your-answers', function (req, res) {
  res.redirect('/account/v1/apply/confirmation-successful');
})



module.exports = router;