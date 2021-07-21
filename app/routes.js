// Gov Notify
const { NotifyClient } = require('notifications-node-client');
let notifyClient = null;

if (process.env.NOTIFYAPIKEY) {
  notifyClient = new NotifyClient(process.env.NOTIFYAPIKEY);
};

// External dependencies
const express = require('express');
const router = express.Router();
const moment = require('moment');
const stringSimilarity = require("string-similarity");
const geolib = require('geolib');

// API

const axios = require('axios');

// CONSTANTS

const today = new Date(Date.now());
let vitaminProviders = require('./data/vitamin-locations')

// ****************************************
// PERSONAS
// ****************************************

// Charlie Smith

// National Insurance number = AB 12 34 56 A
// Date of birth = 01 / 01 / 2000
// 1st Line of Address = 55 Peachfield Road
// Postcode = LL67 3SN
// Pregnant? = YES
// Children Under 1? = NO
// Children Between 1 & 4? = YES

// Riley Jones

// National Insurance number = CD 65 43 21 B
// Date of birth = 02 / 02 / 1999
// 1st Line of Address = 49 Park Terrace
// Postcode = NR33 4GT
// Pregnant? = NO
// Children Under 1? = YES
// Children Between 1 & 4? = NO

// Alex Johnson

// National Insurance number = EF 21 43 65 C
// Date of birth = 03 / 03 / 1998
// 1st Line of Address = Cedar House
// Postcode = AB55 8NL
// Pregnant? = YES
// Children Under 1? = NO
// Children Between 1 & 4? = NO

// Tony Brown

// National Insurance number = GH 56 34 12 D
// Date of birth = 04 / 04 / 1997
// 1st Line of Address = Flat 4
// Postcode = KA24 8PE
// Pregnant? = NO
// Children Under 1? = NO
// Children Between 1 & 4? = YES

// Samantha Miller

// National Insurance number = IJ 87 65 43 E
// Date of birth = 05 / 05 / 1996
// 1st Line of Address = 85 Broad Street
// Postcode = WA4 3AS
// Pregnant? = NO
// Children Under 1? = NO
// Children Between 1 & 4? = NO

// Dennis Mitchell

// National Insurance number = KL 98 76 54 F
// Date of birth = 06 / 06 / 1995
// 1st Line of Address = 107 Station Road
// Postcode = CR8 6GJ
// Pregnant? = NO
// Children Under 1? = NO
// Children Between 1 & 4? = NO

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

