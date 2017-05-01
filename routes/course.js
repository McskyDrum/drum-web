/**
 * Created by liuyao on 2017/3/20.
 */
var express = require('express');
var router = express.Router();

router.get('/loadAllCourse', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,courseName:"架子鼓1",teacherName:"刘瑶"},//默认老师
            {id:2,courseName:"架子鼓2",teacherName:"刘瑶"},
            {id:3,courseName:"架子鼓3",teacherName:"刘瑶"},
            {id:4,courseName:"架子鼓4",teacherName:"刘瑶"}
        ]
    };
    res.send(value);
});

router.post('/loadPaiqiListPage', function(req, res, next) {
    var now = new Date();
    var time = now.getTime()+3600000;
    var end = time+3600000;
    var value = {
        success:true,
        list:[
            {id:1,courseName:"架子鼓",startTime:now-1,endTime:time,teacherName:"刘瑶",total:30},
            {id:2,courseName:"架子鼓",startTime:time,endTime:end,teacherName:"刘瑶",total:30},
            {id:3,courseName:"架子鼓",startTime:time,endTime:end,teacherName:"刘瑶",total:30}
        ],
        total:40
    };
    res.send(value);
});

router.get('/loadOneCourse', function(req, res, next) {
    var value = {
        success:true,
        id:1,
        courseName:"架子鼓1",
        address:"长沙",//默认上课地址
        teacherId:1
    };
    res.send(value);
});

/**
 * 获取当前课程还能导入的节数
 */
router.get('/findCourseCount', function(req, res, next) {
    var value = {
        success:true,
        count:20
    };
    res.send(value);
});

router.post('/importPaiqi', function(req, res, next) {
    var value = {
        success:true,
        count:20//导入成功的排期数
    };
    res.send(value);
});

router.post('/updataCourse', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/insertCourse', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/delCourse', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

module.exports = router;

