// Gov Notify

var NotifyClient = require('notifications-node-client').NotifyClient
var notifyClient = new NotifyClient(process.env.NOTIFYAPIKEY)

// External dependencies
const express = require('express');
const router = express.Router();
const moment = require('moment');

// ****************************************
// NOTIFICATIONS
// ****************************************

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
      .catch(err => console.error(err))

    } else {

      notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v5/apply/confirmation-successful'); })
      .catch(err => console.error(err))
  
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

// V6 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v6/check-your-answers', function (req, res) {

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
      .then(response => { console.log(response); res.redirect('/v6/apply/confirmation-successful'); })
      .catch(err => console.error(err))

    } else {

      notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v6/apply/confirmation-successful'); })
      .catch(err => console.error(err))
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v6/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v6/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v6/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v6/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v6/apply/confirmation-successful');

  } else {
    res.redirect('/v6/apply/check-your-answers')
  }

})


// Add your routes here - above the module.exports line

module.exports = router;

// CONSTANTS

const today = new Date(Date.now());

// ********************************
// APPLY (VERSION 1)
// ********************************

// Do you get Healthy Start vouchers at the moment?
router.post('/v1/who-applying-for', function (req, res) {

    var applyingfor = req.session.data['applyingfor']
  
    if (applyingfor === "myself") {
      res.redirect('/v1/apply/do-you-get-vouchers')
    }
    else if (applyingfor === "someoneelse") {
      res.redirect('/v1/apply/do-you-get-vouchers')
    }
    else {
      res.redirect('/v1/apply/who-applying-for')
    }
  
})

// Do you get Healthy Start vouchers at the moment?
router.post('/v1/do-you-get-vouchers', function (req, res) {

    var vouchers = req.session.data['vouchers']
  
    if (vouchers === "yes") {
      res.redirect('/v1/transition/index')
    }
    else if (vouchers === "no") {
      res.redirect('/v1/apply/do-you-live-in-scotland')
    }
    else {
      res.redirect('/v1/apply/do-you-get-vouchers')
    }
  
})

// Do you live in Scotland?

router.post('/v1/do-you-live-in-scotland', function (req, res) {

    var scotland = req.session.data['scotland']
  
    if (scotland === "yes") {
      res.redirect('/v1/apply/kickouts/not-eligible-scotland')
    }
    else if (scotland === "no") {
      res.redirect('/v1/apply/date-of-birth')
    }
    else {
      res.redirect('/v1/apply/do-you-live-in-scotland')
    }
  
})

// Date of birth

router.post('/v1/date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  req.session.data.yrs = yrs;

  if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
    res.redirect('/v1/apply/are-you-pregnant')
  }
  else {
    res.redirect('/v1/apply/date-of-birth')
  }

})

// Are you pregnant?

router.post('/v1/are-you-pregnant', function (req, res) {

    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v1/apply/children-under-four')
    }
    else if (pregnant === "no") {
      res.redirect('/v1/apply/children-under-four')
    }
    else {
      res.redirect('/v1/apply/are-you-pregnant')
    }
  
})

        // Are you pregnant? > Due Date

        router.post('/v1/due-date', function (req, res) {

            var childrenunderfour = req.session.data['childrenunderfour']

            var duedateday = req.session.data['duedateday']
            var duedatemonth = req.session.data['duedatemonth']
            var duedateyear = req.session.data['duedateyear']
  
            var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);
            var fulltermpregnancy = moment().add(30, 'weeks'); // 40 weeks from today is a full term pregnancy - 10 weeks

            var fourtytwoweeksfromtoday = moment().add(42, 'weeks');


            var dateofbirthday = req.session.data['dateofbirthday']
            var dateofbirthmonth = req.session.data['dateofbirthmonth']
            var dateofbirthyear = req.session.data['dateofbirthyear']

            var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
            var ageDate =  new Date(today - dob.getTime())
            var temp = ageDate.getFullYear();
            var yrs = Math.abs(temp - 1970);
            
            if (duedateday && duedatemonth && duedateyear) {



              if (duedate > fourtytwoweeksfromtoday) { // If due date is greater than 42 weeks from today...
                res.redirect('/v1/apply/due-date-42-weeks') // ...redirect to error screen because that is longer than a full term pregnancy...
              } else if (duedate > fulltermpregnancy)  { // If due date is greater than 30 weeks from today, but less than 42 weeks from today...
                res.redirect('/v1/apply/kickouts/not-eligible-due-date') // ...redirect to error screen because they are less than 10 weeks pregnant...
              } else if (childrenunderfour === "yes") {
                res.redirect('/v1/apply/childs-first-name')
              } else if (childrenunderfour === "no" && yrs >= 18 && yrs <20) {
                res.redirect('/v1/apply/full-time-education')
              } else if (childrenunderfour === "no" && yrs < 18) {
                res.redirect('/v1/apply/name')
              } else if (childrenunderfour === "no" && yrs >= 20) {
                res.redirect('/v1/apply/benefits')
              } else {
                res.redirect('/v1/apply/due-date')
              }
                
            }
            else {
              res.redirect('/v1/apply/due-date')
            }
 
        })