// Current Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/current/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
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

  if (emailAddress) {

    if (pregnant === "yes") {

      /*    

      // Map postcode to Lat & Long, then find their nearest vitamin provider N.B. Uncomment out when we do vitamins!

      axios.get('https://api.postcodes.io/postcodes/' + postcode)
      .then(function (response) {
          var nearestProvider = geolib.findNearest({ latitude: response.data.result.latitude, longitude: response.data.result.longitude }, vitaminProviders)
          console.log(nearestProvider.address);

          notifyClient.sendEmail('a555749d-0f67-4fbd-b787-0bb158eb34bc', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "", 'vitaminAddress': nearestProvider.address }, reference: null })
          .then(response => { console.log(response); res.redirect('/current/apply/confirmation-successful'); })
          .catch(err => console.error(err))
      })
      .catch(function (error) {
          console.log(error); 
          res.redirect('/current/apply/confirmation-successful');
      })
      .then(function () {

      });
            
      */

     notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
     .then(response => { console.log(response); res.redirect('/current/apply/confirmation-successful'); })
     .catch(err => { console.error(err); res.redirect('/current/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/current/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/current/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/current/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/current/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/current/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/current/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/current/apply/confirmation-successful');

  } else {
    res.redirect('/current/apply/check-your-answers')
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
      .catch(err => { console.error(err); res.redirect('/v5/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v5/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v5/apply/confirmation-successful'); })
  
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
      .catch(err => { console.error(err); res.redirect('/v6/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v6/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v6/apply/confirmation-successful'); })
  
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

// V8 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v8/check-your-answers', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/check-your-answers";

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
      .then(response => { console.log(response); res.redirect('/v8/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v8/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v8/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v8/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v8/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v8/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v8/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v8/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v8/apply/confirmation-successful');

  } else {
    res.redirect('/v8/apply/check-your-answers')
  }

})

// V9 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v9/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
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

  if (emailAddress) {

    if (pregnant === "yes") {

      /*    

      // Map postcode to Lat & Long, then find their nearest vitamin provider N.B. Uncomment out when we do vitamins!

      axios.get('https://api.postcodes.io/postcodes/' + postcode)
      .then(function (response) {
          var nearestProvider = geolib.findNearest({ latitude: response.data.result.latitude, longitude: response.data.result.longitude }, vitaminProviders)
          console.log(nearestProvider.address);

          notifyClient.sendEmail('a555749d-0f67-4fbd-b787-0bb158eb34bc', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "", 'vitaminAddress': nearestProvider.address }, reference: null })
          .then(response => { console.log(response); res.redirect('/v10/apply/confirmation-successful'); })
          .catch(err => console.error(err))
      })
      .catch(function (error) {
          console.log(error); 
          res.redirect('/v10/apply/confirmation-successful');
      })
      .then(function () {

      });
            
      */

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v9/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v9/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v9/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v9/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v9/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v9/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v9/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v9/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v9/apply/confirmation-successful');

  } else {
    res.redirect('/v9/apply/check-your-answers')
  }

})

// V10 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v10/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
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

  if (emailAddress) {

    if (pregnant === "yes") {

      /*    

      // Map postcode to Lat & Long, then find their nearest vitamin provider N.B. Uncomment out when we do vitamins!

      axios.get('https://api.postcodes.io/postcodes/' + postcode)
      .then(function (response) {
          var nearestProvider = geolib.findNearest({ latitude: response.data.result.latitude, longitude: response.data.result.longitude }, vitaminProviders)
          console.log(nearestProvider.address);

          notifyClient.sendEmail('a555749d-0f67-4fbd-b787-0bb158eb34bc', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "", 'vitaminAddress': nearestProvider.address }, reference: null })
          .then(response => { console.log(response); res.redirect('/v10/apply/confirmation-successful'); })
          .catch(err => console.error(err))
      })
      .catch(function (error) {
          console.log(error); 
          res.redirect('/v10/apply/confirmation-successful');
      })
      .then(function () {

      });
            
      */

     notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
     .then(response => { console.log(response); res.redirect('/v10/apply/confirmation-successful'); })
     .catch(err => { console.error(err); res.redirect('/v10/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v10/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v10/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v10/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v10/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v10/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v10/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v10/apply/confirmation-successful');

  } else {
    res.redirect('/v10/apply/check-your-answers')
  }

})

// V11 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v11/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
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

  if (emailAddress) {

    if (pregnant === "yes") {

      /*    

      // Map postcode to Lat & Long, then find their nearest vitamin provider N.B. Uncomment out when we do vitamins!

      axios.get('https://api.postcodes.io/postcodes/' + postcode)
      .then(function (response) {
          var nearestProvider = geolib.findNearest({ latitude: response.data.result.latitude, longitude: response.data.result.longitude }, vitaminProviders)
          console.log(nearestProvider.address);

          notifyClient.sendEmail('a555749d-0f67-4fbd-b787-0bb158eb34bc', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "", 'vitaminAddress': nearestProvider.address }, reference: null })
          .then(response => { console.log(response); res.redirect('/v11/apply/confirmation-successful'); })
          .catch(err => console.error(err))
      })
      .catch(function (error) {
          console.log(error); 
          res.redirect('/v11/apply/confirmation-successful');
      })
      .then(function () {

      });
            
      */

     notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
     .then(response => { console.log(response); res.redirect('/v11/apply/confirmation-successful'); })
     .catch(err => { console.error(err); res.redirect('/v11/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v11/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v11/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v11/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v11/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v11/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v11/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v11/apply/confirmation-successful');

  } else {
    res.redirect('/v11/apply/check-your-answers')
  }

})

// V12 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v12/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
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

  if (emailAddress) {

    if (pregnant === "yes") {

      /*    

      // Map postcode to Lat & Long, then find their nearest vitamin provider N.B. Uncomment out when we do vitamins!

      axios.get('https://api.postcodes.io/postcodes/' + postcode)
      .then(function (response) {
          var nearestProvider = geolib.findNearest({ latitude: response.data.result.latitude, longitude: response.data.result.longitude }, vitaminProviders)
          console.log(nearestProvider.address);

          notifyClient.sendEmail('a555749d-0f67-4fbd-b787-0bb158eb34bc', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "", 'vitaminAddress': nearestProvider.address }, reference: null })
          .then(response => { console.log(response); res.redirect('/v12/apply/confirmation-successful'); })
          .catch(err => console.error(err))
      })
      .catch(function (error) {
          console.log(error); 
          res.redirect('/v12/apply/confirmation-successful');
      })
      .then(function () {

      });
            
      */

     notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
     .then(response => { console.log(response); res.redirect('/v12/apply/confirmation-successful'); })
     .catch(err => { console.error(err); res.redirect('/v12/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v12/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v12/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v12/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v12/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v12/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v12/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v12/apply/confirmation-successful');

  } else {
    res.redirect('/v12/apply/check-your-answers')
  }

})

// V13 Check Your Answers

// N.B ALL PERSONALISATION VARIABLES NEED TO BE THERE, IF THEY'RE NOT REQUIRED YOU STILL NEED TO SEND AN EMPTY STRING ""

router.post('/v13/check-your-answers', function (req, res) {

  var contact = req.session.data['contact'];
  var emailAddress = req.session.data['emailaddress'];
  var mobilePhoneNumber = req.session.data['mobilephonenumber'];
  var pregnant = req.session.data['pregnant']
  var firstName = req.session.data['firstname'];
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

  if (emailAddress) {

    if (pregnant === "yes") {

      /*    

      // Map postcode to Lat & Long, then find their nearest vitamin provider N.B. Uncomment out when we do vitamins!

      axios.get('https://api.postcodes.io/postcodes/' + postcode)
      .then(function (response) {
          var nearestProvider = geolib.findNearest({ latitude: response.data.result.latitude, longitude: response.data.result.longitude }, vitaminProviders)
          console.log(nearestProvider.address);

          notifyClient.sendEmail('a555749d-0f67-4fbd-b787-0bb158eb34bc', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "", 'vitaminAddress': nearestProvider.address }, reference: null })
          .then(response => { console.log(response); res.redirect('/v13/apply/confirmation-successful'); })
          .catch(err => console.error(err))
      })
      .catch(function (error) {
          console.log(error); 
          res.redirect('/v13/apply/confirmation-successful');
      })
      .then(function () {

      });
            
      */

     notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
     .then(response => { console.log(response); res.redirect('/v13/apply/confirmation-successful'); })
     .catch(err => { console.error(err); res.redirect('/v13/apply/confirmation-successful'); })

    } else {

      notifyClient.sendEmail('152bd9a2-a79f-4e4f-8bfe-84654ffed6fb', emailAddress, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      .then(response => { console.log(response); res.redirect('/v13/apply/confirmation-successful'); })
      .catch(err => { console.error(err); res.redirect('/v13/apply/confirmation-successful'); })
  
    }

  }
  else if (mobilePhoneNumber) {

    if (pregnant === "yes") {

      // notifyClient.sendSms('fa19ba1e-138c-456c-9c11-791f772a4975', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': pregnancyPayment, 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment, 'vitamin_start_date': vitStart, 'vitamin_end_date': vitEnd, 'vitaminTypeWomen': vitTypeWomen, 'vitaminTypeChildren': "" }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v13/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v13/apply/confirmation-successful');

    } else {

      // notifyClient.sendSms('e9299ebf-725c-4d8a-86c6-b28c0ef0028a', mobilePhoneNumber, { personalisation: { 'reference_number': refNo, 'first_name': firstName, 'payment_amount': paymentAmount, 'pregnancy_payment': "", 'children_under_1_payment': "", 'children_under_4_payment': childrenUnder4Payment }, reference: null })
      // .then(response => { console.log(response); res.redirect('/v13/apply/confirmation-successful'); })
      // .catch(err => console.error(err))

      res.redirect('/v13/apply/confirmation-successful');
  
    }

  } else if (!emailAddress && !mobilePhoneNumber) {
    res.redirect('/v13/apply/confirmation-successful');

  } else {
    res.redirect('/v13/apply/check-your-answers')
  }

})

// Add your routes here - above the module.exports line

module.exports = router;



// ********************************
// APPLY (CURRENT)
// ********************************

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
    res.redirect('/current/apply/email-address')
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

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

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

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

  if (nationalinsurancenumber) {

    if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
      res.redirect('/v4/apply/name')
    } else {
      res.redirect('/v4/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v4/apply/national-insurance-number')
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

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

  if (nationalinsurancenumber) {
    
    if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
      res.redirect('/v5/apply/name')
    } else {
      res.redirect('/v5/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v5/apply/national-insurance-number')
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

// What is your national insurance number?

router.post('/v6/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

  if (nationalinsurancenumber) {
    
    if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
      res.redirect('/v6/apply/name')
    } else {
      res.redirect('/v6/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v6/apply/national-insurance-number')
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
    res.redirect('/v6/apply/find-address')
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

      res.redirect('/v6/apply/find-address')
    }

  }
  else {
    res.redirect('/v6/apply/due-date')
  }

})

// Find your address

router.get('/v6/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v6/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v6/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v6/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v6/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v6/apply/find-address')
  }

})

// Select your address

router.get('/v6/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v6/apply/address')
  } else if (selectaddress) {
    res.redirect('/v6/apply/email-address')
  } else {
    res.redirect('/v6/apply/select-address')
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

// ********************************
// APPLY (VERSION 7)
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

// ********************************
// APPLY (VERSION 8)
// ********************************

// What is your national insurance number?

router.post('/v8/national-insurance-number', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/national-insurance-number";

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

  if (nationalinsurancenumber) {
    
    if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
      res.redirect('/v8/apply/name')
    } else {
      res.redirect('/v8/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v8/apply/national-insurance-number')
  }

})

// What is your name?

router.post('/v8/name', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/name";

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v8/apply/date-of-birth')
  }
  else {
    res.redirect('/v8/apply/name')
  }

})

