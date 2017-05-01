/**
 * Created by liuyao on 2017/4/3.
 */
var express = require('express');
var router = express.Router();


router.post('/loadLeavePage', function(req, res, next) {//id为学生课程排期的id
    var value = {
        success:true,
        list:[
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:{type:1,leaveValue:77}},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:null},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:{type:0,leaveValue:77}},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:{type:1,leaveValue:77}},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:{type:1,leaveValue:77}},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:{type:0,leaveValue:77}},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶","levelName": "中级",courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,leaveTime:1489737958870,leaveConfig:{type:0,leaveValue:77}}
        ],
        total:80
    };
    res.send(value);
});

router.post('/editLevelConfig', function(req, res, next) {//id为学生课程排期的id
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/delLevelConfig', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/saveLeaveRole', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/delLeaveRole', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.get('/loadcheckSwitch', function(req, res, next) {
    var value = {
        success:true,show:true
    };
    res.send(value);
});

router.post('/checkRoleSwitch', function(req, res, next) {
    var value = {
        success:true,show:false
    };
    res.send(value);
});


router.get('/loadLeaveList', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,title:"规则1",type:1,reduceValue:80,conditionType:1,conditionValue:7},
            {id:2,title:"规则2",type:1,reduceValue:80,conditionType:1,conditionValue:7},
            {id:3,title:"规则3",type:1,reduceValue:80,conditionType:0},
            {id:4,title:"规则4",type:1,reduceValue:80,conditionType:0}
        ]
    };
    res.send(value);
});

router.post('/sortLeaveRole', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

module.exports = router;