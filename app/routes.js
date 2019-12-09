// External dependencies
const express = require('express');
const router = express.Router();
const moment = require('moment')

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
      res.redirect('/v1/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v1/apply/do-you-live-in-scotland')
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
            
            if (duedateday && duedatemonth && duedateyear) {



              if (duedate > fourtytwoweeksfromtoday) { // If due date is greater than 42 weeks from today...
                res.redirect('/v1/apply/due-date-42-weeks') // ...redirect to error screen because that is longer than a full term pregnancy...
              } else if (duedate > fulltermpregnancy)  { // If due date is greater than 30 weeks from today, but less than 42 weeks from today...
                res.redirect('/v1/apply/kickouts/not-eligible-due-date') // ...redirect to error screen because they are less than 10 weeks pregnant...
              } else if (childrenunderfour === "yes") {
                res.redirect('/v1/apply/childs-first-name')
              } else {
                res.redirect('/v1/apply/date-of-birth')
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

      if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {

        if (childsdateofbirth < moment()) {
          res.redirect('/v1/apply/children-under-four-answers')
        } else {
          res.redirect('/v1/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v1/apply/childs-date-of-birth')
      }

    })

    // Do you have any children under the age of 4? > Do you have another child under four?

    router.post('/v1/children-under-four-answers', function (req, res) {

      var childrenunderfouranswers = req.session.data['childrenunderfouranswers']

      if (childrenunderfouranswers === "yes") {
        res.redirect('/v1/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no") {
        res.redirect('/v1/apply/date-of-birth')
      }
      else {
        res.redirect('/v1/apply/children-under-four-answers')
      }

    })

// Date of birth

router.post('/v1/date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']
  var pregnant = req.session.data['pregnant']
  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {

      if (pregnant === "yes" && yrs > 18 && yrs <20) {
        res.redirect('/v1/apply/full-time-education')
      } else if (pregnant === "yes" && yrs < 18) {
        res.redirect('/v1/apply/name')
      } else {
        res.redirect('/v1/apply/benefits')
      }

  }
  else {
    res.redirect('/v1/apply/date-of-birth')
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
      res.redirect('/v1/apply/kickouts/not-eligible-sure-start')
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
        res.redirect('/v1/apply/kickouts/not-eligible-sure-start')
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
        res.redirect('/v1/apply/kickouts/not-eligible-sure-start')
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
    res.redirect('/v1/apply/address')
  }
  else {
    res.redirect('/v1/apply/name')
  }

})

// What is your address?

router.post('/v1/address', function (req, res) {

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode']

  if (addressline1 && towncity && postcode) {
    res.redirect('/v1/apply/national-insurance-number')
  }
  else {
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








router.get('/v1/find-address', function (req, res) {
  if (req.session.data['postcode-for-council'] !== '') {
    res.redirect(personDetailsPath+'select-your-address-list');
  } else {
    if (req.query.change === 'true') {
      res.locals.formAction = 'select-address?change=true';
    } else {
      res.locals.formAction = 'select-address';
    }
    res.locals.submitLabel = 'Find address';
    res.render(personDetailsTemplatePath+'your-address');
  }
})