// Date of birth

router.post('/v8/date-of-birth', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/date-of-birth";

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  req.session.data.yrs = yrs;


  if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
    res.redirect('/v8/apply/are-you-pregnant')
  }
  else {
    res.redirect('/v8/apply/date-of-birth')
  }

})

// Are you pregnant?

router.post('/v8/are-you-pregnant', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/are-you-pregnant";

  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes") {
    res.redirect('/v8/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;
    res.redirect('/v8/apply/find-address')
  }
  else {
    res.redirect('/v8/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v8/due-date', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/due-date";

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v8/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v8/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      res.redirect('/v8/apply/find-address')
    }

  }
  else {
    res.redirect('/v8/apply/due-date')
  }

})

// Find your address

router.get('/v8/find-address', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/find-address";

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v8/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v8/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v8/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v8/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v8/apply/find-address')
  }

})

// Select your address

router.get('/v8/select-address', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/select-address";

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v8/apply/address')
  } else if (selectaddress) {
    res.redirect('/v8/apply/email-address')
  } else {
    res.redirect('/v8/apply/select-address')
  }

})

// What is your address?

router.post('/v8/address', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/address";

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode']

  if (addressline1 && towncity && postcode) {
    res.redirect('/v8/apply/email-address')
  } else {
    res.redirect('/v8/apply/address')
  }

})

// What is your email address?

router.post('/v8/email-address', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/email-address";

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v8/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v8/mobile-phone-number', function (req, res) {
  
  req.session.data['referrer'] = "/v8/apply/mobile-phone-number";

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v8/apply/bank-details')

})

// Contact Preferences

router.post('/v8/contact-preferences', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/contact-preferences";

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v8/apply/bank-details')    
    }
    else {
      res.redirect('/v8/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v8/apply/contact-preferences')
  }

})

// Bank Details

router.post('/v8/bank-details', function (req, res) {

  req.session.data['referrer'] = "/v8/apply/bank-details";

  var accountName = req.session.data['accountname']
  var sortCode = req.session.data['sortcode']
  var accountNumber = req.session.data['accountnumber']

  if (accountName && sortCode && accountNumber){
    res.redirect('/v8/apply/check-your-answers')    
  }
  else {
    res.redirect('/v8/apply/bank-details')
  }

})

// Feedback

router.post('/v8/feedback', function (req, res) {

  req.session.data['referrer'] = "/v8/feedback";

  res.redirect('/v8/feedback')
})

// Cookies

router.post('/cookies/cookie-confirmation', function (req, res) {

  if (!req.session.data['referrer']){
    res.redirect('/current/start')    
  }
  else {
    res.redirect(req.session.data['referrer'])
  }

})

// ********************************
// APPLY (VERSION 9)
// ********************************

// What is your national insurance number?

router.post('/v9/national-insurance-number', function (req, res) {

  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');

  if (nationalinsurancenumber) {
    
    if (nationalinsurancenumber === 'QQ123456C' || nationalinsurancenumber === 'AB123456A' || nationalinsurancenumber === 'CD654321B' || nationalinsurancenumber === 'EF214365C' || nationalinsurancenumber === 'GH563412D') {
      res.redirect('/v9/apply/name')
    } else {
      res.redirect('/v9/apply/kickouts/not-eligible-national-insurance-number')
    }

  }
  else {
    res.redirect('/v9/apply/national-insurance-number')
  }

})

// What is your name?

router.post('/v9/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v9/apply/date-of-birth')
  }
  else {
    res.redirect('/v9/apply/name')
  }

})

// Date of birth

router.post('/v9/date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']

  var dob = new Date(dateofbirthyear, dateofbirthmonth, dateofbirthday);
  var ageDate =  new Date(today - dob.getTime())
  var temp = ageDate.getFullYear();
  var yrs = Math.abs(temp - 1970);

  req.session.data.yrs = yrs;


  if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
    res.redirect('/v9/apply/nationality')
  }
  else {
    res.redirect('/v9/apply/date-of-birth')
  }

})

// What is your nationality?

router.post('/v9/nationality', function (req, res) {

  var nationality = req.session.data['input-autocomplete']

  if (nationality) {
    res.redirect('/v9/apply/are-you-pregnant')
  }
  else {
    res.redirect('/v9/apply/nationality')
  }

})

// Are you pregnant?

router.post('/v9/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes") {
    res.redirect('/v9/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;
    res.redirect('/v9/apply/find-address')
  }
  else {
    res.redirect('/v9/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v9/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v9/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v9/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      res.redirect('/v9/apply/find-address')
    }

  }
  else {
    res.redirect('/v9/apply/due-date')
  }

})

// Find your address

router.get('/v9/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v9/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v9/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v9/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v9/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v9/apply/find-address')
  }

})

// Select your address

router.get('/v9/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v9/apply/address')
  } else if (selectaddress) {
    res.redirect('/v9/apply/email-address')
  } else {
    res.redirect('/v9/apply/select-address')
  }

})

// What is your address?

router.post('/v9/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode']

  if (addressline1 && towncity && postcode) {
    res.redirect('/v9/apply/email-address')
  } else {
    res.redirect('/v9/apply/address')
  }

})

// What is your email address?

router.post('/v9/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v9/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v9/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v9/apply/check-your-answers')

})

// Contact Preferences

router.post('/v9/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v9/apply/bank-details')    
    }
    else {
      res.redirect('/v9/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v9/apply/contact-preferences')
  }

})

// Bank Details

