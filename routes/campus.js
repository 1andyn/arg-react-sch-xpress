var express = require('express');
var router = express.Router();

var mongodb = require('../mongo');

/* GET Campus List */
router.get('/list/', function (req, res, next) {
    var collection = mongodb.get().collection('campuses');

    collection.find({}).project({ _id: 0, strSchoolCode: 1, strSchoolDesc: 1 }).toArray(function (err, data) {
        res.json(data);
    })

    //logging
    var logging = mongodb.get().collection('requests');
    var timestamp = Date().getTime()
    var log = {strRequest : "campus", strParameter : "", dtmTimestamp : new Date().getTime()};
    logging.insertOne(log, function(err, res) {
            if (err)
                console.log(err) ;
    });

});

module.exports = router;