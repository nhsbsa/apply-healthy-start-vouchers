// ********************************
// APPLY (VERSION 14)
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
router.post('/v14/where-do-you-live', function (req, res) {

  const whereDoYouLive = req.session.data['where-do-you-live']

  if (whereDoYouLive == 'yes') {
    res.redirect('/v14/apply/name');
  } else {
    res.redirect('/v14/apply/kickouts/not-eligible-country');
  }

})

// What is your name?

router.post('/v14/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v14/apply/address')
  }
  else {
    res.redirect('/v14/apply/name')
  }

})

// Find your address

router.get('/v14/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key=" + process.env.POSTCODEAPIKEY)
        .then(response => {
          console.log(response.data.addresses);
          var items = response.data.addresses;
          res.render('v14/apply/select-address', { items: items });
        })
        .catch(error => {
          console.log(error);
          res.redirect('/v14/apply/no-address-found')
        });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key=" + process.env.POSTCODEAPIKEY)
        .then(response => {
          console.log(response.data.addresses);
          var items = response.data.addresses;
          res.render('v14/apply/select-address', { items: items });
        })
        .catch(error => {
          console.log(error);
          res.redirect('/v14/apply/no-address-found')
        });

    }

  } else {
    res.redirect('/v14/apply/find-address')
  }

})

// Select your address

router.get('/v14/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v14/apply/address')
  } else if (selectaddress) {
    res.redirect('/v14/apply/date-of-birth')
  } else {
    res.redirect('/v14/apply/select-address')
  }

})

// What is your address?

router.post('/v14/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()

  if (addressline1 && towncity && postcode) {
    res.redirect('/v14/apply/date-of-birth')
  } else {
    res.redirect('/v14/apply/address')
  }

})

// Date of birth

router.post('/v14/date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
  var dateofbirth = moment(dob).format('MM/DD/YYYY');

  var dobYrs = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate = new Date(today - dobYrs.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  var firstname = req.session.data['firstname'].trim().toUpperCase()
  var lastname = req.session.data['lastname'].trim().toUpperCase()
  var addressline1 = req.session.data['addressline1'].trim().toUpperCase()
  var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()

  // Checking the actual age of the beneficiary 
  var ageInMilliseconds = new Date() - new Date(dateofbirth);
  var actualAge = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years

  if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
    res.redirect('/v14/apply/national-insurance-number')
  } else {
    res.redirect('/v14/apply/date-of-birth')
  }


})

// What is your national insurance number?

router.post('/v14/national-insurance-number', function (req, res) {

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

  /* 
  const addressRegex = RegExp('^[0-9]+$'); 
 
  if (addressRegex.test(addressline1) === true) {
 
    var addressline1 = [addressline1,addressline2].join(" ").toUpperCase();
 
  }
  */

  if (nationalinsurancenumber) {

    if (lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'GREEN' && nationalinsurancenumber == 'MN987544G' && dateofbirth == '01/01/2004' && postcode == 'NR334GP') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'BLUE' && nationalinsurancenumber == 'OP977443H' && dateofbirth == '01/01/2004' && postcode == 'NR334GT') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'YELLOW' && nationalinsurancenumber == 'JN333546K' && dateofbirth == '01/01/2004' && postcode == 'NR334GT') {
      res.redirect('/v14/apply/are-you-pregnant')
    } else if (lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS') {
      res.redirect('/v14/apply/kickouts/confirmation-no-match')
    } else if (lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ') {
      res.redirect('/v14/apply/kickouts/confirmation-no-match')
    } else {
      res.redirect('/v14/apply/kickouts/confirmation-no-match')
    }

    console.log(firstname);
    console.log(lastname);
    console.log(nationalinsurancenumber);
    console.log(dateofbirth);
    console.log(postcode);
    console.log(addressline1);



  }
  else {
    res.redirect('/v14/apply/national-insurance-number')
  }

})

// Are you pregnant?