// Do you have any children under the age of 4?

router.post('/v1/children-under-four', function (req, res) {

    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/v1/apply/due-date')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v1/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v1/apply/due-date')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v1/apply/kickouts/not-eligible')
    } else {
      res.redirect('/v1/apply/children-under-four')
    }
  
})

    // Do you have any children under the age of 4? > Childs first name

    router.post('/v1/childs-first-name', function (req, res) {

      var childsfirstname = req.session.data['childsfirstname']

      if (childsfirstname) {
        res.redirect('/v1/apply/childs-date-of-birth')
      }
      else {
        res.redirect('/v1/apply/childs-first-name')
      }

    })

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v1/childs-date-of-birth', function (req, res) {

      var childsdateofbirthday = req.session.data['childsdateofbirthday']
      var childsdateofbirthmonth = req.session.data['childsdateofbirthmonth']
      var childsdateofbirthyear = req.session.data['childsdateofbirthyear']

      var childsdateofbirth = moment(childsdateofbirthyear + '-' + childsdateofbirthmonth + '-' + childsdateofbirthday);
      var childsdateofbirthDisplay = childsdateofbirthday + ' / ' + childsdateofbirthmonth + ' / ' + childsdateofbirthyear;

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
              
              res.redirect('/v1/apply/children-under-four-answers');          



            } else {
              res.redirect('/v1/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v1/apply/childs-date-of-birth-older-than-four')
        }
        
      }
      else {
        res.redirect('/v1/apply/childs-date-of-birth')
      }

    })

    // Do you have any children under the age of 4? > Do you have another child under four?

    router.post('/v1/children-under-four-answers', function (req, res) {

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
        res.redirect('/v1/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no" && pregnant === "yes" && yrs >= 18 && yrs <20) {
        res.redirect('/v1/apply/full-time-education')
      }
      else if (childrenunderfouranswers === "no" && pregnant === "yes" && yrs < 18) {
        res.redirect('/v1/apply/name')
      }
      else if (childrenunderfouranswers === "no" && pregnant === "yes" && yrs >= 20) {
        res.redirect('/v1/apply/benefits')
      }
      else if (childrenunderfouranswers === "no" && childrenunderfour === "yes" && yrs >= 18 && yrs <20) {
        res.redirect('/v1/apply/full-time-education')
      }
      else if (childrenunderfouranswers === "no" && childrenunderfour === "yes" && yrs < 18) {
        res.redirect('/v1/apply/name')
      }
      else if (childrenunderfouranswers === "no" && childrenunderfour === "yes" && yrs >= 20) {
        res.redirect('/v1/apply/benefits')
      }
      else {
        res.redirect('/v1/apply/children-under-four-answers')
      }

    })

// Full time education

router.post('/v1/full-time-education', function (req, res) {

  var fulltimeeducation = req.session.data['fulltimeeducation']

  if (fulltimeeducation === "yes") {
    res.redirect('/v1/apply/name')
  }
  else if (fulltimeeducation === "no") {
    res.redirect('/v1/apply/benefits')
  }
  else {
    res.redirect('/v1/apply/full-time-education')
  }

})

// What benefits do you receive?

