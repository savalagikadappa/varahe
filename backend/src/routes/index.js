const express = require('express');
const electionRoutes = require('./electionRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const searchRoutes = require('./searchRoutes');

const router = express.Router();

router.use('/', electionRoutes);
router.use('/', analyticsRoutes);
router.use('/', searchRoutes);

module.exports = router;
