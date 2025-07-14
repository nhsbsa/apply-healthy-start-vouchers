// ********************************
// APPLY (v26-ecj)
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





// Where do you live?


router.post('/v26-ecj/where-do-you-live', function (req, res) {

      
  var location = req.session.data['location']

  if (location === "england or wales") {
    res.redirect('/v26-ecj/apply/what-update-nhs-login')
  }
  if (location === "northern ireland") {
    res.redirect('/v26-ecj/before-you-start-ni')
  }
  if (location === "somewhere else") {
    res.redirect('/v26-ecj/apply/kickouts/not-eligible-country')
  }

  })




// What update would you like to make to your claim? (NHS LOGIN)


router.post('/v26-ecj/what-update-nhs-login', function (req, res) {

  var whatupdate = req.session.data['whatupdate']

  if (whatupdate === "add-pregnancy") {
    res.redirect('/v26-ecj/apply/are-you-pregnant-nhs-login')
  }
  else if (whatupdate === "add-baby-child") {
    res.redirect('/v26-ecj/nhs-login/before-you-start-nhs-login-child') 
  }  
  else if (whatupdate === "card-issue") {
    res.redirect('/v26-ecj/apply/kickouts/card-issue') 
  }  
  else {
    res.redirect('/v26-ecj/apply/kickouts/call-us-to-update') 
  }   

  })



// What update would you like to make to your claim? (NI)


router.post('/v26-ecj/what-update-ni', function (req, res) {

  var whatupdate = req.session.data['whatupdate']

  if (whatupdate === "add-pregnancy") {
    res.redirect('/v26-ecj/apply/are-you-pregnant-ni')
  }
  else if (whatupdate === "add-baby-child") {
    res.redirect('/v26-ecj/apply/national-insurance-number-ni') 
  }  
  else if (whatupdate === "card-issue") {
    res.redirect('/v26-ecj/apply/kickouts/card-issue') 
  }  
  else {
    res.redirect('/v26-ecj/apply/kickouts/call-us-to-update') 
  }   

  })








  // Do you know your NHS Number? - NHS LOGIN -
  

 
router.post('/v26-ecj/nhs-login/nhs-number', function (req, res) {

  var nhsnumber = req.session.data['nhsnumber']; 

  if (nhsnumber === "yes") {
    res.redirect('/v26-ecj/nhs-login/date-of-birth')
  }
    if (nhsnumber === "no") {
      res.redirect('/v26-ecj/nhs-login/name')
    }


})





  // Enter your date of birth - NHS LOGIN -


router.post('/v26-ecj/nhs-login/date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
  var dateofbirth = moment(dob).format('MM/DD/YYYY');
  req.session.data['dateofbirth'] = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(dateofbirth))

  
res.redirect('/v26-ecj/nhs-login/postcode');

  })





  // Enter your full name - NHS LOGIN -


router.post('/v26-ecj/nhs-login/name', function (req, res) {

  
res.redirect('/v26-ecj/nhs-login/date-of-birth');

  })






// Enter your postcode - NHS LOGIN -

router.post('/v26-ecj/nhs-login/postcode', function (req, res) {

  
res.redirect('/v26-ecj/nhs-login/check-your-details');

  })






// Check your details - NHS LOGIN -

router.post('/v26-ecj/nhs-login/check-your-details', function (req, res) {

  
res.redirect('/v26-ecj/apply/check-your-answers-nhs-login');

  })









// Are you more than 10 weeks pregnant? (NHS LOGIN)


router.post('/v26-ecj/are-you-pregnant-nhs-login', function (req, res) {

  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes") {
    res.redirect('/v26-ecj/nhs-login/before-you-start-nhs-login')
  }
  else if (pregnant === "no") {
    res.redirect('/v26-ecj/apply/kickouts/not-pregnant')
  }
   
  })



// Are you more than 10 weeks pregnant? (NI)


router.post('/v26-ecj/are-you-pregnant-ni', function (req, res) {

  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes") {
    res.redirect('/v26-ecj/apply/national-insurance-number-ni')
  }
  else if (pregnant === "no") {
    res.redirect('/v26-ecj/apply/kickouts/not-pregnant')
  }
   
  })





  // What is your National insurance number?
  