router.post('/v9/bank-details', function (req, res) {

  var accountName = req.session.data['accountname']
  var sortCode = req.session.data['sortcode']
  var accountNumber = req.session.data['accountnumber']

  if (accountName && sortCode && accountNumber){
    res.redirect('/v9/apply/check-your-answers')    
  }
  else {
    res.redirect('/v9/apply/bank-details')
  }

})

// Feedback

router.post('/v9/feedback', function (req, res) {
  res.redirect('/v9/feedback')
})

// ********************************
// APPLY (VERSION 10)
// ********************************

// What is your name?

router.post('/v10/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v10/apply/address')
  }
  else {
    res.redirect('/v10/apply/name')
  }

})

// Find your address

router.get('/v10/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v10/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v10/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v10/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v10/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v10/apply/find-address')
  }

})

// Select your address

router.get('/v10/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v10/apply/address')
  } else if (selectaddress) {
    res.redirect('/v10/apply/date-of-birth')
  } else {
    res.redirect('/v10/apply/select-address')
  }

})

// What is your address?

router.post('/v10/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()

  if (addressline1 && towncity && postcode) {
    res.redirect('/v10/apply/date-of-birth')
  } else {
    res.redirect('/v10/apply/address')
  }

})

// Date of birth

router.post('/v10/date-of-birth', function (req, res) {

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
        res.redirect('/v10/apply/are-you-pregnant')
      } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
        res.redirect('/v10/apply/are-you-pregnant')
      } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
        res.redirect('/v10/apply/are-you-pregnant')
      } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
        res.redirect('/v10/apply/are-you-pregnant')
      } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
        res.redirect('/v10/apply/kickouts/confirmation-no-match')
      } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
        res.redirect('/v10/apply/kickouts/confirmation-no-match')
      } else {
        res.redirect('/v10/apply/kickouts/confirmation-no-match')
      }  

    }
    else {
      res.redirect('/v10/apply/date-of-birth')
    }    

  }
  else {

    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v10/apply/national-insurance-number')
    }
    else {
      res.redirect('/v10/apply/date-of-birth')
    }    

  }


})

// What is your national insurance number?

router.post('/v10/national-insurance-number', function (req, res) {

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
      res.redirect('/v10/apply/are-you-pregnant')
    } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
      res.redirect('/v10/apply/are-you-pregnant')
    } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
      res.redirect('/v10/apply/are-you-pregnant')
    } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
      res.redirect('/v10/apply/are-you-pregnant')
    } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
      res.redirect('/v10/apply/kickouts/confirmation-no-match')
    } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
      res.redirect('/v10/apply/kickouts/confirmation-no-match')
    } else {
      res.redirect('/v10/apply/kickouts/confirmation-no-match')
    }  

  }
  else {
    res.redirect('/v10/apply/national-insurance-number')
  }

})

// What is your nationality?

router.post('/v10/nationality', function (req, res) {

  var nationality = req.session.data['input-autocomplete']

  if (nationality) {
    res.redirect('/v10/apply/are-you-pregnant')
  }
  else {
    res.redirect('/v10/apply/nationality')
  }

})

// Are you pregnant?

router.post('/v10/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes") {
    res.redirect('/v10/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;
    res.redirect('/v10/apply/email-address')
  }
  else {
    res.redirect('/v10/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v10/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v10/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v10/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      res.redirect('/v10/apply/email-address')
    }

  }
  else {
    res.redirect('/v10/apply/due-date')
  }

})


// What is your email address?

router.post('/v10/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v10/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v10/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v10/apply/check-your-answers')

})

// Contact Preferences

router.post('/v10/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v10/apply/bank-details')    
    }
    else {
      res.redirect('/v10/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v10/apply/contact-preferences')
  }

})

// Bank Details

router.post('/v10/bank-details', function (req, res) {

  var accountName = req.session.data['accountname']
  var sortCode = req.session.data['sortcode']
  var accountNumber = req.session.data['accountnumber']

  if (accountName && sortCode && accountNumber){
    res.redirect('/v10/apply/check-your-answers')    
  }
  else {
    res.redirect('/v10/apply/bank-details')
  }

})

// Feedback

router.post('/v10/feedback', function (req, res) {
  res.redirect('/v10/feedback')
})

// ********************************
// APPLY (VERSION 11)
// ********************************

// What is your name?

router.post('/v11/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v11/apply/address')
  }
  else {
    res.redirect('/v11/apply/name')
  }

})

// Find your address

router.get('/v11/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v11/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v11/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v11/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v11/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v11/apply/find-address')
  }

})

// Select your address

router.get('/v11/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v11/apply/address')
  } else if (selectaddress) {
    res.redirect('/v11/apply/date-of-birth')
  } else {
    res.redirect('/v11/apply/select-address')
  }

})

// What is your address?

router.post('/v11/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()

  if (addressline1 && towncity && postcode) {
    res.redirect('/v11/apply/date-of-birth')
  } else {
    res.redirect('/v11/apply/address')
  }

})

// Date of birth

router.post('/v11/date-of-birth', function (req, res) {

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

    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v11/apply/national-insurance-number')
    }
    else {
      res.redirect('/v11/apply/date-of-birth')
    }    


})

// What is your national insurance number?

router.post('/v11/national-insurance-number', function (req, res) {

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

    if (firstname == 'CHARLIE' && lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD') {
      res.redirect('/v11/apply/are-you-pregnant')
    } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
      res.redirect('/v11/apply/are-you-pregnant')
    } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
      res.redirect('/v11/apply/are-you-pregnant')
    } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
      res.redirect('/v11/apply/are-you-pregnant')
    } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
      res.redirect('/v11/apply/kickouts/confirmation-no-match')
    } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
      res.redirect('/v11/apply/kickouts/confirmation-no-match')
    } else {
      res.redirect('/v11/apply/kickouts/confirmation-no-match')
    }
    
    console.log(firstname);
    console.log(lastname);
    console.log(nationalinsurancenumber);
    console.log(dateofbirth);
    console.log(postcode);
    console.log(addressline1);

    

  }
  else {
    res.redirect('/v11/apply/national-insurance-number')
  }

})

// Are you pregnant?