router.post('/v14/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']
  var lastname = req.session.data['lastname'].trim().toUpperCase()

  if (pregnant === "yes") {
    res.redirect('/v14/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;

    if (lastname == 'SMITH') {
      res.redirect('/v14/apply/email-address')
    } else if (lastname == 'JONES') {
      res.redirect('/v14/apply/children-under-four')
    } else if (lastname == 'JOHNSON') {
      res.redirect('/v14/apply/children-under-four')
    } else if (lastname == 'BROWN') {
      res.redirect('/v14/apply/children-under-four')
    } else if (lastname == 'GREEN') {
      res.redirect('/v14/apply/children-under-four')
    } else if (lastname == 'YELLOW') {
      res.redirect('/v14/apply/kickouts/not-eligible-less-ten-weeks')
    } else if (lastname == 'BLUE') {
      res.redirect('/v14/apply/children-under-four')
    } else {
      res.redirect('/v14/apply/are-you-pregnant')
    }

  }
  else {
    res.redirect('/v14/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v14/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment()

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  var lastname = req.session.data['lastname'].trim().toUpperCase()


  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v14/apply/due-date')
      console.log('DUE DATE LESS THAN TODAY')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v14/apply/due-date')
      console.log('DUE DATE MORE THAN FULL TERM')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      if (lastname == 'SMITH') {
        res.redirect('/v14/apply/email-address')
      } else if (lastname == 'JONES') {
        res.redirect('/v14/apply/children-under-four')
      } else if (lastname == 'JOHNSON') {
        res.redirect('/v14/apply/children-under-four')
      } else if (lastname == 'BROWN') {
        res.redirect('/v14/apply/children-under-four')
      } else if (lastname == 'GREEN') {
        // Less than 10 weeks pregnant
        if (duedate > tenweekspregnant) {
          res.redirect('/v14/apply/kickouts/not-eligible-less-ten-weeks')
        } else {
          res.redirect('/v14/apply/evidence-type')
        }
      } else if (lastname == 'BLUE') {
        
        res.redirect('/v14/apply/under-ten-weeks-uc')
      } else if (lastname == 'YELLOW') {
        if (duedate > tenweekspregnant) {
          res.redirect('/v14/apply/under-ten-weeks-uc')
        } else {
          res.redirect('/v14/apply/children-under-four')
        }
      } else {
        res.redirect('/v14/apply/due-date')
        console.log('RUNNING THIS ELSE')
      }

    }

  }
  else {
    console.log('running else');
    res.redirect('/v14/apply/due-date')
  }

})

// Do you have any children under the age of 4?

router.post('/v14/children-under-four', function (req, res) {

  var childrenunderfour = req.session.data['childrenunderfour']
  var pregnant = req.session.data['pregnant']

  var lastname = req.session.data['lastname'].trim().toUpperCase()

  if (pregnant === "yes" && childrenunderfour === "no") {
    if (lastname === 'BLUE') {
      res.redirect('/v14/apply/evidence-type')
    } else {
      res.redirect('/v14/apply/email-address')
    }
  } else if (pregnant === "no" && childrenunderfour === "yes") {
    res.redirect('/v14/apply/childs-first-name')
  } else if (pregnant === "yes" && childrenunderfour === "yes") {
    res.redirect('/v14/apply/childs-first-name')
  } else if (childrenunderfour === "no" && pregnant === "no") {
    res.redirect('/v14/apply/kickouts/not-eligible')
  } else {
    res.redirect('/v14/apply/children-under-four')
  }

})

// Do you have any children under the age of 4? > Childs first name

router.post('/v14/childs-first-name', function (req, res) {

  var childsfirstname = req.session.data['childsfirstname']
  var childslastname = req.session.data['childslastname']

  if (childsfirstname && childslastname) {
    res.redirect('/v14/apply/childs-date-of-birth')
  }
  else {
    res.redirect('/v14/apply/childs-first-name')
  }

})

// Do you have any children under the age of 4? > Childs date of birth