router.post('/v26-ecj/national-insurance-number-ni', function (req, res) {


  var nationalinsurancenumberupdate = req.session.data['nationalinsurancenumberupdate']
  var checkbox = req.session.data['checkbox']


  if (nationalinsurancenumberupdate) { 
    res.redirect('/v26-ecj/apply/date-of-birth') 
  } 
  
  else if (checkbox.checked = true) { 
    res.redirect('/v26-ecj/apply/kickouts/no-nino')  
  } 

})


 
  // Before you start (NHS Login) (Add a new preg)


  router.post('/v26-ecj/nhs-login/before-you-start-nhs-login', function (req, res) {

    res.redirect('/v26-ecj/nhs-login/email-address');
  
  })


  // Before you start (NHS Login) (Add a new baby or child)


  router.post('/v26-ecj/nhs-login/before-you-start-nhs-login-child', function (req, res) {

    res.redirect('/v26-ecj/nhs-login/email-address');
  
  })

  


  


  // What is your NHS Number?
  

 
  router.post('/v26-ecj/nhs-login/nhs-number', function (req, res) {


    var nhsnumber = req.session.data['nhsnumber']
    var checkbox = req.session.data['checkbox']
  
  
    if (nhsnumber) { 
      res.redirect('/v26-ecj/nhs-login/date-of-birth') 
    } 
    
    else if (checkbox === "donotknow") { 
      res.redirect('/v26-ecj/nhs-login/name')  
    } 
  
  })
  



  // NHS Login - What is your address 2? (== Select your address)

  router.post('/v26-ecj/nhs-login/select-address', function (req, res) {

    res.redirect('/v26-ecj/apply/check-your-answers-nhs-login');
  
  })




  // Check your answers (== after NHS Login)

  router.post('/v26-ecj/apply/cya-nhs-login', function (req, res) {

    var information = req.session.data['information']
    
    
    if (information === "yes") {
      res.redirect('/v26-ecj/apply/national-insurance-number-nhs-login');
    }
    else if (information === "no") {
      res.redirect('/v26-ecj/apply/kickouts/contact-your-gp')
    }
    else {
      res.redirect('/v26-ecj/apply/cya-nhs-login')
    }

  })





  // What is your National Insurance number? (== after NHS Login)


  router.post('/v26-ecj/national-insurance-number-nhs-login', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber == 'AB123456C') {
      res.redirect('/v26-ecj/apply/due-date')
    } 
    else if (nationalinsurancenumber == 'CD123456E') {
      res.redirect('/v26-ecj/apply/childs-first-name')
    } 
    else {
      res.redirect('/v26-ecj/apply/due-date')
    }

  })



  // Check your answers (NINO and DOB)

  router.post('/v26-ecj/apply/check-your-answers-nino', function (req, res) {
  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
  if (nationalinsurancenumber == 'AB123456C') {
    res.redirect('/v26-ecj/apply/due-date')
  } 
  else if (nationalinsurancenumber == 'CD123456E') {
    res.redirect('/v26-ecj/apply/childs-first-name')
  } 
  else {
    res.redirect('/v26-ecj/apply/due-date')
  } 
})



// What is your due date?

router.post('/v26-ecj/due-date', function (req, res) {

  
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
          res.redirect('/v26-ecj/apply/due-date')
          console.log('IF IS RUNNING HERE')
        } else if (duedate > fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
          res.redirect('/v26-ecj/apply/childs-first-name')
          console.log('ELSE IF IS RUNNING HERE')
        } else {
    
          if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
            req.session.data.lessThanTenWeeksPregnant = true;
            console.log('LESS THAN 10 WEEKS')
          } else {
            req.session.data.lessThanTenWeeksPregnant = false;
            console.log('MORE THAN 10 WEEKS')
          }
    
          res.redirect('/v26-ecj/apply/check-your-answers-due-date')
        }
    
      }
      else {
        res.redirect('/v26-ecj/apply/check-your-answers-due-date')
      }
    
    })







// Check your answers - due date

router.post('/v26-ecj/check-your-answers-due-date', function (req, res) {

  res.redirect('/v26-ecj/apply/pregnancy-terms-and-conditions');

})



// Enter your new child’s name

  
router.post('/v26-ecj/childs-first-name', function (req, res) {
  
  var childsfirstname = req.session.data['childsfirstname'].trim().toUpperCase()
  var childslastname = req.session.data['childslastname'].trim().toUpperCase()



  if (childsfirstname == 'BEN' && childslastname == 'JONES') {  
    res.redirect('/v26-ecj/apply/childs-date-of-birthe');  // removing one child scenario but this does not work
  }
  else if (childsfirstname == 'RILEY' && childslastname == 'JONES') {
    res.redirect('/v26-ecj/apply/childs-date-of-birth') 
  }
  else if (childsfirstname == 'CHARLIE' && childslastname == 'SMITH') {
    res.redirect('/v26-ecj/apply/childs-date-of-birth') 
  }
  else {
    res.redirect('/v25/PAGE-DOESNT-EXIST'); 
  }
});





