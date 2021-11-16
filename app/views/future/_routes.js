// ********************************
// APPLY (Future)
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

module.exports = router;