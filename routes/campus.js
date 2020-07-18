var express = require('express');
var router = express.Router();

var mongodb = require('../mongo');

/* GET Campus List */
router.get('/list/', function (req, res, next) {
    var collection = mongodb.get().collection('campuses');

    collection.find({}).project({ _id: 0, strSchoolCode: 1, strSchoolDesc: 1 }).toArray(function (err, data) {
        res.json(data);
    })

});

module.exports = router;