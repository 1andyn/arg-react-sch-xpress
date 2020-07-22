var express = require('express');
var router = express.Router();

var mongodb = require('../mongo');

/* GET Subject List */
router.get('/:sid/:tid', function (req, res, next) {
    var collection = mongodb.get().collection('subjects');
    var school_id = req.params.sid;
    var term_id = req.params.tid;
    collection.find({strSchoolCode : school_id , strTermCode : term_id}).project({ _id: 0, strSubCode: 1, strSubDesc: 1 }).toArray(function (err, data) {
        res.json(data);
    })

    //logging
    var logging = mongodb.get().collection('requests');
    var log = {strRequest : "subject",  strParameter : "school_id: " + school_id  + "term_id: " + term_id, dtmTimestamp : new Date().getTime()};
    logging.insertOne(log, function(err, res) {
        if (err)
            console.log(err) ;
    });
});

module.exports = router;