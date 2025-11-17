const express = require('express');
const { searchCandidates } = require('../controllers/searchController');
const validate = require('../middleware/validate');
const { candidateSearchSchema } = require('../validation/schemas');

const router = express.Router();

router.get('/search/candidates', validate(candidateSearchSchema), searchCandidates);

module.exports = router;
