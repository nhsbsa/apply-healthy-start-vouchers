// ********************************
// APPLY (v19)
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


router.post('/v19/where-do-you-live', function (req, res) {

  const whereDoYouLive = req.session.data['where-do-you-live']

  if (whereDoYouLive == 'yes') {
    res.redirect('/v19/apply/date-of-birth');
  } else {
    res.redirect('/v19/apply/kickouts/not-eligible-country');
  }

})

  // Date of birth
  
router.post('/v19/date-of-birth', function (req, res) {

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
      res.redirect('/v19/apply/kickouts/under-sixteen-signpost')
    } else {
      res.redirect('/v19/apply/name');
    }
  } else {
    res.redirect('/v19/apply/date-of-birth')
  }


})

// What is your name?

router.post('/v19/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v19/apply/address')
  }
  else {
    res.redirect('/v19/apply/name')
  }

})
  
  // What is your address?
  
  router.post('/v19/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/v19/apply/national-insurance-number')
    } else {
      res.redirect('/v19/apply/address')
    }
  
  })
  

  
  // What is your national insurance number?
  
  router.post('/v19/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/v19/apply/check-your-answers-personal-details')
    } else {
      res.redirect('/v19/apply/national-insurance-number')
    }

  })

  // Check your answers - personal details

  router.post('/v19/cya-personal-details', (req, res) => {

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

    var firstname = req.session.data['firstname'].trim().toUpperCase()
    var lastname = req.session.data['lastname'].trim().toUpperCase()
    req.session.fullName = firstname + ' ' + lastname
    var addressline1 = req.session.data['addressline1'].trim().toUpperCase()
    var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
    var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

    if (nationalinsurancenumber) {
  
      if (firstname == 'CHARLIE' && lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD') {
        res.redirect('/v19/apply/are-you-pregnant')
      } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
        res.redirect('/v19/apply/are-you-pregnant')
      } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
        res.redirect('/v19/apply/are-you-pregnant')
      } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
        res.redirect('/v19/apply/are-you-pregnant')
      } else if (firstname == 'ANITA' && lastname == 'BILAL' && nationalinsurancenumber == 'QR123456I' && dateofbirth == '01/01/1999' && postcode == 'NE333PT' && addressline1 == '10 BROADWAY') {
        res.redirect('/v19/apply/are-you-pregnant') 
      } else if (firstname == 'MALIA' && lastname == 'ELBA' && nationalinsurancenumber == 'ST123456L' && dateofbirth == '01/01/1999' && postcode == 'NE333ST' && addressline1 == '15 MELBOURNE') {
        res.redirect('/v19/apply/are-you-pregnant')
      } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
        res.redirect('/v19/apply/kickouts/confirmation-no-match')
      } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
        res.redirect('/v19/apply/kickouts/confirmation-no-match')
      } else if (firstname == 'SARAH' && lastname == 'GREEN' && nationalinsurancenumber == 'MN987544G' && postcode == 'NR334GP' && addressline1 == '13 PALM ROAD') {
        if (yrs >= 16) {
          res.redirect('/v19/apply/benefits')
        }
      } else {
        res.redirect('/v19/apply/kickouts/confirmation-no-match')
      }  
    }
    else {
      res.redirect('/v19/apply/national-insurance-number')
    }
    
  })

  // Do you get any of these benefits?

