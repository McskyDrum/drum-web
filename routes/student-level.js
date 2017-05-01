/**
 * Created by liuyao on 2017/3/18.
 */
var express = require('express');
var router = express.Router();


router.get('/findAllLevel', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {"id": 1,"levelName": "初级","deduct": 10033,defaultLevel:true},
            {"id": 2,"levelName": "中级","deduct": 20000,defaultLevel:false},
            {"id": 3,"levelName": "高级","deduct": 30000,defaultLevel:false}
        ]
    };
    res.send(value);
});

router.get('/loadLevel', function(req, res, next) {
    var value = {
        success:true,
        level:{"id": 1,"levelName": "初级","deduct": 10033,defaultLevel:true}
    };
    res.send(value);
});

router.post('/updateLevel', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/addLevel', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/delLevel', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/doSetDefault', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});




module.exports = router;