// What is child's date of birth?

  router.post('/v26-ecj/childs-date-of-birth', function (req, res) {

    
    var childsdateofbirthday = req.session.data['childsdateofbirthday'] || '';
    var childsdateofbirthmonth = req.session.data['childsdateofbirthmonth'] || '';
    var childsdateofbirthyear = req.session.data['childsdateofbirthyear'] || '';

    var childsdateofbirth = moment(childsdateofbirthday + '-' + childsdateofbirthmonth + '-' + childsdateofbirthyear, 'DD-MM-YYYY').format('YYYY-MM-DD');
    var childsdateofbirthDisplay = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: 'numeric'}).format(new Date(childsdateofbirth))

    var today = moment().format('YYYY-MM-DD');
    var fouryearsfromtoday = moment().subtract(4, 'years').format('YYYY-MM-DD');

    console.log('Childs DOB: '+ childsdateofbirth);
    console.log('Today: '+ today);
    console.log('Four years from today: '+ fouryearsfromtoday);


    
    if (childsdateofbirthday && childsdateofbirthmonth && childsdateofbirthyear) {
      var dobString = `${childsdateofbirthday}-${childsdateofbirthmonth}-${childsdateofbirthyear}`; // chae
      var childsdateofbirth = moment(dobString, 'DD-MM-YYYY').format('YYYY-MM-DD'); // chae
      // continue as normal...
      
      if (moment(childsdateofbirth).isBefore(today)) {

          if (moment(childsdateofbirth).isAfter(fouryearsfromtoday)) {

            let childList = req.session.data.childList;
            if (!Array.isArray(childList)) {
                childList = [];
            }
            
            // Create a variable of the posted information
            
            const childsfirstname = req.session.data['childsfirstname'];
            const childsmiddlename = req.session.data['childsmiddlename'];
            const childslastname = req.session.data['childslastname'];
            
            // Add the posted information into the 'childList' array
            
            childList.push({ 
                "ChildsFirstName": childsfirstname,
                "ChildsMiddleName" : childsmiddlename,
                "ChildsLastName": childslastname,
                "ChildsDOB": childsdateofbirthDisplay
            });



            // Access the last child within childList
            let childListIndex = childList.length - 1;
            let lastChild = childList[childListIndex];
            if (!Array.isArray(lastChild)) {
              lastChild = [lastChild];
            }
            
            req.session.data.childList = lastChild;
            
            console.log('childList:', childList);
            console.log('Number of children:', childList.length);


            req.session.data.childList = childList;
            
            console.log(childList);
            console.log('Number of children:', childList.length);
            


            res.redirect('/v26-ecj/apply/children-under-four-answers'); 

          } else {
            res.redirect('/v26-ecj/apply/childs-date-of-birth')
          }

      } else {
        res.redirect('/v26-ecj/apply/childs-date-of-birth')
      }
      
    }
    else {
      res.redirect('/v26-ecj/apply/childs-date-of-birth')
    }


    })





  // Check your new children’s details
  router.post('/v26-ecj/children-under-four-answers', function (req, res) {
    var addanother = req.session.data['addanother'];
  
    var dateofbirthday = req.session.data['dateofbirthday'];
    var dateofbirthmonth = req.session.data['dateofbirthmonth'];
    var dateofbirthyear = req.session.data['dateofbirthyear'];
    var pregnant = req.session.data['pregnant'];
    var childrenunderfour = req.session.data['childrenunderfour'];
  
    var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
    var today = new Date();
    var ageDate = new Date(today - dob.getTime());
    var temp = ageDate.getFullYear();
    var yrs = Math.abs(temp - 1970);
  
    // Safe check for lastname
    var lastnameRaw = req.session.data['lastname'];
    var lastname = lastnameRaw ? lastnameRaw.trim().toUpperCase() : '';
  
    if (addanother === "yes") {
      res.redirect('/v26-ecj/apply/childs-first-name');
    } else if (addanother === "no" && lastname === 'JONES') {
      res.redirect('/v26-ecj/apply/check-your-answers-add-baby-child');
    } else if (addanother === "no") {
      res.redirect('/v26-ecj/apply/check-your-answers-add-baby-child');
    }
  });









// Check your answers 
router.post('/v26-ecj/check-your-answers-add-baby-child', function (req, res) {

  var childsFirstName = req.session.data['childsfirstname'].trim().toUpperCase()
  var childsLastName = req.session.data['childslastname'].trim().toUpperCase()

  
  if (childsFirstName == 'CHARLIE' && childsLastName == 'SMITH') { 
    res.redirect('/v26-ecj/apply/child-terms-and-conditions'); 
  } 
  else if (childsFirstName == 'RILEY' && childsLastName == 'JONES') {
    req.session.data = {}
    res.redirect('/v26-ecj/apply/child-terms-and-conditions');
  
  } else {
    res.redirect('/v26-ecj/apply/child-terms-and-conditions');
  }
});






  
  // What is your date of birth?
  
router.post('/v26-ecj/date-of-birth', function (req, res) {

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
      res.redirect('/v26-ecj/apply/kickouts/under-sixteen-signpost')
    } else {
      res.redirect('/v26-ecj/apply/nino-answers');
    }
  } else {
    res.redirect('/v26-ecj/apply/date-of-birth')
  }


})






// Is your mobile number correct?

router.post('/v26-ecj/get-your-security-code', function (req, res) {

  var getyoursecuritycode = req.session.data['getyoursecuritycode']

  if (getyoursecuritycode === "yes") {
    res.redirect('/v26-ecj/apply/security-code-text-message')
  }
  else if (getyoursecuritycode === "no") {
    res.redirect('/v26-ecj/apply/kickouts/changed-phone-number') 
  }   

  })












  // Check your phone

  router.post('/v26-ecj/apply/security-code-text-message', function (req, res) {


  var securityCode = req.session.data['securityCode']
  

  if (securityCode == '111111') {
    res.redirect('/v26-ecj/apply/due-date')
  } 
  else if (securityCode == '222222') {
    res.redirect('/v26-ecj/apply/childs-first-name')
  } 
  else {
    res.redirect('/v26-ecj/apply/PAGE-DOESNT-EXIST')
  } 
})

  







