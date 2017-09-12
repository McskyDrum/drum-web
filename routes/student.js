/**
 * Created by liuyao on 2017/3/18.
 */
var express = require('express');
var router = express.Router();


router.post('/findStudentPage', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",sex:1,phone:18674351220,level:"初级",remindMoney:10000,mome:"我叫备注",gmtCreate:1489737958870,birthday:1489737958870},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",sex:1,phone:18674351220,level:"初级",remindMoney:10000,mome:"我叫备注",gmtCreate:1489737958870,birthday:1489737958870},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",sex:1,phone:18674351220,level:"初级",remindMoney:10000,mome:"我叫备注",gmtCreate:1489737958870,birthday:1489737958870},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",sex:1,phone:18674351220,level:"初级",remindMoney:10000,mome:"我叫备注",gmtCreate:1489737958870,birthday:1489737958870},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",sex:1,phone:18674351220,level:"初级",remindMoney:10000,mome:"我叫备注",gmtCreate:1489737958870,birthday:1489737958870},
            {id:1,studentNum:"20160311202332221221",studentName:"刘瑶",sex:1,phone:18674351220,level:"初级",remindMoney:10000,mome:"我叫备注",gmtCreate:1489737958870,birthday:1489737958870}
        ],
        total:30
    };
    res.send(value);
});

router.get('/findStudentLevelConfig', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,name:"乐器名称",studentLevelId:1,levelList:[
                {"id": 1,"levelName": "初级","deduct": 10033,defaultLevel:true},
                {"id": 2,"levelName": "中级","deduct": 20000,defaultLevel:false},
                {"id": 3,"levelName": "高级","deduct": 30000,defaultLevel:false}
            ]}
        ]
    };
    res.send(value);
});


router.post('/cashFlowList', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,changeMoney:10000,afterMoney:10000,reasonMessage:"手动加款",adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870},
            {id:1,changeMoney:10000,afterMoney:10000,reasonMessage:"手动加款",adminName:"刘瑶",mome:"初级",gmtCreate:1489737958870},
            {id:1,changeMoney:-10000,afterMoney:10000,reasonMessage:"手动加款",adminName:"刘瑶",mome:"初级",gmtCreate:1489737958870},
            {id:1,changeMoney:-10000,afterMoney:10000,reasonMessage:"课程:架子鼓 扣费",adminName:"",mome:"我叫备注",gmtCreate:1489737958870},
            {id:1,changeMoney:10000,afterMoney:10000,reasonMessage:"手动加款",adminName:"刘瑶",mome:"初级",gmtCreate:1489737958870},
            {id:1,changeMoney:10000,afterMoney:10000,reasonMessage:"手动加款",adminName:"刘瑶",mome:"初级",gmtCreate:1489737958870}
        ],
        total:80
    };
    res.send(value);
});

router.get('/findOneStudentByNum', function(req, res, next) {
    var value = {
        success:true,
        student:{ //未查询到,此字段为null(不要再json中加入此字段)
            "id": 1,
            "studentNum": "20160311202332221221",
            "studentName": "高天成",
            "phoneNum": "12345679151",
            "level": "高级",//注意此字段
            "remindMoney": 51401,
            mome:"hahahhahhhahahah",
            "createDate": 1489389935000
        }
    };
    res.send(value);
});

router.get('/findOneStudent', function(req, res, next) {
    var value = {
        success:true,
        student:{
            "id": 1,
            "studentNum": "1222",
            "studentName": "高天成",
            "phoneNum": "12345679151",
            "remindMoney": 51401,
            mome:"hahahhahhhahahah",
            "createDate": 1489389935000
        }
    };
    res.send(value);
});

router.post('/updataStudent', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/findToken', function(req, res, next) {
    var value = {
        success:true,
        token:"dwdsadsadsaadas"
    };
    res.send(value);
});


router.post('/addMoney', function(req, res, next) {
    var value = {
        success:true,
        message:"充值请求提交成功,等待审核"
    };
    res.send(value);
});

router.post('/reduceMoney', function(req, res, next) {
    var value = {
        success:true,
        message:"扣费请求提交成功,等待审核"
    };
    res.send(value);
});


router.post('/loadStudentCourseList', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {courseId:1,courseName:"架子鼓",levelName:"架子鼓",teacherName:"刘瑶",total:80,remain:50},
            {courseId:1,courseName:"架子鼓",levelName:"架子鼓",teacherName:"刘瑶",total:80,remain:50},
            {courseId:1,courseName:"架子鼓",levelName:"架子鼓",teacherName:"刘瑶",total:80,remain:50},
            {courseId:1,courseName:"架子鼓",levelName:"架子鼓",teacherName:"刘瑶",total:80,remain:50},
            {courseId:1,courseName:"架子鼓",levelName:"架子鼓",teacherName:"刘瑶",total:80,remain:50}
        ]
    };
    res.send(value);
});

/**
 * 增加学生选课
 */
router.post('/addCourse', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

/**
 * 删除学生选课
 */
router.post('/delCourse', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

/**
 * 查询选择某课程的所有学生
 * 区别查询某课程下还能被导入的学生列表
 */
router.get("/findSelectCourseStudent",function(req, res, next){
    var value = {
        success:true,
        list:[
            {id:1,studentNum:"56346545615313",studentName:"刘瑶",level:"初级"},
            {id:2,studentNum:"56346545615313",studentName:"刘瑶",level:"初级"},
            {id:3,studentNum:"56346545615313",studentName:"刘瑶",level:"初级"},
            {id:4,studentNum:"56346545615313",studentName:"刘瑶",level:"初级"}
        ]
    };
    res.send(value);
});

router.post('/loadPaiqiList', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:1},
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:1},
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",musicalName:"架子鼓",levelName:"初级",startTime:1489737958870,endTime:1489737958870,teacherName:"刘瑶",state:0},
        ],
        total:80
    };
    res.send(value);
});

router.post('/loadHistoryList', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:1},
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:1},
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:0},
            {id:1,courseName:"架子鼓",startTime:1489737958870,endTime:1489737958870,money:10000,teacherName:"刘瑶",state:0},
        ],
        total:80
    };
    res.send(value);
});





module.exports = router;