router.post('/v19/benefits', function (req, res) {

  let benefits = req.session.data['benefits']
  req.session.benefitsList = benefits
  let fullName = req.session.fullName

    if (Array.isArray(benefits)) {

      if (benefits.includes('UC')) {
        if (fullName == "SARAH GREEN") {
          res.redirect('/v19/apply/universal-credit')
        } else {
          res.redirect('/v19/apply/are-you-pregnant')
        }
      } else if (benefits.includes('CTC')) {
        if (fullName == "SARAH GREEN") {
          res.redirect('/v19/apply/kickouts/confirmation-no-match')
        } else {
          res.redirect('/v19/apply/are-you-pregnant')
        }


      } else if (benefits.includes('JSA') && benefits.includes('WTC') && benefits.includes('ESA') && benefits.includes('IS')) {
        res.redirect('/v19/apply/benefits')
      } else if (benefits.includes('JSA' && 'WTC') && !benefits.includes('ESA') && !benefits.includes('IS')) {
        res.redirect('/v19/apply/jobseekers-allowance')
      } else if (benefits.includes('ESA' && 'WTC') && !benefits.includes('JSA') && !benefits.includes('IS')) {
        res.redirect('/v19/apply/working-tax-credits')
      } else if (benefits.includes('IS' && 'WTC')) {
        res.redirect('/v19/apply/are-you-pregnant')
      } else {
        res.redirect('/v19/apply/benefits')
      }

    } else {

        const applicantsAge = req.session.applicantAge

        if (benefits.includes('UC')) {
          if (fullName == "SARAH GREEN") {
            res.redirect('/v19/apply/universal-credit')
          } else {
            res.redirect('/v19/apply/are-you-pregnant')
          }
        } else if (benefits.includes('CTC')) {
          if (fullName == "SARAH GREEN") {
            res.redirect('/v19/apply/child-tax-credits')
          } else {
            res.redirect('/v19/apply/are-you-pregnant')
          }
        } else if (benefits.includes('JSA')) {
          res.redirect('/v19/apply/jobseekers-allowance')
        } else if (benefits.includes('ESA')) {  
          res.redirect('/v19/apply/employment-support-allowance')
        } else if (benefits.includes('IS')) {
          res.redirect('/v19/apply/are-you-pregnant')
        } else if (benefits.includes('PC')) {
          res.redirect('/v19/apply/pension-credit')
        } else if (benefits.includes('WTC')) {
          res.redirect('/v19/apply/working-tax-credits')
        } else if (benefits.includes('NONE')) {
          if (applicantsAge >= 16 && applicantsAge <= 18) {
            res.redirect('/v19/apply/kickouts/under-eighteen-signpost')
          } else {
            res.redirect('/v19/apply/kickouts/not-eligible')
          }
        } else {
          res.redirect('/v19/apply/benefits')
        }
    }

})

// Benefit type routing

router.post('/v19/universal-credit', function (req, res) {

  var universalcredit = req.session.data['universalcredit']

  if (universalcredit === "yes") {
    res.redirect('/v19/apply/are-you-pregnant')
  }
  else if (universalcredit === "no") {
    res.redirect('/v19/apply/kickouts/not-eligible')
  }
  else {
    res.redirect('/v19/apply/universal-credit')
  }

})

router.post('/v19/child-tax-credits', function (req, res) {

  var childtaxcredits = req.session.data['childtaxcredits']

  if (childtaxcredits === "yes") {
    res.redirect('/v19/apply/are-you-pregnant')
  }
  else if (childtaxcredits === "no") {
    res.redirect('/v19/apply/kickouts/not-eligible')
  }
  else {
    res.redirect('/v19/apply/child-tax-credits')
  }

})

router.get('/v19/jobseekers-allowance', (req, res) => {
  const typeOfJSA = req.session.data['JSA']
  let benefitsList = req.session.benefitsList

  if (typeOfJSA == 'income') {
    res.redirect('/v19/apply/are-you-pregnant')
  } else if (typeOfJSA == 'contribution') {
    if (benefitsList.includes('JSA' && 'WTC') && !benefitsList.includes('ESA')) {
      res.redirect('/v19/apply/working-tax-credits')
    } if (benefitsList.includes('JSA' && 'ESA' && 'WTC')) {
      res.redirect('/v19/apply/working-tax-credits')
    } else {
      res.redirect('/v19/apply/kickouts/not-eligible')
    }
  } else {
    res.redirect('/v19/apply/jobseekers-allowance')
  }
})

router.get('/v19/employment-support-allowance', (req, res) => {
  const typeOfESA = req.session.data['ESA']
  let benefitsList = req.session.benefitsList

  if (typeOfESA == 'income') {
    res.redirect('/v19/apply/are-you-pregnant')
  } else if (typeOfESA == 'contribution') {
    if (benefitsList.includes('ESA' && 'WTC') && !benefitsList.includes('JSA')) {
      res.redirect('/v19/apply/kickouts/not-eligible')
    } else if (benefitsList.includes('JSA' && 'ESA' && 'WTC')) {
      res.redirect('/v19/apply/kickouts/not-eligible')
    } else {
      res.redirect('/v19/apply/kickouts/not-eligible')
    }
  } else {
    res.redirect('/v19/apply/kickouts/not-eligible')
  }
})