// What is your name?

router.post('/v25/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v25/apply/postcode')
  }
  else {
    res.redirect('/v25/apply/name')
  }

})
  
  // What is your address?
  
  router.post('/v25/address', function (req, res) {
  
    delete req.session.data['selectaddress']
  
    var addressline1 = req.session.data['addressline1']
    var addressline2 = req.session.data['addressline2']
    var towncity = req.session.data['towncity']
    var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
  
    if (addressline1 && towncity && postcode) {
      res.redirect('/v25/apply/national-insurance-number')
    } else {
      res.redirect('/v25/apply/address')
    }
  
  })

  // What is your postcode?
  
  router.post('/v25/postcode', function (req, res) {

    res.redirect('/v25/apply/address-2');
  
  })

  // What is your address 2?

  router.post('/v25/apply/address-2', function (req, res) {

    res.redirect('/v25/apply/national-insurance-number');
  
  })

  
  // What is your national insurance number?
  
  router.post('/v25/national-insurance-number', function (req, res) {

    var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
    if (nationalinsurancenumber) {
      res.redirect('/v25/apply/check-your-answers-personal-details')
    } else {
      res.redirect('/v25/apply/national-insurance-number')
    }

  })

  // Check your answers - personal details

  router.post('/v25/cya-personal-details', (req, res) => {

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
        res.redirect('/v25/apply/are-you-pregnant')
      } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
        res.redirect('/v25/apply/are-you-pregnant')
      } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
        res.redirect('/v25/apply/are-you-pregnant')
      } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
        res.redirect('/v25/apply/are-you-pregnant')
      } else if (firstname == 'ANITA' && lastname == 'BILAL' && nationalinsurancenumber == 'QR123456I' && dateofbirth == '01/01/1999' && postcode == 'NE333PT' && addressline1 == '10 BROADWAY') {
        res.redirect('/v25/apply/are-you-pregnant') 
      } else if (firstname == 'MALIA' && lastname == 'ELBA' && nationalinsurancenumber == 'ST123456L' && dateofbirth == '01/01/1999' && postcode == 'NE333ST' && addressline1 == '15 MELBOURNE') {
        res.redirect('/v25/apply/are-you-pregnant')
      } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
        res.redirect('/v25/apply/kickouts/confirmation-no-match')
      } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
        res.redirect('/v25/apply/kickouts/confirmation-no-match')
      } else if (firstname == 'SARAH' && lastname == 'GREEN' && nationalinsurancenumber == 'MN987544G' && postcode == 'NR334GP' && addressline1 == '13 PALM ROAD') {
        if (yrs >= 16) {
          res.redirect('/v25/apply/benefits')
        }
      } else {
        res.redirect('/v25/apply/kickouts/confirmation-no-match')
      }  
    }
    else {
      res.redirect('/v25/apply/national-insurance-number')
    }
    
  })


  // Do you have a current Healthy Start claim?

  router.post('/v25/current-claim', function (req, res) {

    var currentclaim = req.session.data['currentclaim']

    if (currentclaim === "no") {
      res.redirect('/v25/before-you-start-apply-now')
    }
    else if (currentclaim === "yes") {
      res.redirect('/v25/before-you-start-manage')
    }
    else {
      res.redirect('/v25/apply/kickouts/card-issue')
    }

    })


  // What change do you need to make to your claim?

   

  router.post('/v25/what-change', function (req, res) {

    var whatchange = req.session.data['whatchange']

    if (whatchange === "add-pregnancy") {
      res.redirect('/v25/apply/are-you-pregnant-update')
    }
    else if (whatchange === "add-baby-child") {
      res.redirect('/v25/apply/national-insurance-number-update-3') 
    }  
    else if (whatchange === "card-issue") {
      res.redirect('/v25/apply/kickouts/card-issue') 
    }  
    else {
      res.redirect('/v25/apply/kickouts/call-us-to-update') 
    }   

    })




// (update) What is your National Insurance number? (ROUTE: ADD A NEW PREGNANCY + YES CONTACTS)


router.post('/v25/national-insurance-number-update-1', function (req, res) {


  var nationalinsurancenumberupdate = req.session.data['nationalinsurancenumberupdate']
  var checkbox = req.session.data['checkbox']


  if (nationalinsurancenumberupdate) { 
    res.redirect('/v25/apply/date-of-birth-update') 
  } 
  
  else if (checkbox.checked = true) { 
    res.redirect('/v25/apply/kickouts/no-nino')  
  } 




})






// (update) What is your National Insurance number? (ROUTE: ADD A NEW PREGNANCY - NO CONTACTS)


router.post('/v25/national-insurance-number-update-2', function (req, res) {

  var nationalinsurancenumberupdate = req.session.data['nationalinsurancenumberupdate']
  var checkbox = req.session.data['checkbox']
   
 
  if (nationalinsurancenumberupdate) { 
    res.redirect('/v25/apply/get-your-security-code') 
  } 
  
  else if (checkbox.checked = true) { 
    res.redirect('/v25/apply/date-of-birth-update-2')  
  } 
 


})






// (update) What is your National Insurance number? (ROUTE: ADD A NEW BABY OR CHILD + YES CONTACTS)


