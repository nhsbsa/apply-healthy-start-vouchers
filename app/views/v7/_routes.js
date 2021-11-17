// ********************************
// APPLY (VERSION 7)
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

// Who are you applying for?
router.post('/v7/who-applying-for', function (req, res) {

    var applyingfor = req.session.data['applyingfor']
  
    if (applyingfor === "myself") {
      res.redirect('/v7/apply/national-insurance-number')
    }
    else if (applyingfor === "someoneelse") {
      res.redirect('/v7/apply/parent-guardian-carer')
    }
    else {
      res.redirect('/v7/apply/who-applying-for')
    }
  
  })
  
  // Are you a parent, guardian or carer of the person applying?
  router.post('/v7/parent-guardian-carer', function (req, res) {
  
    var parentguardiancarer = req.session.data['parentguardiancarer']
  
    if (parentguardiancarer === "yes") {
      res.redirect('/v7/apply/dependants-name')
    }
    else if (parentguardiancarer === "no") {
      res.redirect('/v7/apply/national-insurance-number')
    }
    else {
      res.redirect('/v7/apply/parent-guardian-carer')
    }
  
  })
  
        // DEPENDANTS
  
        // What is your name?
  
        router.post('/v7/dependants-name', function (req, res) {
  
          var dependantsfirstname = req.session.data['dependantsfirstname']
          var dependantslastname = req.session.data['dependantslastname']
  
          if (dependantsfirstname && dependantslastname) {
            res.redirect('/v7/apply/dependants-date-of-birth')
          }
          else {
            res.redirect('/v7/apply/dependants-name')
          }
  
        })
  
        // What is your date of birth?
  
        router.post('/v7/dependants-date-of-birth', function (req, res) {
  
          var dependantsdateofbirthday = req.session.data['dependantsdateofbirthday']
          var dependantsdateofbirthmonth = req.session.data['dependantsdateofbirthmonth']
          var dependantsdateofbirthyear = req.session.data['dependantsdateofbirthyear']
  
          var dependantsdob = new Date(dependantsdateofbirthyear, dependantsdateofbirthmonth, dependantsdateofbirthday);
          var dependantsageDate =  new Date(today - dependantsdob.getTime())
          var dependantstemp = dependantsageDate.getFullYear();
          var dependantsyrs = Math.abs(dependantstemp - 1970);
  
          req.session.data.yrs = dependantsyrs;
  
  
          if (dependantsdateofbirthday && dependantsdateofbirthmonth && dependantsdateofbirthyear) {
            res.redirect('/v7/apply/dependants-find-address')
          }
          else {
            res.redirect('/v7/apply/dependants-date-of-birth')
          }
  
        })
  
        // Find your address
  
        router.get('/v7/dependants-find-address', function (req, res) {
  
          var dependantshouseNumberName = req.session.data['dependantshousenumber']
          var dependantspostcode = req.session.data['dependantspostcode']
  
          const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');
  
          if (regex.test(dependantspostcode) === true) {
  
  
  
            if (dependantshouseNumberName) {
  
              axios.get("https://api.getAddress.io/find/" + dependantspostcode + "/" + dependantshouseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
              .then(response => {
                console.log(response.data.addresses);
                var items = response.data.addresses;
                res.render('v7/apply/dependants-select-address', {items: items});
              })
              .catch(error => {
                console.log(error);
                res.redirect('/v7/apply/dependants-no-address-found')
              });
  
            } else {
  
              axios.get("https://api.getAddress.io/find/" + dependantspostcode + "?api-key="+ process.env.POSTCODEAPIKEY)
              .then(response => {
                console.log(response.data.addresses);
                var items = response.data.addresses;
                res.render('v7/apply/dependants-select-address', {items: items});
              })
              .catch(error => {
                console.log(error);
                res.redirect('/v7/apply/dependants-no-address-found')
              });
  
            }
  
          } else {
            res.redirect('/v7/apply/dependants-find-address')
          }
  
        })
  
        // Select your address
  
        router.get('/v7/dependants-select-address', function (req, res) {
  
          var dependantsselectaddress = req.session.data['dependantsselectaddress']
  
          if (dependantsselectaddress === 'none') {
  
            delete req.session.data['dependantsaddressline1']
            delete req.session.data['dependantsaddressline2']
            delete req.session.data['dependantstowncity']
            delete req.session.data['dependantspostcode']
  
            res.redirect('/v7/apply/dependants-address')
          } else if (dependantsselectaddress) {
            res.redirect('/v7/apply/national-insurance-number')
          } else {
            res.redirect('/v7/apply/dependants-select-address')
          }
  
        })
  
        // What is your address?
  
        router.post('/v7/dependants-address', function (req, res) {
  
          delete req.session.data['dependantsselectaddress']
  
          var dependantsaddressline1 = req.session.data['dependantsaddressline1']
          var dependantsaddressline2 = req.session.data['dependantsaddressline2']
          var dependantstowncity = req.session.data['dependantstowncity']
          var dependantspostcode = req.session.data['dependantspostcode']
  
          if (dependantsaddressline1 && dependantstowncity && dependantspostcode) {
            res.redirect('/v7/apply/national-insurance-number')
          } else {
            res.redirect('/v7/apply/dependants-address')
          }
  
        })
  
  // What is your national insurance number?
  
  router.post('/v7/national-insurance-number', function (req, res) {
  
    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
  
      if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
        res.redirect('/v7/apply/name')
      } else {
        res.redirect('/v7/apply/kickouts/not-eligible-national-insurance-number')
      }
  
    }
    else {
      res.redirect('/v7/apply/national-insurance-number')
    }
  
  })
  
  // What is your name?
  
  router.post('/v7/name', function (req, res) {
  
    var firstname = req.session.data['firstname']
    var lastname = req.session.data['lastname']
  
    if (firstname && lastname) {
      res.redirect('/v7/apply/date-of-birth')
    }
    else {
      res.redirect('/v7/apply/name')
    }
  
  })
  
  // Date of birth
  
  router.post('/v7/date-of-birth', function (req, res) {
  
    var dateofbirthday = req.session.data['dateofbirthday']
    var dateofbirthmonth = req.session.data['dateofbirthmonth']
    var dateofbirthyear = req.session.data['dateofbirthyear']
  
    var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var ageDate =  new Date(today - dob.getTime())
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    req.session.data.yrs = yrs;
  
  
    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v7/apply/do-you-live-with-a-partner')
    }
    else {
      res.redirect('/v7/apply/date-of-birth')
    }
  
  })
  
  // Do you live with a partner?
  
  router.post('/v7/do-you-live-with-a-partner', function (req, res) {
  
    var liveWithPartner = req.session.data['partner']
  
    if (liveWithPartner === "yes") {
      res.redirect('/v7/apply/partners-name')
    }
    else if (liveWithPartner === "no") {
      res.redirect('/v7/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v7/apply/do-you-live-with-a-partner')
    }
  
  })
  
  // What is your partners name?
  
  router.post('/v7/partners-name', function (req, res) {
  
    var partnersfirstname = req.session.data['partnersfirstname']
    var partnerslastname = req.session.data['partnerslastname']
  
    if (partnersfirstname && partnerslastname) {
      res.redirect('/v7/apply/partners-date-of-birth')
    }
    else {
      res.redirect('/v7/apply/partners-name')
    }
  
  })
  
  // Partners date of birth
  
  router.post('/v7/partners-date-of-birth', function (req, res) {
  
    var partnersdateofbirthday = req.session.data['partnersdateofbirthday']
    var partnersdateofbirthmonth = req.session.data['partnersdateofbirthmonth']
    var partnersdateofbirthyear = req.session.data['partnersdateofbirthyear']
  
    var dob = new Date(partnersdateofbirthyear, partnersdateofbirthmonth, partnersdateofbirthday);
    var ageDate =  new Date(today - dob.getTime())
    var temp = ageDate.getFullYear();
    var partneryrs = Math.abs(temp - 1970);
  
    req.session.data.partneryrs = partneryrs;
  
  
    if (partnersdateofbirthday && partnersdateofbirthmonth && partnersdateofbirthyear) {
      res.redirect('/v7/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v7/apply/partners-date-of-birth')
    }
  
  })
  
  // Are you pregnant?
  
  router.post('/v7/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v7/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/v7/apply/find-address')
    }
    else {
      res.redirect('/v7/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v7/due-date', function (req, res) {
  
    var duedateday = req.session.data['duedateday']
    var duedatemonth = req.session.data['duedatemonth']
    var duedateyear = req.session.data['duedateyear']
  
    var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);
  
    var today = moment();
  
    var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
    var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks
  
    
    if (duedateday && duedatemonth && duedateyear) {
  
      if (duedate < today) {
        res.redirect('/v7/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v7/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v7/apply/find-address')
      }
  
    }
    else {
      res.redirect('/v7/apply/due-date')
    }
  
  })
  
  // Find your address
  
  router.get('/v7/find-address', function (req, res) {
  
    var houseNumberName = req.session.data['housenumber']
    var postcode = req.session.data['postcode']
  
    const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');
  
    if (regex.test(postcode) === true) {
  
  
  
      if (houseNumberName) {
  
        axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
        .then(response => {
          console.log(response.data.addresses);
          var items = response.data.addresses;
          res.render('v7/apply/select-address', {items: items});
        })
        .catch(error => {
          console.log(error);
          res.redirect('/v7/apply/no-address-found')
        });
  
      } else {
  
        axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
        .then(response => {
          console.log(response.data.addresses);
          var items = response.data.addresses;
          res.render('v7/apply/select-address', {items: items});
        })
        .catch(error => {
          console.log(error);
          res.redirect('/v7/apply/no-address-found')
        });
  
      }
      
      
  
  
  
  
    
  
    } else {
      res.redirect('/v7/apply/find-address')
    }
  
  })
  
  // Select your address
  
  router.get('/v7/select-address', function (req, res) {
  
    var selectaddress = req.session.data['selectaddress']
  
    if (selectaddress === 'none') {
  
      delete req.session.data['addressline1']
      delete req.session.data['addressline2']
      delete req.session.data['towncity']
      delete req.session.data['postcode']
  
      res.redirect('/v7/apply/address')
    } else if (selectaddress) {
      res.redirect('/v7/apply/contact-preferences')
    } else {
      res.redirect('/v7/apply/select-address')
    }
  
  })
  
  // What is your address?
  
  router.post('/v7/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode']
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/v7/apply/contact-preferences')
    } else {
      res.redirect('/v7/apply/address')
    }
  
  })
  
  // What is your email address?
  
  router.post('/v7/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/v7/apply/mobile-phone-number')
  
  })
  
  // What is your mobile phone number?
  
  router.post('/v7/mobile-phone-number', function (req, res) {
  
    var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
    res.redirect('/v7/apply/bank-details')
  
  })
  
  // Contact Preferences
  
  router.post('/v7/contact-preferences', function (req, res) {
  
    var contact = req.session.data['contact']
    var emailAddress = req.session.data['emailaddress']
    var mobile = req.session.data['mobile']
  
    if (contact) {
  
      if (emailAddress || mobile || contact === 'NONE'){
        res.redirect('/v7/apply/bank-details')    
      }
      else {
        res.redirect('/v7/apply/contact-preferences')
      }
  
    }
    else {
      res.redirect('/v7/apply/contact-preferences')
    }
  
  })
  
  // Bank Details
  
  router.post('/v7/bank-details', function (req, res) {
  
    var accountName = req.session.data['accountname']
    var sortCode = req.session.data['sortcode']
    var accountNumber = req.session.data['accountnumber']
  
    if (accountName && sortCode && accountNumber){
      res.redirect('/v7/apply/check-your-answers')    
    }
    else {
      res.redirect('/v7/apply/bank-details')
    }
  
  })
  
  // Feedback
  
  router.post('/v7/feedback', function (req, res) {
    res.redirect('/v7/feedback')
  })

  // V7 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v7/check-your-answers', function (req, res) {

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
        .then(response => { console.log(response); res.redirect('/v7/apply/confirmation-successful'); })
        .catch(err => { console.error(err); res.redirect('/v7/apply/confirmation-successful'); })
  
      } else {
  
        notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
        .then(response => { console.log(response); res.redirect('/v7/apply/confirmation-successful'); })
        .catch(err => { console.error(err); res.redirect('/v7/apply/confirmation-successful'); })
    
      }
  
    }
    else if (mobilePhoneNumber) {
  
      if (pregnant === "yes") {
  
        // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
        // .then(response => { console.log(response); res.redirect('/v7/apply/confirmation-successful'); })
        // .catch(err => console.error(err))
  
        res.redirect('/v7/apply/confirmation-successful');
  
      } else {
  
        // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
        // .then(response => { console.log(response); res.redirect('/v7/apply/confirmation-successful'); })
        // .catch(err => console.error(err))
  
        res.redirect('/v7/apply/confirmation-successful');
    
      }
  
    } else if (!emailAddress && !mobilePhoneNumber) {
      res.redirect('/v7/apply/confirmation-successful');
  
    } else {
      res.redirect('/v7/apply/check-your-answers')
    }
  
  })

module.exports = router;