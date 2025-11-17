const express = require('express');
const { getElections } = require('../controllers/electionController');
const validate = require('../middleware/validate');
const { electionQuerySchema } = require('../validation/schemas');

const router = express.Router();

router.get('/elections', validate(electionQuerySchema), getElections);

module.exports = router;