router.post('/v25/national-insurance-number-update-3', function (req, res) {

  var nationalinsurancenumberupdate = req.session.data['nationalinsurancenumberupdate']
  var checkbox = req.session.data['checkbox']


  if (nationalinsurancenumberupdate) { 
    res.redirect('/v25/apply/date-of-birth-update-3') 
  }

  else if (checkbox.checked = true) { 
    res.redirect('/v25/apply/kickouts/no-nino')
  } 



})


// (testing route) Get your security code 

router.post('/v25/get-your-security-code-3', function (req, res) {

  var getyoursecuritycode = req.session.data['getyoursecuritycode']

  if (getyoursecuritycode === "email") {
    res.redirect('/v25/apply/security-code-email-2')
  }
  else if (getyoursecuritycode === "textmessage") {
    res.redirect('/v25/apply/security-code-text-message-2') 
  }   

  })

 





  // (update) What is child's date of birth? > childs date of birth (MAY 2024 TESTING ROUTE)


  router.post('/v25/childs-date-of-birth-update-yes', function (req, res) {

    
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

            let childList = req.session.data.childList;
            if (!Array.isArray(childList)) {
                childList = [];
            }
            
            // Create a variable of the posted information
            
            const childsfirstname = req.session.data['childsfirstname'];
            const childsmiddlename = req.session.data['childsmiddlename'];
            const childslastname = req.session.data['childslastname'];
            
            // Add the posted information into the 'childList' array
            
            childList.push({ 
                "ChildsFirstName": childsfirstname,
                "ChildsMiddleName" : childsmiddlename,
                "ChildsLastName": childslastname,
                "ChildsDOB": childsdateofbirthDisplay
            });




            req.session.data.childList = childList;
            
            console.log(childList);
            console.log('Number of children:', childList.length);
            



            // Redirect to the 'Do you get another?' page
            
            
            res.redirect('/v25/apply/children-under-four-answers-update-yes'); 

          } else {
            res.redirect('/v25/apply/childs-date-of-birth-update')
          }

      } else {
        res.redirect('/v25/apply/childs-date-of-birth-update')
      }
      
    }
    else {
      res.redirect('/v25/apply/childs-date-of-birth-update')
    }


    })















// (update) What is your date of birth? (ROUTE: ADD A NEW PREGNANCY - NO CONTACTS)

router.post('/v25/date-of-birth-update-2', function (req, res) {

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
      res.redirect('/v25/apply/kickouts/under-sixteen-signpost')
    } else {
      res.redirect('/v25/apply/name-update-2');
    }
  } else {
    res.redirect('/v25/apply/date-of-birth-update-2')
  }


})





// (update) What is your date of birth? (ROUTE: ADD A BABY OR CHILD - YES CONTACTS)

router.post('/v25/date-of-birth-update-3', function (req, res) {

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
      res.redirect('/v25/apply/kickouts/under-sixteen-signpost')
    } 
    else if (dateofbirthday == '31' && dateofbirthmonth == '10' && dateofbirthyear == '1996') {
      res.redirect('/v25/apply/nino-answers-3'); //testing scenario for duplicate phone numbers found
    
    } else {
      res.redirect('/v25/apply/nino-answers-2');
    }
  } else {
    res.redirect('/v25/apply/date-of-birth-update-3')
  }


})





// (update) What is your date of birth? (ROUTE: ADD A BABY OR CHILD - NO CONTACTS)

router.post('/v25/date-of-birth-update-4', function (req, res) {

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
      res.redirect('/v25/apply/kickouts/under-sixteen-signpost')
    } else {
      res.redirect('/v25/apply/name-update-4');
    }
  } else {
    res.redirect('/v25/apply/date-of-birth-update-4')
  }


})





// (update) What is your name? (ROUTE: ADD A NEW PREGNANCY - YES CONTACTS)

router.post('/v25/name-update', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v25/apply/postcode-update')
  }
  else {
    res.redirect('/v25/apply/name-update')
  }

})

// (update) What is your name? (ROUTE: ADD A NEW PREGNANCY - NO CONTACTS)

router.post('/v25/name-update-2', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v25/apply/postcode-update-2')
  }
  else {
    res.redirect('/v25/apply/name-update-2')
  }

})





// (update) What is your name? (ROUTE: ADD A NEW BABY OR CHILD - YES CONTACTS)

router.post('/v25/name-update-3', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v25/apply/postcode-update-3')
  }
  else {
    res.redirect('/v25/apply/name-update-3')
  }

})







// (update) What is your name? (ROUTE: ADD A NEW BABY OR CHILD - NO CONTACTS)

