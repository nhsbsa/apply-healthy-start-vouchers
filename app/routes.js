// External dependencies
const express = require('express');
const router = express.Router();

// Add your routes here - above the module.exports line

module.exports = router;

// CONSTANTS

const today = new Date(Date.now());

// DO NOT DETELE (YET!)

router.post('/v1/...', function (req, res) {

  var day = req.session.data['day']
  var month = req.session.data['month']
  var year = req.session.data['year']

  var dob = new Date(year, month, day);
  console.log(dob);

  var ageDate =  new Date(today - dob.getTime());
  console.log(ageDate);

  var temp = ageDate.getFullYear();

  var yrs = Math.abs(temp - 1970);

  if (yrs < 18) {
      res.redirect('/v1/apply/are-you-pregnant')
  } else if (yrs <= 20) {
      res.redirect('/v1/apply/full-time-education')
  } else {
      res.redirect('/v1/apply/are-you-pregnant')
  }

})







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
      res.redirect('/v1/apply/due-date')
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

            var duedateday = req.session.data['duedateday']
            var duedatemonth = req.session.data['duedatemonth']
            var duedateyear = req.session.data['duedateyear']
 
            if (duedateday && duedatemonth && duedateyear) {
            res.redirect('/v1/apply/children-under-four')
            }
            else {
            res.redirect('/v1/apply/due-date')
            }
        
        })

// Do you have any children under the age of 4?

router.post('/v1/children-under-four', function (req, res) {

    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (childrenunderfour === "yes") {
      res.redirect('/v1/apply/childs-first-name')
    }
    else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v1/apply/kickouts/not-eligible')
    }
    else if (childrenunderfour === "no" && pregnant ==="yes") {
        res.redirect('/v1/apply/date-of-birth')
      }
    else {
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


      if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {
        res.redirect('/v1/apply/children-under-four-answers')
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