router.post('/v11/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']
  var firstname = req.session.data['firstname'].trim().toUpperCase()

  if (pregnant === "yes") {
    res.redirect('/v11/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;

    if (firstname == 'CHARLIE') {
      res.redirect('/v11/apply/email-address')
    } else if (firstname == 'RILEY') {
      res.redirect('/v11/apply/children-under-four')
    } else if (firstname == 'ALEX') {
      res.redirect('/v11/apply/children-under-four')
    } else if (firstname == 'TONY') {
      res.redirect('/v11/apply/children-under-four')
    } else {
      res.redirect('/v11/apply/are-you-pregnant')
    }  

  }
  else {
    res.redirect('/v11/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v11/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  var firstname = req.session.data['firstname'].trim().toUpperCase()

  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v11/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v11/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      if (firstname == 'CHARLIE') {
        res.redirect('/v11/apply/email-address')
      } else if (firstname == 'RILEY') {
        res.redirect('/v11/apply/children-under-four')
      } else if (firstname == 'ALEX') {
        res.redirect('/v11/apply/children-under-four')
      } else if (firstname == 'TONY') {
        res.redirect('/v11/apply/children-under-four')
      } else {
        res.redirect('/v11/apply/due-date')
      } 

    }

  }
  else {
    res.redirect('/v11/apply/due-date')
  }

})

// Do you have any children under the age of 4?

router.post('/v11/children-under-four', function (req, res) {

  var childrenunderfour = req.session.data['childrenunderfour']
  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes" && childrenunderfour === "no") {
    res.redirect('/v11/apply/email-address')
  } else if (pregnant === "no" && childrenunderfour === "yes") {
    res.redirect('/v11/apply/childs-first-name')
  } else if (pregnant === "yes" && childrenunderfour === "yes") {
    res.redirect('/v11/apply/childs-first-name')
  } else if (childrenunderfour === "no" && pregnant ==="no") {
    res.redirect('/v11/apply/kickouts/not-eligible')
  } else {
    res.redirect('/v11/apply/children-under-four')
  }

})

    // Do you have any children under the age of 4? > Childs first name

    router.post('/v11/childs-first-name', function (req, res) {

      var childsfirstname = req.session.data['childsfirstname']
      var childslastname = req.session.data['childslastname']


      if (childsfirstname && childslastname) {
        res.redirect('/v11/apply/childs-date-of-birth')
      }
      else {
        res.redirect('/v11/apply/childs-first-name')
      }

    })

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v11/childs-date-of-birth', function (req, res) {

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
              
              res.redirect('/v11/apply/children-under-four-answers');          



            } else {
              res.redirect('/v11/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v11/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v11/apply/childs-date-of-birth')
      }


    })

    // Do you have any children under the age of 4? > Do you have another child under four?

    router.post('/v11/children-under-four-answers', function (req, res) {

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

      var firstname = req.session.data['firstname'].trim().toUpperCase()

      if (childrenunderfouranswers === "yes") {
        res.redirect('/v11/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no" && firstname == 'RILEY') {
        res.redirect('/v11/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && firstname == 'ALEX') {
        res.redirect('/v11/apply/kickouts/no-eligible-children')
      }
      else if (childrenunderfouranswers === "no" && firstname == 'TONY') {
        res.redirect('/v11/apply/kickouts/no-eligible-children')
      }
      else {
        res.redirect('/v11/apply/children-under-four-answers')
      }

    })


// What is your email address?

router.post('/v11/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v11/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v11/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v11/apply/check-your-answers')

})

// Contact Preferences

router.post('/v11/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v11/apply/bank-details')    
    }
    else {
      res.redirect('/v11/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v11/apply/contact-preferences')
  }

})

// Feedback

router.post('/v11/feedback', function (req, res) {
  res.redirect('/v11/feedback')
})

// ********************************
// APPLY (VERSION 12)
// ********************************

// What is your name?

router.post('/v12/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v12/apply/address')
  }
  else {
    res.redirect('/v12/apply/name')
  }

})

// Find your address

router.get('/v12/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v12/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v12/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v12/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v12/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v12/apply/find-address')
  }

})

// Select your address

router.get('/v12/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v12/apply/address')
  } else if (selectaddress) {
    res.redirect('/v12/apply/date-of-birth')
  } else {
    res.redirect('/v12/apply/select-address')
  }

})

// What is your address?

router.post('/v12/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()

  if (addressline1 && towncity && postcode) {
    res.redirect('/v12/apply/date-of-birth')
  } else {
    res.redirect('/v12/apply/address')
  }

})

// Date of birth

router.post('/v12/date-of-birth', function (req, res) {

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

    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v12/apply/national-insurance-number')
    }
    else {
      res.redirect('/v12/apply/date-of-birth')
    }    


})

// What is your national insurance number?

router.post('/v12/national-insurance-number', function (req, res) {

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
    res.redirect('/v12/apply/do-you-live-with-a-partner')
  }
  else {
    res.redirect('/v12/apply/national-insurance-number')
  }

})

router.post('/v12/do-you-live-with-a-partner', function (req, res) {

  var partner = req.session.data['partner']

  if (partner === "yes") {
    res.redirect('/v12/apply/partners-name')
  }
  else if (partner === "no") {

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

if (firstname == 'CHARLIE' && lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD') {
    res.redirect('/v12/apply/are-you-pregnant')
  } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
    res.redirect('/v12/apply/are-you-pregnant')
  } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
    res.redirect('/v12/apply/are-you-pregnant')
  } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
    res.redirect('/v12/apply/are-you-pregnant')
  } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
    res.redirect('/v12/apply/kickouts/confirmation-no-match')
  } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
    res.redirect('/v12/apply/kickouts/confirmation-no-match')
  } else {
    res.redirect('/v12/apply/kickouts/confirmation-no-match')
  }

  }
  else {
    res.redirect('/v12/apply/do-you-live-with-a-partner')
  }

})

// What is your partners name?

router.post('/v12/partners-name', function (req, res) {

  var partnersfirstname = req.session.data['partnersfirstname']
  var partnerslastname = req.session.data['partnerslastname']

  if (partnersfirstname && partnerslastname) {
    res.redirect('/v12/apply/partners-date-of-birth')
  }
  else {
    res.redirect('/v12/apply/partners-name')
  }

})

// Partners date of birth