router.post('/v25/name-update-4', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v25/apply/postcode-update-4')
  }
  else {
    res.redirect('/v25/apply/name-update-4')
  }

})




 // (update) What is your postcode? (ROUTE: ADD A NEW PREGNANCY - YES CONTACTS)

 router.post('/v25/postcode-update', function (req, res) {

  res.redirect('/v25/apply/address-2-update');

})



  


 // (update) What is your postcode? (ROUTE: ADD A NEW PREGNANCY - NO CONTACTS)

 router.post('/v25/postcode-update-2', function (req, res) {

  res.redirect('/v25/apply/address-2-update-without-cv');

})

  



 // (update) What is your postcode? (ROUTE: ADD A NEW BABY OR CHILD - YES CONTACTS)

 router.post('/v25/postcode-update-3', function (req, res) {

  res.redirect('/v25/apply/address-2-update-2');

})

  



 // (update) What is your postcode? (ROUTE: ADD A NEW BABY OR CHILD - NO CONTACTS)

 router.post('/v25/postcode-update-4', function (req, res) {

  res.redirect('/v25/apply/address-2-update-without-cv-2');

})

  





 // (update) What is your address 2? (ROUTE: ADD A NEW PREGNANCY - YES CONTACTS)

 router.post('/v25/address-2-update', function (req, res) {

  res.redirect('/v25/apply/personal-details-answers-update');

})



 


// (update) What is your address 2?  (ROUTE: ADD A NEW PREGNANCY - NO CONTACTS)

router.post('/v25/address-2-update-without-cv', function (req, res) {

  res.redirect('/v25/apply/check-your-answers-no-nino-pregnancy'); 
  // somehow this doesn't work but the link works in html.. so, go and check

})



// (update) What is your address 2? (ROUTE: ADD A NEW BABY OR CHILD - YES CONTACTS)

router.post('/v25/address-2-update-2', function (req, res) {

  res.redirect('/v25/apply/personal-details-answers-update-2'); 
   

})





// (update) What is your address 2? (ROUTE: ADD A NEW BABY OR CHILD - NO CONTACTS)

router.post('/v25/address-2-update-without-cv-2', function (req, res) {

  res.redirect('/v25/apply/check-your-answers-no-nino-2'); 
   // somehow this doesn't work but the link works in html.. so, go and check

})



// Check your answers (add a new pregnancy with no NINO)


router.post('/v25/apply/check-your-answers-no-nino', function (req, res) {

  var firstname = req.session.data['firstname'].trim().toUpperCase()
  var lastname = req.session.data['lastname'].trim().toUpperCase()

  if (firstname == 'SUSAN' && lastname == 'JONES') { 
    res.redirect('/v25/apply/kickouts/overlapping-pregnancies'); //scenario 2
  } 
  else if (firstname == 'MATTHEW' && lastname == 'GLASS') {
    res.redirect('/v25/apply/kickouts/contact-us-update'); //scenario 5
  } 
  else if (firstname == 'SOPHIA' && lastname == 'BILAL') {
    res.redirect('/v25/apply/kickouts/unsuccessful-check-details'); //scenario 6
  } 
  else if (firstname == 'HELEN' && lastname == 'MILLER') {
    res.redirect('/v25/apply/kickouts/cannot-update-online'); //scenario 7
  } 
  else {
    res.redirect('/v25/apply/get-your-security-code'); // If name is none of the 4 listed, go here
  }
});

  





// (update) Check your answers = personal details (ROUTE: ADD A NEW PREGNANCY - YES CONTACTS)

router.post('/v25/apply/personal-details-answers-update', function (req, res) {

  res.redirect('/v25/apply/get-your-security-code');

})

 

 // (update) Check your answers = personal details (ROUTE: ADD A NEW BABY OR CHILD - YES CONTACTS)

 router.post('/v25/apply/personal-details-answers-update-2', function (req, res) {

  res.redirect('/v25/apply/get-your-security-code-2');

})



// Get your security code (ROUTE: ADD A NEW BABY OR CHILD)

router.post('/v25/get-your-security-code-2', function (req, res) {

  var getyoursecuritycode = req.session.data['getyoursecuritycode']

  if (getyoursecuritycode === "yes") {
    res.redirect('/v25/apply/security-code-text-message-2')
  }
  else if (getyoursecuritycode === "no") {
    res.redirect('/v25/apply/kickouts/changed-phone-number') 
  }   

  })



// Enter your security code (ROUTE: ADD A NEW PREGNANCY)
 
    router.post('/v25/security-code-email', function (req, res) {

      res.redirect('/v25/apply/due-date-update');
    
    })
  
    router.post('/v25/security-code-text-message', function (req, res) {

      res.redirect('/v25/apply/due-date-update');
    
    })

    



// Enter your security code (ROUTE: ADD A NEW BABY OR CHILD)
 
router.post('/v25/security-code-email-2', function (req, res) {

  res.redirect('/v25/apply/childs-first-name-update');

})

router.post('/v25/security-code-text-message-2', function (req, res) {

  res.redirect('/v25/apply/childs-first-name-update');

})





 



  // (update) children under 4 years old > answers (ROUTE: ADD A NEW BABY OR CHILD) (MAY 2024 TESTING ROUTE)
    
    router.post('/v25/children-under-four-answers-update-yes-yes', function (req, res) {
 

      var addanother = req.session.data['addanother']
    
      if (addanother === "yes") {
        res.redirect('/v25/PAGE-DOESNT-EXIST')
      }
      else if (addanother === "no") {
        res.redirect('/v25/apply/check-your-answers-add-baby-child-yes')
      }  
      
      
      });