router.post('/v14/childs-date-of-birth', function (req, res) {

  var childsdateofbirthday = req.session.data['childsdateofbirthday']
  var childsdateofbirthmonth = req.session.data['childsdateofbirthmonth']
  var childsdateofbirthyear = req.session.data['childsdateofbirthyear']

  var childsdateofbirth = moment(childsdateofbirthday + '-' + childsdateofbirthmonth + '-' + childsdateofbirthyear, 'DD-MM-YYYY').format('YYYY-MM-DD');
  var childsdateofbirthDisplay = childsdateofbirthday + ' / ' + childsdateofbirthmonth + ' / ' + childsdateofbirthyear;

  var today = moment().format('YYYY-MM-DD');
  var fouryearsfromtoday = moment().subtract(4, 'years').format('YYYY-MM-DD');

  console.log('Childs DOB: ' + childsdateofbirth);
  console.log('Today: ' + today);
  console.log('Four years from today: ' + fouryearsfromtoday);

  if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {

    if (moment(childsdateofbirth).isBefore(today)) {

      if (moment(childsdateofbirth).isAfter(fouryearsfromtoday)) {

        var childList = req.session.data.childList

        // If no array exists, create one called 'childList'. If one already exists, do nothing.

        childList = (typeof childList != 'undefined' && childList instanceof Array) ? childList : []

        // Create a variable of the posted information

        var childsfirstname = req.session.data['childsfirstname']
        var childslastname = req.session.data['childslastname']

        // Add the posted information into the 'childList' array

        childList.push({ "ChildsFirstName": childsfirstname, "ChildsLastName": childslastname, "ChildsDOB": childsdateofbirthDisplay });

        req.session.data.childList = childList;

        console.log(childList)

        console.log('Number of children:', childList.length)

        // Redirect to the 'Do you get another?' page

        res.redirect('/v14/apply/children-under-four-answers');



      } else {
        res.redirect('/v14/apply/childs-date-of-birth')
      }

    } else {
      res.redirect('/v14/apply/childs-date-of-birth')
    }

  }
  else {
    res.redirect('/v14/apply/childs-date-of-birth')
  }


})

// Do you have any children under the age of 4? > Do you have another child under four?

router.post('/v14/children-under-four-answers', function (req, res) {

  var childrenunderfouranswers = req.session.data['childrenunderfouranswers']

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']
  var pregnant = req.session.data['pregnant']
  var childrenunderfour = req.session.data['childrenunderfour']
  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate = new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  var lastname = req.session.data['lastname'].trim().toUpperCase()

  if (childrenunderfouranswers === "yes") {
    res.redirect('/v14/apply/childs-first-name')
  }
  else if (childrenunderfouranswers === "no" && lastname == 'JONES') {
    res.redirect('/v14/apply/email-address')
  }
  else if (childrenunderfouranswers === "no" && lastname == 'BLUE') {
    res.redirect('/v14/apply/evidence-type')
  }
  else if (childrenunderfouranswers === "no" && lastname == 'JOHNSON') {
    res.redirect('/v14/apply/kickouts/no-eligible-children')
  }
  else if (childrenunderfouranswers === "no" && lastname == 'BROWN') {
    res.redirect('/v14/apply/kickouts/no-eligible-children')
  }
  else {
    res.redirect('/v14/apply/children-under-four-answers')
  }

})

router.post('/v14/evidence-type', (req, res) => {

  const evidenceType = req.session.data['evidence']

  if (evidenceType) {
    res.redirect('/v14/apply/file-upload')
  } else {
    res.redirect('/v14/apply/evidence-type')
  }

})

router.post('/v14/file-upload', (req, res) => {
  const file = req.session.data['file-upload']
  res.redirect('/v14/apply/file-upload-cya')
})

router.post('/v14/additional-evidence', (req, res) => {
  const additionalFile = req.session.data['optional-evidence']

  if (additionalFile == 'yes') {
    res.redirect('/v14/apply/file-upload-ni-nino')
  } else {
    res.redirect('/v14/apply/email-address')
  }
})

router.post('/v14/file-upload-ni-nino', (req, res) => {
  const file = req.session.data['file-upload']
  res.redirect('/v14/apply/file-upload-cya-ni-nino')
})

// What is your email address?

router.post('/v14/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v14/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v14/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v14/apply/check-your-answers')

})

// Contact Preferences

router.post('/v14/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE') {
      res.redirect('/v14/apply/bank-details')
    }
    else {
      res.redirect('/v14/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v14/apply/contact-preferences')
  }

})

// Feedback

router.post('/v14/feedback', function (req, res) {
  res.redirect('/v14/feedback')
})


router.post('/v14/check-your-answers', function (req, res) {

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
    res.redirect('/v14/apply/confirmation-pending-evidence')
  } else if (lastname == 'Blue') {
    res.redirect('/v14/apply/confirmation-pending-evidence')
  } else {
    res.redirect('/v14/apply/confirmation-successful')
  }

})

// routes above this line
module.exports = router