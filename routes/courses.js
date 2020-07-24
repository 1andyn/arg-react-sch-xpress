var express = require('express');
var router = express.Router();

var mongodb = require('../mongo');

/* GET Course List */
router.get('/:sid/:tid/:jid', function (req, res, next) {
    var collection = mongodb.get().collection('courses');
    var school_id = req.params.sid;
    var term_id = req.params.tid;
    var subj_id = req.params.jid;
    collection.find({strSchoolCode : school_id , strTermCode : term_id, strSubCode : subj_id}).project(
        { _id: 0, 
            strSubCode: 1, 
            strSubDesc: 1, 
            arrMiscData : 1,
            strCRN : 1,
            strCourse : 1,
            strSection : 1,
            strTitle : 1,
            strCredits : 1,
            strInstr : 1,
            strInstrLong : 1,
            intEnrollment : 1,
            intSeats : 1,
            intWaitlisted : 1,
            intWaitAvail : 1,
            arrDays : 1,
            arrDays2 : 1,
            strRoom : 1,
            strRoomLong : 1,
            strRoom2 : 1,
            strRoomLong2 : 1,
            strOther : 1,
            intTimeStart : 1,
            intTimeEnd : 1,
            intTimeStart2 : 1,
            intTimeEnd2 : 1,
            strDateStart : 1,
            strDateEnd : 1,
            strDateStart2 : 1,
            strDateEnd2 : 1
        }).toArray(function (err, data) {
        res.json(data);
    })

    //logging
    var logging = mongodb.get().collection('requests');
    var log = {strRequest : "subject",  
    strParameter : "school_id: " + school_id  + " term_id: " + term_id + " sub_id: " + subj_id, 
    dtmTimestamp : new Date().getTime()};
    logging.insertOne(log, function(err, res) {
        if (err)
            console.log(err) ;
    });
});

module.exports = router;