router.get('/v19/working-tax-credits', (req, res) => {
  const wtcRunOnPayment = req.session.data['workingtaxcredits']
  let benefitsList = req.session.benefitsList

  if (wtcRunOnPayment == 'yes') {
    res.redirect('/v19/apply/are-you-pregnant')
  } else if (wtcRunOnPayment == 'no') {
    if (benefitsList.includes('JSA' && 'WTC') && !benefitsList.includes('ESA')) {
      res.redirect('/v19/apply/kickouts/not-eligible')
    } else if (benefitsList.includes('ESA' && 'WTC') && !benefitsList.includes('JSA')) {
      res.redirect('/v19/apply/employment-support-allowance')
    } else if (benefitsList.includes('JSA' && 'ESA' && 'WTC')) {
      res.redirect('/v19/apply/employment-support-allowance')
    } else {
      res.redirect('/v19/apply/kickouts/not-eligible')
    }
  } else {
    res.redirect('/v19/apply/kickouts/not-eligible')
  }
})


router.post('/v19/pension-credit', function (req, res) {

  var pensioncredit = req.session.data['pensioncredit']

  if (pensioncredit === "yes") {
    res.redirect('/v19/apply/are-you-pregnant')
  }
  else if (pensioncredit === "no") {
    res.redirect('/v19/apply/kickouts/not-eligible')
  }
  else {
    res.redirect('/v19/apply/pension-credit')
  }

})
  
  // What is your nationality?
  
  router.post('/v19/nationality', function (req, res) {
  
    var nationality = req.session.data['input-autocomplete']
  
    if (nationality) {
      res.redirect('/v19/apply/are-you-pregnant')
    }
    else {
      res.redirect('/v19/apply/nationality')
    }
  
  })
  
  // Are you pregnant?
  
  router.post('/v19/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
    var benefits = req.session.data['benefits']
  
    if (pregnant === "yes") {
      res.redirect('/v19/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;
      res.redirect('/v19/apply/children-under-four')
    }
    else {
      res.redirect('/v19/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v19/due-date', function (req, res) {
  
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
        res.redirect('/v19/apply/due-date')
      } else if (duedate > fulltermpregnancy) {
        res.redirect('/v19/apply/due-date')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
        }
  
        res.redirect('/v19/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/v19/apply/due-date')
    }
  
  })
  // Do you have any children under the age of 4?
  
  router.post('/v19/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes" && childrenunderfour === "no") {
      res.redirect('/v19/apply/email-address')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v19/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v19/apply/childs-first-name')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v19/apply/kickouts/not-eligible')
    } else {
      res.redirect('/v19/apply/children-under-four')
    }
  
  })
  // Do you have any children under the age of 4? > Childs first name
  
  router.post('/v19/childs-first-name', function (req, res) {
  
    var childsfirstname = req.session.data['childsfirstname']
    var childslastname = req.session.data['childslastname']

    if (childsfirstname && childslastname) {
      res.redirect('/v19/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/v19/apply/childs-first-name')
    }

  })
     

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v19/childs-date-of-birth', function (req, res) {

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
              
              res.redirect('/v19/apply/children-under-four-answers');          



            } else {
              res.redirect('/v19/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v19/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v19/apply/childs-date-of-birth')
      }


    })
    // Do you have any children under the age of 4? > Do you have another child under four?
  
    router.post('/v19/children-under-four-answers', function (req, res) {
  
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
        res.redirect('/v19/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'JONES') {
        res.redirect('/v19/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'GREEN') {
        res.redirect('/v19/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'BILAL') {
        res.redirect('/v19/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'ELBA') {
        res.redirect('/v19/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'JOHNSON') {
        res.redirect('/v19/apply/kickouts/no-eligible-children')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'BROWN') {
        res.redirect('/v19/apply/kickouts/no-eligible-children')
      }
      else {
        res.redirect('/v19/apply/children-under-four-answers')
      }

    })

  
  
  // What is your email address?
  
  router.post('/v19/email-address', function (req, res) {
  
    var emailaddress = req.session.data['emailaddress']
  
    res.redirect('/v19/apply/mobile-phone-number')
  
  })
  
  // What is your mobile phone number?
  
  router.post('/v19/mobile-phone-number', function (req, res) {
  
    var mobilePhoneNumber = req.session.data['mobilephonenumber']
  
    res.redirect('/v19/apply/check-your-answers')
  
  })
  
  // Contact Preferences
  
  router.post('/v19/contact-preferences', function (req, res) {
  
    var contact = req.session.data['contact']
    var emailAddress = req.session.data['emailaddress']
    var mobile = req.session.data['mobile']
  
    if (contact) {
  
      if (emailAddress || mobile || contact === 'NONE'){
        res.redirect('/v19/apply/bank-details')    
      }
      else {
        res.redirect('/v19/apply/contact-preferences')
      }
  
    }
    else {
      res.redirect('/v19/apply/contact-preferences')
    }
  
  })
  
  // Bank Details
  
  router.post('/v19/bank-details', function (req, res) {
  
    var accountName = req.session.data['accountname']
    var sortCode = req.session.data['sortcode']
    var accountNumber = req.session.data['accountnumber']
  
    if (accountName && sortCode && accountNumber){
      res.redirect('/v19/apply/check-your-answers')    
    }
    else {
      res.redirect('/v19/apply/bank-details')
    }
  
  })
  
  // Feedback
  
  router.post('/v19/feedback', function (req, res) {
    res.redirect('/v19/feedback')
  })


// v19 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v19/check-your-answers', function (req, res) {

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

  if (lastname == 'Green' || lastname == 'Elba') {
    res.redirect('/v19/apply/confirmation-pending-evidence')
  } else if (lastname == 'Blue') {
    res.redirect('/v19/apply/confirmation-pending-evidence')
  } else if (lastname == 'Yellow') {
    res.redirect('/v19/apply/confirmation-pending-evidence')
  } else {
    if (emailAddress) {
  
      if (pregnant === "yes") {
            res.redirect('/v19/apply/confirmation-successful');
      } else {
        res.redirect('/v19/apply/confirmation-successful');
      }
  
    }
    else if (mobilePhoneNumber) {
  
      if (pregnant === "yes") {
        res.redirect('/v19/apply/confirmation-successful');
      } else {
        res.redirect('/v19/apply/confirmation-successful');
      }
  
    } else if (!emailAddress && !mobilePhoneNumber) {
      res.redirect('/v19/apply/confirmation-successful');
    } else {
      res.redirect('/v19/apply/check-your-answers')
    }
  }

})

// **************
// SAVE & RETURN
// **************

// What is your reference number?

router.post('/v19/return-reference-number', function (req, res) {

  var referencenumber = req.session.data['referencenumber']

  if (referencenumber) {
    res.redirect('/v19/apply/return-date-of-birth')
  }
  else {
    res.redirect('/v19/apply/return-reference-number')
  }

})

// What is your date of birth?

router.post('/v19/return-date-of-birth', function (req, res) {

  var returnday = req.session.data['returnday']
  var returnmonth = req.session.data['returnmonth']
  var returnyear = req.session.data['returnyear']
  

  if (returnday && returnmonth && returnyear) {
    res.redirect('/v19/apply/return-task-list')
  }
  else {
    res.redirect('/v19/apply/return-date-of-birth')
  }

})

// Applicant Identity Type

router.post('/v19/return-applicant-identity-select', function (req, res) {

  var applicantidentity = req.session.data['applicantidentity']

  if (applicantidentity) {
    res.redirect('/v19/apply/return-applicant-identity')
  }
  else {
    res.redirect('/v19/apply/return-applicant-identity')
  }

})

// Applicant Identity

router.post('/v19/return-applicant-identity-upload', function (req, res) {

  req.session.data["applicant-identity"] = "Complete";
  
  res.redirect('/v19/apply/return-task-list')

})

// Applicant Eligibility

router.post('/v19/return-applicant-eligibility-upload', function (req, res) {

  req.session.data["applicant-eligibility"] = "Complete";
  
  res.redirect('/v19/apply/return-task-list')

})

// Child Eligibility

router.post('/v19/return-child-eligibility-upload', function (req, res) {

  req.session.data["child-eligibility"] = "Complete";
  
  res.redirect('/v19/apply/return-task-list')

})




// Online Account



router.post('/v19/online-account', function (req, res) {
  
  var onlineAccount = req.session.data['onlineaccount']

  if (onlineAccount) {
    res.redirect('/v19/apply/email-address')
  } else {
    res.redirect('/v19/apply/online-account')
  }

})


// What is your email address 2?

router.post('/v19/email-address-2', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v19/apply/mobile-phone-number')

})


// Email text box




// Keep at the bottom of the file
  module.exports = router;