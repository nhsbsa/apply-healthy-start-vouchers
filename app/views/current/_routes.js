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
  
  // Find your address
  
  router.get('/current/find-address', function (req, res) {
  
    var houseNumberName = req.session.data['housenumber']
    var postcode = req.session.data['postcode']
  
    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');
  
    if (regex.test(postcode) === true) {
  
  
  
      if (houseNumberName) {
  
        axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
        .then(response => {
          console.log(response.data.addresses);
          var items = response.data.addresses;
          res.render('current/apply/select-address', {items: items});
        })
        .catch(error => {
          console.log(error);
          res.redirect('/current/apply/no-address-found')
        });
  
      } else {
  
        axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
        .then(response => {
          console.log(response.data.addresses);
          var items = response.data.addresses;
          res.render('current/apply/select-address', {items: items});
        })
        .catch(error => {
          console.log(error);
          res.redirect('/current/apply/no-address-found')
        });
  
      }
      
      
  
  
  
  
    
  
    } else {
      res.redirect('/current/apply/find-address')
    }
  
  })
  
  // Select your address
  
  router.get('/current/select-address', function (req, res) {
  
    var selectaddress = req.session.data['selectaddress']
  
    if (selectaddress === 'none') {
  
      delete req.session.data['addressline1']
      delete req.session.data['addressline2']
      delete req.session.data['towncity']
      delete req.session.data['postcode']
  
      res.redirect('/current/apply/address')
    } else if (selectaddress) {
      res.redirect('/current/apply/date-of-birth')
    } else {
      res.redirect('/current/apply/select-address')
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
  
        if (firstname == 'CHARLIE' && lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD') {
          res.redirect('/current/apply/are-you-pregnant')
        } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
          res.redirect('/current/apply/are-you-pregnant')
        } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
          res.redirect('/current/apply/are-you-pregnant')
        } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
          res.redirect('/current/apply/are-you-pregnant')
        } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
          res.redirect('/current/apply/kickouts/confirmation-no-match')
        } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
          res.redirect('/current/apply/kickouts/confirmation-no-match')
        } else {
          res.redirect('/current/apply/kickouts/confirmation-no-match')
        }  
  
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
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
  
    var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
    var dateofbirth = moment(dob).format('MM/DD/YYYY');
  
    var firstname = req.session.data['firstname'].trim().toUpperCase()
    var lastname = req.session.data['lastname'].trim().toUpperCase()
    var addressline1 = req.session.data['addressline1'].trim().toUpperCase()
    var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
    var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    const addressRegex = RegExp('^[0-9]+$'); 
  
    if (addressRegex.test(addressline1) === true) {
  
      var addressline1 = [addressline1,addressline2].join(" ").toUpperCase();
  
    }
  
    if (nationalinsurancenumber) {
  
      if (firstname == 'CHARLIE' && lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD') {
        res.redirect('/current/apply/are-you-pregnant')
      } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
        res.redirect('/current/apply/are-you-pregnant')
      } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
        res.redirect('/current/apply/are-you-pregnant')
      } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
        res.redirect('/current/apply/are-you-pregnant')
      } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
        res.redirect('/current/apply/kickouts/confirmation-no-match')
      } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
        res.redirect('/current/apply/kickouts/confirmation-no-match')
      } else {
        res.redirect('/current/apply/kickouts/confirmation-no-match')
      }  
  
    }
    else {
      res.redirect('/current/apply/national-insurance-number')
    }
  
  })
  
  // What is your nationality?
  
  router.post('/current/nationality', function (req, res) {
  
    var nationality = req.session.data['input-autocomplete']
  
    if (nationality) {
      res.redirect('/current/apply/are-you-pregnant')
    }
    else {
      res.redirect('/current/apply/nationality')
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
  
        res.redirect('/current/apply/email-address')
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
      var childsdateofbirthDisplay = childsdateofbirthday + ' / ' + childsdateofbirthmonth + ' / ' + childsdateofbirthyear;

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
      else if (childrenunderfouranswers === "no" && lastname == 'JONES') {
        res.redirect('/current/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'JOHNSON') {
        res.redirect('/current/apply/kickouts/no-eligible-children')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'BROWN') {
        res.redirect('/current/apply/kickouts/no-eligible-children')
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
  
  // Contact Preferences
  
  router.post('/current/contact-preferences', function (req, res) {
  
    var contact = req.session.data['contact']
    var emailAddress = req.session.data['emailaddress']
    var mobile = req.session.data['mobile']
  
    if (contact) {
  
      if (emailAddress || mobile || contact === 'NONE'){
        res.redirect('/current/apply/bank-details')    
      }
      else {
        res.redirect('/current/apply/contact-preferences')
      }
  
    }
    else {
      res.redirect('/current/apply/contact-preferences')
    }
  
  })
  
  // Bank Details
  
  router.post('/current/bank-details', function (req, res) {
  
    var accountName = req.session.data['accountname']
    var sortCode = req.session.data['sortcode']
    var accountNumber = req.session.data['accountnumber']
  
    if (accountName && sortCode && accountNumber){
      res.redirect('/current/apply/check-your-answers')    
    }
    else {
      res.redirect('/current/apply/bank-details')
    }
  
  })
  
  // Feedback
  
  router.post('/current/feedback', function (req, res) {
    res.redirect('/current/feedback')
  })


// Current Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/current/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
  var lastname = req.session.data['lastname']
  var postcode = req.session.data['postcode'];

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

  if (lastname == 'Green') {
    res.redirect('/current/apply/confirmation-pending-evidence')
  } else if (lastname == 'Blue') {
    res.redirect('/current/apply/confirmation-pending-evidence')
  } else if (lastname == 'Yellow') {
    res.redirect('/current/apply/confirmation-pending-evidence')
  } else {
    if (emailAddress) {
  
      if (pregnant === "yes") {
            res.redirect('/current/apply/confirmation-successful');
      } else {
        res.redirect('/current/apply/confirmation-successful');
      }
  
    }
    else if (mobilePhoneNumber) {
  
      if (pregnant === "yes") {
        res.redirect('/current/apply/confirmation-successful');
      } else {
        res.redirect('/current/apply/confirmation-successful');
      }
  
    } else if (!emailAddress && !mobilePhoneNumber) {
      res.redirect('/current/apply/confirmation-successful');
    } else {
      res.redirect('/current/apply/check-your-answers')
    }
  }

})
  

module.exports = router;