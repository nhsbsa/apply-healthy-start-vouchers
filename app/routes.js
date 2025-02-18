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
const https = require("https");

// API

const axios = require('axios');

// CONSTANTS

const today = new Date(Date.now());
let vitaminProviders = require('./data/vitamin-locations');
const { listenerCount } = require('gulp');

// CLEAR DATA
router.post('/clear-data', function (req, res) {
  req.session.destroy()
  res.redirect('/')
})

// ****************************************
// Route File Versions
// ****************************************

router.use('/v27/apply', require('./views/v27/_routes'));
router.use('/v26-ecj/apply', require('./views/v26-ecj/_routes'));
router.use('/v26-apply-journey/apply', require('./views//v26-apply-journey/_routes'));
router.use('/v25/apply', require('./views/v25/_routes'));
router.use('/v24/apply', require('./views/v24/_routes'));
router.use('/v23/apply', require('./views/v23/_routes'));
router.use('/v22/apply', require('./views/v22/_routes'));
router.use('/v21/apply', require('./views/v21/_routes'));
router.use('/v20/apply', require('./views/v20/_routes'));
router.use('/v19/apply', require('./views/v19/_routes'));
router.use('/v18/apply', require('./views/v18/_routes'));
router.use('/v17/apply', require('./views/v17/_routes'));
router.use('/v16/apply', require('./views/v16/_routes'));
router.use('/v15/apply', require('./views/v15/_routes'));
router.use('/v14/apply', require('./views/v14/_routes'));
router.use('/v13/apply', require('./views/v13/_routes'));
router.use('/v12/apply', require('./views/v12/_routes'));
router.use('/v11/apply', require('./views/v11/_routes'));
router.use('/v10/apply', require('./views/v10/_routes'));
router.use('/v9/apply', require('./views/v9/_routes'));
router.use('/v8/apply', require('./views/v8/_routes'));
router.use('/v7/apply', require('./views/v7/_routes'));
router.use('/v6/apply', require('./views/v6/_routes'));
router.use('/v5/apply', require('./views/v5/_routes'));
router.use('/v4/apply', require('./views/v4/_routes'));
router.use('/v3/apply', require('./views/v3/_routes'));
router.use('/v2/apply', require('./views/v2/_routes'));
router.use('/v1/apply', require('./views/v1/_routes'));


router.use('/future/v1/apply', require('./views/future/_routes'));
router.use('/current/apply', require('./views/current/_routes'));

router.use('/v1-error-and-fraud/apply', require('./views/v1-error-and-fraud/_routes'));

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
// Under 18 Persona
// ****************************************

// Sarah Green (not on universal credit - follows file upload journey)

// National Insurance number = MN 98 75 44 G
// Date of birth = 01 / 01 / 2004
// 1st Line of Address = 13 Palm Road
// Postcode = NR33 4GT
// Pregnant? = YES or NO (No to get kickout screen)
// Children Under 1? = NO
// Children Between 1 & 4? = NO

// Sarah Blue (on universal credit - follows file upload journey)

// National Insurance number = OP 97 74 43 H
// Date of birth = 01 / 01 / 2004
// 1st Line of Address = 13 Palm Road
// Postcode = NR33 4GT
// Pregnant? = YES or NO
// Children Under 1? = YES
// Children Between 1 & 4? = NO

// Jane Yellow (on universal credit - post evidence journey)

// National Insurance number = JN 33 35 46 K
// Date of birth = 01 / 01 / 2004
// 1st Line of Address = 13 Palm Road
// Postcode = NR33 4GT
// Pregnant? = YES or NO
// Children Under 1? = YES
// Children Between 1 & 4? = NO

// ****************************************

// Add your routes here - above the module.exports line

module.exports = router;