var express = require('express');
var router = express.Router();

var mongodb = require('../mongo');

/* GET term List */
router.get('/:sid', function (req, res, next) {
    var collection = mongodb.get().collection('semester');
    var school_id = req.params.sid;
    collection.find({strSchoolCode : school_id}).project({ _id: 0, strTermCode: 1, strTermDesc: 1 }).toArray(function (err, data) {
        res.json(data);
    })

    //logging
    var logging = mongodb.get().collection('requests');
    var log = {strRequest : "term",  strParameter : "school_id", dtmTimestamp : new Date().getTime()};
    logging.insertOne(log, function(err, res) {
        if (err)
            console.log(err) ;
    });
});

module.exports = router;