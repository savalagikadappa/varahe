const express = require('express');
const {
  getTurnoutByState,
  getPartySeatShare,
  getGenderRepresentation,
  getMarginDistribution
} = require('../controllers/analyticsController');
const validate = require('../middleware/validate');
const { yearRangeSchema } = require('../validation/schemas');

const router = express.Router();

router.get('/turnout/by-state', validate(yearRangeSchema), getTurnoutByState);
router.get('/party/seat-share', validate(yearRangeSchema), getPartySeatShare);
router.get('/gender/representation', validate(yearRangeSchema), getGenderRepresentation);
router.get('/margin-distribution', validate(yearRangeSchema), getMarginDistribution);

module.exports = router;