router.post('/v1/benefits', function (req, res) {

  var benefits = req.session.data['benefits']

  if (benefits) {
    
    if (benefits.includes('UC')) {
      res.redirect('/v1/apply/universal-credit')
    } else if (benefits.includes('CTC')) {
      res.redirect('/v1/apply/child-tax-credits')
    } else if (benefits.includes('JSA')) {
      res.redirect('/v1/apply/jobseekers-allowance')
    } else if (benefits.includes('ESA')) {
      res.redirect('/v1/apply/employment-support-allowance')
    } else if (benefits.includes('IS')) {
      res.redirect('/v1/apply/name')
    } else if (benefits.includes('PC')) {
      res.redirect('/v1/apply/name')
    } else if (benefits.includes('WTC')) {
      res.redirect('/v1/apply/working-tax-credits')
    } else if (benefits.includes('NONE')) {
      res.redirect('/v1/apply/kickouts/not-eligible')
    }

  }
  else if (!benefits) {
    res.redirect('/v1/apply/benefits')
  }

})

    // Universal credit

    router.post('/v1/universal-credit', function (req, res) {

      var universalcredit = req.session.data['universalcredit']

      if (universalcredit === "yes") {
        res.redirect('/v1/apply/name')
      }
      else if (universalcredit === "no") {
        res.redirect('/v1/apply/kickouts/not-eligible-sure-start')
      }
      else {
        res.redirect('/v1/apply/universal-credit')
      }

    })

    // Child tax credits

    router.post('/v1/child-tax-credits', function (req, res) {

      var childtaxcredits = req.session.data['childtaxcredits']

      if (childtaxcredits === "yes") {
        res.redirect('/v1/apply/name')
      }
      else if (childtaxcredits === "no") {
        res.redirect('/v1/apply/kickouts/not-eligible-sure-start')
      }
      else {
        res.redirect('/v1/apply/child-tax-credits')
      }

    })

    // JSA

    router.post('/v1/jobseekers-allowance', function (req, res) {

      var JSA = req.session.data['JSA']

      if (JSA === "income") {
        res.redirect('/v1/apply/name')
      }
      else if (JSA === "contribution") {
        res.redirect('/v1/apply/kickouts/not-eligible')
      }
      else {
        res.redirect('/v1/apply/jobseekers-allowance')
      }

    })

    // ESA

    router.post('/v1/employment-support-allowance', function (req, res) {

      var ESA = req.session.data['ESA']

      if (ESA === "income") {
        res.redirect('/v1/apply/name')
      }
      else if (ESA === "contribution") {
        res.redirect('/v1/apply/kickouts/not-eligible')
      }
      else {
        res.redirect('/v1/apply/employment-support-allowance')
      }

    })

    // ESA

    router.post('/v1/working-tax-credits', function (req, res) {

      var workingtaxcredits = req.session.data['workingtaxcredits']

      if (workingtaxcredits === "yes") {
        res.redirect('/v1/apply/name')
      }
      else if (workingtaxcredits === "no") {
        res.redirect('/v1/apply/kickouts/not-eligible-sure-start')
      }
      else {
        res.redirect('/v1/apply/employment-support-allowance')
      }

    })

// What is your name?

  router.post('/v1/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v1/apply/find-address')
  }
  else {
    res.redirect('/v1/apply/name')
  }

})

// Find your address

router.get('/v1/find-address', function (req, res) {

  var postcode = req.session.data['postcode']

  if (postcode) {
    res.redirect('/v1/apply/select-address')
  }
  else {
    res.redirect('/v1/apply/find-address')
  }

})

// Select your address

router.get('/v1/select-address', function (req, res) {

  delete req.session.data['addressline1']
  delete req.session.data['addressline2']
  delete req.session.data['towncity']
  delete req.session.data['postcode']

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {
    res.redirect('/v1/apply/address')
  } else if (selectaddress && yrs < 16) {
    res.redirect('/v1/apply/telephone-number')
  } else if (selectaddress && yrs >= 16) {
    res.redirect('/v1/apply/national-insurance-number')
  }
  else {
    res.redirect('/v1/apply/select-address')
  }

})

// What is your address?

router.post('/v1/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode']

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  if (addressline1 && towncity && postcode && yrs < 16) {
    res.redirect('/v1/apply/telephone-number')
  } else if (addressline1 && towncity && postcode && yrs >= 16) {
      res.redirect('/v1/apply/national-insurance-number')
  } else {
    res.redirect('/v1/apply/address')
  }

})

// What is your national insurance number?

router.post('/v1/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber']

  if (nationalinsurancenumber) {
    res.redirect('/v1/apply/telephone-number')
  }
  else {
    res.redirect('/v1/apply/national-insurance-number')
  }

})

// What is your telephone number?

