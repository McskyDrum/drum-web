/**
 * Created by liuyao on 2017/4/18.
 */
var express = require('express');
var router = express.Router();

router.post('/findTeacherPage', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,tName:"刘瑶",phoneNum:"18674351220",cCount:20,enable:true},
            {id:2,tName:"刘瑶",phoneNum:"18674351220",cCount:20,enable:true},
            {id:3,tName:"刘瑶",phoneNum:"18674351220",cCount:20,enable:true},
            {id:4,tName:"刘瑶",phoneNum:"18674351220",cCount:20,enable:true}
        ],
        total:30
    };
    res.send(value);
});
//获取所有有效的老师列表
router.get('/loadAllEnabelTeacher', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,tName:"刘瑶1"},
            {id:2,tName:"刘瑶2"},
            {id:3,tName:"刘瑶3"},
            {id:4,tName:"刘瑶4"}
        ]
    };
    res.send(value);
});

router.post('/findTeacherPaikePage', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489767958870,studentCount:20,ower:true},//id为课程排期的Id
            {id:2,courseName:"架子鼓",startTime:1489737958870,endTime:1489767958870,studentCount:20,ower:true},
            {id:3,courseName:"架子鼓",startTime:1489737958870,endTime:1489767958870,studentCount:20,ower:true},
            {id:4,courseName:"架子鼓",startTime:1489737958870,endTime:1489767958870,studentCount:20,ower:true}
        ],
        total:30,
        teacherName:"刘瑶"
    };
    res.send(value);
});

router.post('/setEnble', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/setDisEnble', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

module.exports = router;