// (testing) check your answers 
router.post('/v25/check-your-answers-add-baby-child', function (req, res) {

  var childsFirstName = req.session.data['childsfirstname'].trim().toUpperCase()
  var childsLastName = req.session.data['childslastname'].trim().toUpperCase()

  if (childsFirstName == 'CHARLIE' && childsLastName == 'SMITH') { 
    res.redirect('/v25/apply/child-terms-and-conditions-yes'); //scenario 1
  } 
  else if (childsFirstName == 'RILEY' && childsLastName == 'JONES') {
    req.session.data = {}
    res.redirect('/v25/apply/child-terms-and-conditions'); //as we added T&C before the end screen 
    //res.redirect('/v25/apply/kickouts/request-completed-child'); //scenario 4
  
  } else {
    res.redirect('/v25/apply/child-terms-and-conditions');
    //res.redirect('/v25/PAGE-DOESNT-EXIST'); // If name is none of the 2 listed, go here
  }
});











  // (update) Check your answer (ROUTE: ADD A NEW BABY OR CHILD) 

    router.post('/v25/cya-personal-add-baby-child', function (req, res) {

    res.redirect('/v25/apply/kickouts/request-completed-child');

  })
  



  // (update) Are you more than 10 weeks pregnant? (ROUTE: ADD A NEW PREGNANCY)


  router.post('/v25/are-you-pregnant-update', function (req, res) {

    var pregnant = req.session.data['pregnant']
  
    if (pregnant === "yes") {
      res.redirect('/v25/apply/national-insurance-number-update-1')
    }
    else if (pregnant === "no") {
      res.redirect('/v25/apply/kickouts/not-pregnant')
    }
     
    })




  // (update) what is your due date? (ROUTE: ADD A NEW PREGNANCY)

  router.post('/v25/due-date-update', function (req, res) {
  
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
        res.redirect('/v25/apply/due-date-update')
        console.log('IF IS RUNNING HERE')
      } else if (duedate > fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
        res.redirect('/v25/apply/childs-first-name-update')
        console.log('ELSE IF IS RUNNING HERE')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
          console.log('LESS THAN 10 WEEKS')
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
          console.log('MORE THAN 10 WEEKS')
        }
  
        res.redirect('/v25/apply/due-date-answers-update')
      }
  
    }
    else {
      res.redirect('/v25/apply/due-date-answers-update')
    }
  
  })







  
  // (update) Check your answers (pregancy details) (ROUTE: ADD A NEW PREGNANCY)


  router.post('/v25/due-date-answers-update', function (req, res) {

     
      res.redirect('/v25/apply/kickouts/request-completed-pregnancy');
      // somehow this doesn't work but the link works in html.. so, go and check
    
    })
    
    



  // (update) another change (PARKED / NEXT ITERATION)

  router.post('/v25/another-change', function (req, res) {

    var anotherchange = req.session.data['anotherchange']

    if (anotherchange === "pregnant") {
      res.redirect('/v25/apply/are-you-pregnant-update')
    }
    else if (anotherchange === "baby-or-child") {
      res.redirect('/v25/apply/childs-first-name-update') 
    }  
    else if (anotherchange === "personal-details") {
      res.redirect('/v25/apply/another-change') 
    } 
    else if (anotherchange === "childrens-details") {
      res.redirect('/v25/apply/another-change') 
    } 
    else {
      res.redirect('/v25/apply/kickouts/request-completed') 
    }   

    })








    
  
  // Are you pregnant?
  
  router.post('/v25/are-you-pregnant', function (req, res) {
  
    var pregnant = req.session.data['pregnant']
    var benefits = req.session.data['benefits']
    var typeOfESA = req.session.data['ESA']
    const applicantsAge = req.session.applicantAge
  
    if (pregnant === "yes") {
      res.redirect('/v25/apply/due-date')
    }
    else if (pregnant === "no") {
      req.session.data.lessThanTenWeeksPregnant = true;

      if (benefits === 'ESA' && typeOfESA === 'income') {
        res.redirect('/v25/apply/kickouts/not-eligible')
      } else if (benefits === 'NONE' && applicantsAge <= 18) {
        res.redirect('/v25/apply/kickouts/not-eligible')
      } else {
        res.redirect('/v25/apply/children-under-four')
      }

    }
    else {
      res.redirect('/v25/apply/are-you-pregnant')
    }
  
  })
  
  // Are you pregnant? > Due Date
  
  router.post('/v25/due-date', function (req, res) {
  
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
        res.redirect('/v25/apply/due-date')
        console.log('IF IS RUNNING HERE')
      } else if (duedate > fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
        res.redirect('/v25/apply/children-under-four')
        console.log('ELSE IF IS RUNNING HERE')
      } else {
  
        if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
          req.session.data.lessThanTenWeeksPregnant = true;
          console.log('LESS THAN 10 WEEKS')
        } else {
          req.session.data.lessThanTenWeeksPregnant = false;
          console.log('MORE THAN 10 WEEKS')
        }
  
        res.redirect('/v25/apply/children-under-four')
      }
  
    }
    else {
      res.redirect('/v25/apply/due-date')
    }
  
  })
  // Do you have any children under 4 years old?
  
  router.post('/v25/children-under-four', function (req, res) {
  
    var childrenunderfour = req.session.data['childrenunderfour']
    var pregnant = req.session.data['pregnant']

    var lessThan10WeeksPregnant = req.session.data.lessThanTenWeeksPregnant

    if (lessThan10WeeksPregnant == true && childrenunderfour == 'no') {
      res.redirect('/v25/apply/kickouts/confirmation-no-pregnancy-no-children')
    } else if (pregnant === "yes" && childrenunderfour === "no") {
      console.log('variable:' + '' + lessThan10WeeksPregnant)
      res.redirect('/v25/apply/email-address')
    } else if (pregnant === "no" && childrenunderfour === "yes") {
      res.redirect('/v25/apply/childs-first-name')
    } else if (pregnant === "yes" && childrenunderfour === "yes") {
      res.redirect('/v25/apply/childs-first-name')
    } else if (childrenunderfour === "no" && pregnant ==="no") {
      res.redirect('/v25/apply/kickouts/confirmation-no-pregnancy-no-children')
    } else {
      res.redirect('/v25/apply/children-under-four')
    } 
  
  })
  // Do you have any children under the age of 4? > Childs first name
  
  router.post('/v25/childs-first-name', function (req, res) {
  
    var childsfirstname = req.session.data['childsfirstname']
    var childslastname = req.session.data['childslastname']

    if (childsfirstname && childslastname) {
      res.redirect('/v25/apply/childs-date-of-birth')
    }
    else {
      res.redirect('/v25/apply/childs-first-name')
    }

  })
     

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v25/childs-date-of-birth', function (req, res) {

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

              let childList = req.session.data.childList;
              if (!Array.isArray(childList)) {
                  childList = [];
              }
              
              // Create a variable of the posted information
              
              const childsfirstname = req.session.data['childsfirstname'];
              const childslastname = req.session.data['childslastname'];
              
              // Add the posted information into the 'childList' array
              
              childList.push({
                  "ChildsFirstName": childsfirstname,
                  "ChildsLastName": childslastname,
                  "ChildsDOB": childsdateofbirthDisplay
              });
              
              req.session.data.childList = childList;
              
              console.log(childList);
              console.log('Number of children:', childList.length);
              
              // Redirect to the 'Do you get another?' page
              
              res.redirect('/v25/apply/children-under-four-answers'); 

            } else {
              res.redirect('/v25/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v25/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v25/apply/childs-date-of-birth')
      }


    })
   
    // Do you want to remove this child? 

    
    router.post('/v25/remove-child', function (req, res) {
  
      var removeChild = req.session.data['removechild'] 
    
       if (removeChild === "yes") { 
        res.redirect('/v25/apply/childs-first-name-update');
        req.session.data = {};
      //}

      //if (removeChild === "yes" && req.session.data.childList) {
      //  res.redirect('/v25/apply/childs-first-name-update');
        
      } else if (removeChild === "no") {
        res.redirect('/v25/apply/children-under-four-answers-update')
      } else {
        res.redirect('/v25/apply/children-under-four-answers-update')
      }
    
    })
 


  
    // Do you want to remove this child? (MAY 2024 TESTING ROUTE)

    
    router.post('/v25/remove-child-yes', function (req, res) {
  
      var removeChild = req.session.data['removechild'] 
    
       if (removeChild === "yes") { 
        res.redirect('/v25/apply/children-under-four-answers-update-yes-yes');
        req.session.data = {};
      //}

      //if (removeChild === "yes" && req.session.data.childList) {
      //  res.redirect('/v25/apply/childs-first-name-update');
        
      } else if (removeChild === "no") {
        res.redirect('/v25/apply/children-under-four-answers-update')
      } else {
        res.redirect('/v25/apply/children-under-four-answers-update')
      }
    
    })
 


  
  // Feedback
  
  router.post('/v25/feedback', function (req, res) {
    res.redirect('/v25/feedback')
  })


// v25 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v25/check-your-answers', function (req, res) {

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
    res.redirect('/v25/apply/confirmation-pending-evidence')
  } else if (lastname == 'Blue') {
    res.redirect('/v25/apply/confirmation-pending-evidence')
  } else if (lastname == 'Yellow') {
    res.redirect('/v25/apply/confirmation-pending-evidence')
  } else {
    if (emailAddress) {
  
      if (pregnant === "yes") {
            res.redirect('/v25/apply/confirmation-successful');
      } else {
        res.redirect('/v25/apply/confirmation-successful');
      }
  
    }
    else if (mobilePhoneNumber) {
  
      if (pregnant === "yes") {
        res.redirect('/v25/apply/confirmation-successful');
      } else {
        res.redirect('/v25/apply/confirmation-successful');
      }
  
    } else if (!emailAddress && !mobilePhoneNumber) {
      res.redirect('/v25/apply/confirmation-successful');
    } else {
      res.redirect('/v25/apply/check-your-answers')
    }
  }

})
 

// What is your email address 2?

router.post('/v25/email-address-2', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v25/apply/mobile-phone-number')

})


// Email text box




// Keep at the bottom of the file
  module.exports = router;