router.post('/v1/telephone-number', function (req, res) {

  var telephonenumber = req.session.data['telephonenumber']

  if (telephonenumber) {
    res.redirect('/v1/apply/email-address')
  }
  else {
    res.redirect('/v1/apply/telephone-number')
  }

})

// What is your email address?

router.post('/v1/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  if (emailaddress) {
    res.redirect('/v1/apply/check-your-answers')
  }
  else {
    res.redirect('/v1/apply/email-address')
  }

})

// ********************************
// APPLY (VERSION 3)
// ********************************

// What is your national insurance number?

router.post('/v3/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].replace(/\s+/g, '');

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
  var childsdateofbirthDisplay = childsdateofbirthday + ' / ' + childsdateofbirthmonth + ' / ' + childsdateofbirthyear;

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

// ********************************
// APPLY (VERSION 4)
// ********************************

// What is your national insurance number?

router.post('/v4/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].replace(/\s+/g, '');

  if (nationalinsurancenumber) {

    if (nationalinsurancenumber === 'QQ123456C') {
      res.redirect('/v4/apply/name')
    } else {
      res.redirect('/v4/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v4/apply/kickouts/national-insurance-number')
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

// ********************************
// APPLY (VERSION 5)
// ********************************

// What is your national insurance number?

router.post('/v5/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].replace(/\s+/g, '');

  if (nationalinsurancenumber) {

    if (nationalinsurancenumber === 'QQ123456C') {
      res.redirect('/v5/apply/name')
    } else {
      res.redirect('/v5/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v5/apply/kickouts/national-insurance-number')
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

// Contact Preferences

router.post('/v5/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v5/apply/bank-details')    
    }
    else {
      res.redirect('/v5/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v5/apply/contact-preferences')
  }

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

// ********************************
// APPLY (VERSION 6)
// ********************************

// Do you get Healthy Start vouchers at the moment?
router.post('/v6/who-applying-for', function (req, res) {

  var applyingfor = req.session.data['applyingfor']

  if (applyingfor === "myself") {
    res.redirect('/v6/apply/national-insurance-number')
  }
  else if (applyingfor === "someoneelse") {
    res.redirect('/v6/apply/national-insurance-number')
  }
  else {
    res.redirect('/v6/apply/who-applying-for')
  }

})

// What is your national insurance number?

router.post('/v6/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].replace(/\s+/g, '');

  if (nationalinsurancenumber) {

    if (nationalinsurancenumber === 'QQ123456C') {
      res.redirect('/v6/apply/name')
    } else {
      res.redirect('/v6/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v6/apply/kickouts/national-insurance-number')
  }

})

// What is your name?

router.post('/v6/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v6/apply/date-of-birth')
  }
  else {
    res.redirect('/v6/apply/name')
  }

})

// Date of birth

router.post('/v6/date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  req.session.data.yrs = yrs;


  if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
    res.redirect('/v6/apply/are-you-pregnant')
  }
  else {
    res.redirect('/v6/apply/date-of-birth')
  }

})

// Are you pregnant?

router.post('/v6/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes") {
    res.redirect('/v6/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;
    res.redirect('/v6/apply/address')
  }
  else {
    res.redirect('/v6/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v6/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v6/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v6/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      res.redirect('/v6/apply/address')
    }

  }
  else {
    res.redirect('/v6/apply/due-date')
  }

})

// What is your address?

router.post('/v6/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode']

  if (addressline1 && towncity && postcode) {
    res.redirect('/v6/apply/email-address')
  } else {
    res.redirect('/v6/apply/address')
  }

})

// What is your email address?

router.post('/v6/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v6/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v6/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v6/apply/bank-details')

})

// Contact Preferences

router.post('/v6/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v6/apply/bank-details')    
    }
    else {
      res.redirect('/v6/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v6/apply/contact-preferences')
  }

})

// Bank Details

router.post('/v6/bank-details', function (req, res) {

  var accountName = req.session.data['accountname']
  var sortCode = req.session.data['sortcode']
  var accountNumber = req.session.data['accountnumber']

  if (accountName && sortCode && accountNumber){
    res.redirect('/v6/apply/check-your-answers')    
  }
  else {
    res.redirect('/v6/apply/bank-details')
  }

})

// Feedback

router.post('/v6/feedback', function (req, res) {
  res.redirect('/v6/feedback')
})