router.post('/v12/partners-date-of-birth', function (req, res) {

  var dateofbirthday = req.session.data['dateofbirthday']
  var dateofbirthmonth = req.session.data['dateofbirthmonth']
  var dateofbirthyear = req.session.data['dateofbirthyear']
  
  var partnersdateofbirthday = req.session.data['partnersdateofbirthday']
  var partnersdateofbirthmonth = req.session.data['partnersdateofbirthmonth']
  var partnersdateofbirthyear = req.session.data['partnersdateofbirthyear']
  
  var dob = moment(dateofbirthday + '-' + dateofbirthmonth + '-' + dateofbirthyear, "DD-MM-YYYY");
  var dateofbirth = moment(dob).format('MM/DD/YYYY');
  
  var partnersdob = moment(partnersdateofbirthday + '-' + partnersdateofbirthmonth + '-' + partnersdateofbirthyear, "DD-MM-YYYY");
  var partnersdateofbirth = moment(partnersdob).format('MM/DD/YYYY');
  
  var firstname = req.session.data['firstname'].trim().toUpperCase()
  var lastname = req.session.data['lastname'].trim().toUpperCase()
  var addressline1 = req.session.data['addressline1'].trim().toUpperCase()
  var addressline2 = req.session.data['addressline2'].trim().toUpperCase()
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()
  var nationalinsurancenumber = req.session.data['nationalinsurancenumber'].toUpperCase().replace(/\s+/g, '');
  
  var partnersfirstname = req.session.data['partnersfirstname'].trim().toUpperCase()
  var partnerslastname = req.session.data['partnerslastname'].trim().toUpperCase()

  if (partnersdateofbirthday && partnersdateofbirthmonth && partnersdateofbirthyear) {

    if (firstname == 'CHARLIE' && lastname == 'SMITH' && nationalinsurancenumber == 'AB123456A' && dateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD' || partnersfirstname == 'CHARLIE' && partnerslastname == 'SMITH' && partnersdateofbirth == '01/01/2000' && postcode == 'LL673SN' && addressline1 == '55 PEACHFIELD ROAD') {
      res.redirect('/v12/apply/are-you-pregnant')
    } else if (firstname == 'RILEY' && lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE' || partnersfirstname == 'RILEY' && partnerslastname == 'JONES' && partnersdateofbirth == '02/02/1999' && postcode == 'NR334GT' && addressline1 == '49 PARK TERRACE') {
      res.redirect('/v12/apply/are-you-pregnant')
    } else if (firstname == 'ALEX' && lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE' || partnersfirstname == 'ALEX' && partnerslastname == 'JOHNSON' && partnersdateofbirth == '03/03/1998' && postcode == 'AB558NL' && addressline1 == 'CEDAR HOUSE') {
      res.redirect('/v12/apply/are-you-pregnant')
    } else if (firstname == 'TONY' && lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4' || partnersfirstname == 'TONY' && partnerslastname == 'BROWN' && partnersdateofbirth == '04/04/1997' && postcode == 'KA248PE' && addressline1 == 'FLAT 4') {
      res.redirect('/v12/apply/are-you-pregnant')
    } else if (firstname == 'SAMANTHA' && lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET' || partnersfirstname == 'SAMANTHA' && partnerslastname == 'MILLER' && partnersdateofbirth == '05/05/1996' && postcode == 'WA43AS' && addressline1 == '85 BROAD STREET') {
      res.redirect('/v12/apply/kickouts/confirmation-no-match')
    } else if (firstname == 'DENNIS' && lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD' || partnersfirstname == 'DENNIS' && partnerslastname == 'MITCHELL' && partnersdateofbirth == '06/06/1995' && postcode == 'CR86GJ' && addressline1 == '107 STATION ROAD') {
      res.redirect('/v12/apply/kickouts/confirmation-no-match')
    } else {
      res.redirect('/v12/apply/kickouts/confirmation-no-match')
    }

  }
  else {
    res.redirect('/v12/apply/partners-date-of-birth')
  }

})



// Are you pregnant?

router.post('/v12/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']
  var firstname = req.session.data['firstname'].trim().toUpperCase()
  var partner = req.session.data['partner']

  if (partner === "yes") {
    var partnersfirstname = req.session.data['partnersfirstname'].trim().toUpperCase()
  }
  

  if (pregnant === "yes") {
    res.redirect('/v12/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;

    if (firstname == 'CHARLIE' || partnersfirstname == 'CHARLIE') {
      res.redirect('/v12/apply/email-address')
    } else if (firstname == 'RILEY' || partnersfirstname == 'RILEY') {
      res.redirect('/v12/apply/children-under-four')
    } else if (firstname == 'ALEX' || partnersfirstname == 'ALEX') {
      res.redirect('/v12/apply/children-under-four')
    } else if (firstname == 'TONY' || partnersfirstname == 'ALEX') {
      res.redirect('/v12/apply/children-under-four')
    } else {
      res.redirect('/v12/apply/are-you-pregnant')
    }  

  }
  else {
    res.redirect('/v12/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v12/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  var firstname = req.session.data['firstname'].trim().toUpperCase()

  var partner = req.session.data['partner']

  if (partner === "yes") {
    var partnersfirstname = req.session.data['partnersfirstname'].trim().toUpperCase()
  }


  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v12/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v12/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      if (firstname == 'CHARLIE' || partnersfirstname == 'CHARLIE') {
        res.redirect('/v12/apply/email-address')
      } else if (firstname == 'RILEY' || partnersfirstname == 'RILEY') {
        res.redirect('/v12/apply/children-under-four')
      } else if (firstname == 'ALEX' || partnersfirstname == 'ALEX') {
        res.redirect('/v12/apply/children-under-four')
      } else if (firstname == 'TONY' || partnersfirstname == 'TONY') {
        res.redirect('/v12/apply/children-under-four')
      } else {
        res.redirect('/v12/apply/due-date')
      } 

    }

  }
  else {
    res.redirect('/v12/apply/due-date')
  }

})

// Do you have any children under the age of 4?

router.post('/v12/children-under-four', function (req, res) {

  var childrenunderfour = req.session.data['childrenunderfour']
  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes" && childrenunderfour === "no") {
    res.redirect('/v12/apply/email-address')
  } else if (pregnant === "no" && childrenunderfour === "yes") {
    res.redirect('/v12/apply/childs-first-name')
  } else if (pregnant === "yes" && childrenunderfour === "yes") {
    res.redirect('/v12/apply/childs-first-name')
  } else if (childrenunderfour === "no" && pregnant ==="no") {
    res.redirect('/v12/apply/kickouts/not-eligible')
  } else {
    res.redirect('/v12/apply/children-under-four')
  }

})

    // Do you have any children under the age of 4? > Childs first name

    router.post('/v12/childs-first-name', function (req, res) {

      var childsfirstname = req.session.data['childsfirstname']
      var childslastname = req.session.data['childslastname']

      if (childsfirstname && childslastname) {
        res.redirect('/v12/apply/childs-date-of-birth')
      }
      else {
        res.redirect('/v12/apply/childs-first-name')
      }

    })

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v12/childs-date-of-birth', function (req, res) {

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
              
              res.redirect('/v12/apply/children-under-four-answers');          



            } else {
              res.redirect('/v12/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v12/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v12/apply/childs-date-of-birth')
      }


    })

    // Do you have any children under the age of 4? > Do you have another child under four?

    router.post('/v12/children-under-four-answers', function (req, res) {

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

      var firstname = req.session.data['firstname'].trim().toUpperCase();

      var partner = req.session.data['partner']

      if (partner === "yes") {
        var partnersfirstname = req.session.data['partnersfirstname'].trim().toUpperCase()
      }


      if (childrenunderfouranswers === "yes") {
        res.redirect('/v12/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no" && firstname == 'RILEY' || childrenunderfouranswers === "no" && partnersfirstname == 'RILEY') {
        res.redirect('/v12/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && firstname == 'ALEX' || childrenunderfouranswers === "no" && partnersfirstname == 'ALEX') {
        res.redirect('/v12/apply/kickouts/no-eligible-children')
      }
      else if (childrenunderfouranswers === "no" && firstname == 'TONY' || childrenunderfouranswers === "no" && partnersfirstname == 'TONY') {
        res.redirect('/v12/apply/kickouts/no-eligible-children')
      }
      else {
        res.redirect('/v12/apply/children-under-four-answers')
      }

    })


// What is your email address?

router.post('/v12/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v12/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v12/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v12/apply/check-your-answers')

})

