/**
 * Created by liuyao on 2017/4/24.
 */
var express = require('express');
var router = express.Router();


router.get('/loadCourseSchedule', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,studentNum:"2017060500000004",studentName:"刘瑶",level:"初级",state:0},//id为学生排期的Id
            {id:2,studentNum:"2017060500000004",studentName:"刘瑶",level:"初级",state:1},
            {id:3,studentNum:"2017060500000004",studentName:"刘瑶",level:"初级",state:1},
            {id:4,studentNum:"2017060500000004",studentName:"刘瑶",level:"初级",state:0}
        ]
    };
    res.send(value);
});

router.get('/loadOneSchedule', function(req, res, next) {
    var value = {
        success:true,
        schedule:{
            id:1,
            courseId:2,
            teacherId:1,
            startTime:1493463564474,
            endTime:1493044793844,
            address:'长沙'
        }
    };
    res.send(value);
});

router.post('/updataCourseSchedule', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/doDelCourseSchedule', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.get('/findCanImportPaiqiStudent', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",level:"初级"},
            {id:2,studentNum:"20160311202332221221",studentName:"刘瑶",level:"初级"},
            {id:3,studentNum:"20160311202332221221",studentName:"刘瑶",level:"初级"},
            {id:4,studentNum:"20160311202332221221",studentName:"刘瑶",level:"初级"},
            {id:5,studentNum:"20160311202332221221",studentName:"刘瑶",level:"初级"},
            {id:6,studentNum:"20160311202332221221",studentName:"刘瑶",level:"初级"}
        ],
    };
    res.send(value);
});

/**
 * 导入时一定要验证该学生是否选修了这门课,如果没有直接continue
 */
router.post('/batchImportStudentSchedule', function(req, res, next) {
    var value = {
        success:true,
        count:1,//成功导入的学生数
        defeatCount:10//导入失败的学生数
    };
    res.send(value);
});



module.exports = router;