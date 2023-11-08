let router = require('express').Router();
let mongoose = require("mongoose");


router.use('/api', require('./api'));

module.exports = router;