// Contact Preferences

router.post('/v12/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v12/apply/bank-details')    
    }
    else {
      res.redirect('/v12/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v12/apply/contact-preferences')
  }

})

// Feedback

router.post('/v12/feedback', function (req, res) {
  res.redirect('/v12/feedback')
})

// ********************************
// APPLY (VERSION 13)
// ********************************

// What is your name?

router.post('/v13/name', function (req, res) {

  var firstname = req.session.data['firstname']
  var lastname = req.session.data['lastname']

  if (firstname && lastname) {
    res.redirect('/v13/apply/address')
  }
  else {
    res.redirect('/v13/apply/name')
  }

})

// Find your address

router.get('/v13/find-address', function (req, res) {

  var houseNumberName = req.session.data['housenumber']
  var postcode = req.session.data['postcode']

  const regex = RegExp('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$');

  if (regex.test(postcode) === true) {



    if (houseNumberName) {

      axios.get("https://api.getAddress.io/find/" + postcode + "/" + houseNumberName + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v13/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v13/apply/no-address-found')
      });

    } else {

      axios.get("https://api.getAddress.io/find/" + postcode + "?api-key="+ process.env.POSTCODEAPIKEY)
      .then(response => {
        console.log(response.data.addresses);
        var items = response.data.addresses;
        res.render('v13/apply/select-address', {items: items});
      })
      .catch(error => {
        console.log(error);
        res.redirect('/v13/apply/no-address-found')
      });

    }
    
    




  

  } else {
    res.redirect('/v13/apply/find-address')
  }

})

// Select your address

router.get('/v13/select-address', function (req, res) {

  var selectaddress = req.session.data['selectaddress']

  if (selectaddress === 'none') {

    delete req.session.data['addressline1']
    delete req.session.data['addressline2']
    delete req.session.data['towncity']
    delete req.session.data['postcode']

    res.redirect('/v13/apply/address')
  } else if (selectaddress) {
    res.redirect('/v13/apply/date-of-birth')
  } else {
    res.redirect('/v13/apply/select-address')
  }

})

// What is your address?

router.post('/v13/address', function (req, res) {

  delete req.session.data['selectaddress']

  var addressline1 = req.session.data['addressline1']
  var addressline2 = req.session.data['addressline2']
  var towncity = req.session.data['towncity']
  var postcode = req.session.data['postcode'].replace(/\s+/g, '').toUpperCase()

  if (addressline1 && towncity && postcode) {
    res.redirect('/v13/apply/date-of-birth')
  } else {
    res.redirect('/v13/apply/address')
  }

})

// Date of birth

router.post('/v13/date-of-birth', function (req, res) {

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

    if (dateofbirthday && dateofbirthmonth && dateofbirthyear) {
      res.redirect('/v13/apply/national-insurance-number')
    }
    else {
      res.redirect('/v13/apply/date-of-birth')
    }    


})

// What is your national insurance number?

router.post('/v13/national-insurance-number', function (req, res) {

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
      res.redirect('/v13/apply/are-you-pregnant')
    } else if (lastname == 'JONES' && nationalinsurancenumber == 'CD654321B' && dateofbirth == '02/02/1999' && postcode == 'NR334GT') {
      res.redirect('/v13/apply/are-you-pregnant')
    } else if (lastname == 'JOHNSON' && nationalinsurancenumber == 'EF214365C' && dateofbirth == '03/03/1998' && postcode == 'AB558NL') {
      res.redirect('/v13/apply/are-you-pregnant')
    } else if (lastname == 'BROWN' && nationalinsurancenumber == 'GH563412D' && dateofbirth == '04/04/1997' && postcode == 'KA248PE') {
      res.redirect('/v13/apply/are-you-pregnant')
    } else if (lastname == 'MILLER' && nationalinsurancenumber == 'IJ876543E' && dateofbirth == '05/05/1996' && postcode == 'WA43AS') {
      res.redirect('/v13/apply/kickouts/confirmation-no-match')
    } else if (lastname == 'MITCHELL' && nationalinsurancenumber == 'KL987654F' && dateofbirth == '06/06/1995' && postcode == 'CR86GJ') {
      res.redirect('/v13/apply/kickouts/confirmation-no-match')
    } else {
      res.redirect('/v13/apply/kickouts/confirmation-no-match')
    }
    
    console.log(firstname);
    console.log(lastname);
    console.log(nationalinsurancenumber);
    console.log(dateofbirth);
    console.log(postcode);
    console.log(addressline1);

    

  }
  else {
    res.redirect('/v13/apply/national-insurance-number')
  }

})

// Are you pregnant?

router.post('/v13/are-you-pregnant', function (req, res) {

  var pregnant = req.session.data['pregnant']
  var lastname = req.session.data['lastname'].trim().toUpperCase()

  if (pregnant === "yes") {
    res.redirect('/v13/apply/due-date')
  }
  else if (pregnant === "no") {
    req.session.data.lessThanTenWeeksPregnant = true;

    if (lastname == 'SMITH') {
      res.redirect('/v13/apply/email-address')
    } else if (lastname == 'JONES') {
      res.redirect('/v13/apply/children-under-four')
    } else if (lastname == 'JOHNSON') {
      res.redirect('/v13/apply/children-under-four')
    } else if (lastname == 'BROWN') {
      res.redirect('/v13/apply/children-under-four')
    } else {
      res.redirect('/v13/apply/are-you-pregnant')
    }  

  }
  else {
    res.redirect('/v13/apply/are-you-pregnant')
  }

})

// Are you pregnant? > Due Date

router.post('/v13/due-date', function (req, res) {

  var duedateday = req.session.data['duedateday']
  var duedatemonth = req.session.data['duedatemonth']
  var duedateyear = req.session.data['duedateyear']

  var duedate = moment(duedateyear + '-' + duedatemonth + '-' + duedateday);

  var today = moment();

  var fulltermpregnancy = moment().add(42, 'weeks'); // 42 weeks from today is a full term pregnancy
  var tenweekspregnant = moment().add(32, 'weeks'); // 42 weeks from today is a full term pregnancy - 10 weeks = 32 weeks

  var lastname = req.session.data['lastname'].trim().toUpperCase()

  
  if (duedateday && duedatemonth && duedateyear) {

    if (duedate < today) {
      res.redirect('/v13/apply/due-date')
    } else if (duedate > fulltermpregnancy) {
      res.redirect('/v13/apply/due-date')
    } else {

      if (duedate >= tenweekspregnant && duedate <= fulltermpregnancy) {
        req.session.data.lessThanTenWeeksPregnant = true;
      } else {
        req.session.data.lessThanTenWeeksPregnant = false;
      }

      if (lastname == 'SMITH') {
        res.redirect('/v13/apply/email-address')
      } else if (lastname == 'JONES') {
        res.redirect('/v13/apply/children-under-four')
      } else if (lastname == 'JOHNSON') {
        res.redirect('/v13/apply/children-under-four')
      } else if (lastname == 'BROWN') {
        res.redirect('/v13/apply/children-under-four')
      } else {
        res.redirect('/v13/apply/due-date')
      } 

    }

  }
  else {
    res.redirect('/v13/apply/due-date')
  }

})

// Do you have any children under the age of 4?

router.post('/v13/children-under-four', function (req, res) {

  var childrenunderfour = req.session.data['childrenunderfour']
  var pregnant = req.session.data['pregnant']

  if (pregnant === "yes" && childrenunderfour === "no") {
    res.redirect('/v13/apply/email-address')
  } else if (pregnant === "no" && childrenunderfour === "yes") {
    res.redirect('/v13/apply/childs-first-name')
  } else if (pregnant === "yes" && childrenunderfour === "yes") {
    res.redirect('/v13/apply/childs-first-name')
  } else if (childrenunderfour === "no" && pregnant ==="no") {
    res.redirect('/v13/apply/kickouts/not-eligible')
  } else {
    res.redirect('/v13/apply/children-under-four')
  }

})

    // Do you have any children under the age of 4? > Childs first name

    router.post('/v13/childs-first-name', function (req, res) {

      var childsfirstname = req.session.data['childsfirstname']
      var childslastname = req.session.data['childslastname']

      if (childsfirstname && childslastname) {
        res.redirect('/v13/apply/childs-date-of-birth')
      }
      else {
        res.redirect('/v13/apply/childs-first-name')
      }

    })

    // Do you have any children under the age of 4? > Childs date of birth

    router.post('/v13/childs-date-of-birth', function (req, res) {

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
              
              res.redirect('/v13/apply/children-under-four-answers');          



            } else {
              res.redirect('/v13/apply/childs-date-of-birth')
            }

        } else {
          res.redirect('/v13/apply/childs-date-of-birth')
        }
        
      }
      else {
        res.redirect('/v13/apply/childs-date-of-birth')
      }


    })

    // Do you have any children under the age of 4? > Do you have another child under four?

    router.post('/v13/children-under-four-answers', function (req, res) {

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
        res.redirect('/v13/apply/childs-first-name')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'JONES') {
        res.redirect('/v13/apply/email-address')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'JOHNSON') {
        res.redirect('/v13/apply/kickouts/no-eligible-children')
      }
      else if (childrenunderfouranswers === "no" && lastname == 'BROWN') {
        res.redirect('/v13/apply/kickouts/no-eligible-children')
      }
      else {
        res.redirect('/v13/apply/children-under-four-answers')
      }

    })


// What is your email address?

router.post('/v13/email-address', function (req, res) {

  var emailaddress = req.session.data['emailaddress']

  res.redirect('/v13/apply/mobile-phone-number')

})

// What is your mobile phone number?

router.post('/v13/mobile-phone-number', function (req, res) {

  var mobilePhoneNumber = req.session.data['mobilephonenumber']

  res.redirect('/v13/apply/check-your-answers')

})

// Contact Preferences

router.post('/v13/contact-preferences', function (req, res) {

  var contact = req.session.data['contact']
  var emailAddress = req.session.data['emailaddress']
  var mobile = req.session.data['mobile']

  if (contact) {

    if (emailAddress || mobile || contact === 'NONE'){
      res.redirect('/v13/apply/bank-details')    
    }
    else {
      res.redirect('/v13/apply/contact-preferences')
    }

  }
  else {
    res.redirect('/v13/apply/contact-preferences')
  }

})

// Feedback

router.post('/v13/feedback', function (req, res) {
  res.redirect('/v13/feedback')
})


// ********************************
// APPLY (FUTURE)
// ********************************

// Do you get Healthy Start vouchers at the moment?
router.post('/future/v1/who-applying-for', function (req, res) {

  var applyingfor = req.session.data['applyingfor']

  if (applyingfor === "myself") {
    res.redirect('/future/v1/apply/do-you-have-NHS-login')
  }
  else if (applyingfor === "someoneelse") {
    res.redirect('/v6/apply/national-insurance-number')
  }
  else {
    res.redirect('/future/v1/apply/who-applying-for')
  }

})

// Do you have an NHS login?
router.post('/future/v1/do-you-have-NHS-login', function (req, res) {

  var nhslogin = req.session.data['nhslogin']

  if (nhslogin === "yes") {
    res.redirect('/future/v1/apply/email')
  }
  else if (nhslogin === "no") {
    res.redirect('/v6/apply/national-insurance-number')
  }
  else {
    res.redirect('/future/v1/apply/who-applying-for')
  }

})

// Email
router.post('/future/v1/email', function (req, res) {

  var email = req.session.data['email']

  if (email) {
    res.redirect('/future/v1/apply/password')
  }
  else {
    res.redirect('/future/v1/apply/email')
  }

})

// Password
router.post('/future/v1/password', function (req, res) {

  var password = req.session.data['password']

  if (password) {
    res.redirect('/future/v1/apply/check-code')
  }
  else {
    res.redirect('/future/v1/apply/password')
  }

})

// Check code
router.post('/future/v1/security-code', function (req, res) {

  var securitycode = req.session.data['securitycode']

  if (securitycode) {
    res.redirect('/future/v1/apply/authorise')
  }
  else {
    res.redirect('/future/v1/apply/check-code')
  }

})

