/**
 * Created by liuyao on 2017/3/4.
 */
var express = require('express');
var router = express.Router();

router.get('/adminInfo', function(req, res, next) {
    var value = {
        success:true,
        id:13,
        name:"管理员名称",
        account:"nnajdsandsdsa"
    };
    res.send(value);
});
/* GET users listing. */
router.post('/doLogin', function(req, res, next) {
    var value = {
        success:false,
        message:"账号或者密码错误",
        id:13,
        name:"管理员名称"
    };
    res.send(value);
});

router.post('/resetPassword', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/adminResetPassword', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/checkCashRecharge', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/updataAdminInfo', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});


router.post('/addAdmin', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

router.post('/outLogin', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});

var mumeList = [
    {name:"学生管理",defaultState:"student.list",icon:"glyphicon-user",state:"student"},
    {name:"教师管理",defaultState:"teacher.list",icon:"glyphicon-leaf",state:"teacher"},
    {name:"课程管理",defaultState:"course.list",icon:"glyphicon-tasks",state:"course"},
    {name:"财务管理",defaultState:"cash.cashAudit",icon:"glyphicon-list-alt",state:"table"},
    {name:"系统设置",defaultState:"system.adminList",icon:"glyphicon-cog",state:"system"}
];

var secondListMap = {
    student:[{name:"学籍管理",state:"student.list"},{name:"学生告假管理",state:"student.leave"}],
    teacher:[{name:"教师管理",state:"teacher.list"}],
    course:[{name:"课程列表",state:"course.list"},{name:"未处理的已结束课程",state:"course.waitConduct"}],
    cash:[{name:"资金变动审核",state:"cash.cashAudit"}],
    system:[{name:"管理员设置",state:"system.adminList"},{name:"学生等级设置",state:"system.levelList"},{name:"自动告假处理设置",state:"system.leaveList"}]
};

router.get('/getMumeList', function(req, res, next) {
    var value = {
        success:true,
        mumeList:mumeList,
        secondListMap:secondListMap
    };
    res.send(value);
});


router.post('/loadAdminList', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:13,adminName:"刘瑶",superAdmin:1,account:"222222",canRecharge:true},
            {id:2,adminName:"管理员姓名",superAdmin:1,account:"222222",canRecharge:true},
            {id:3,adminName:"管理员姓名",superAdmin:1,account:"222222",canRecharge:true},
            {id:41,adminName:"管理员姓名",superAdmin:0,account:"222222",canRecharge:false},
            {id:5,adminName:"管理员姓名",superAdmin:1,account:"222222",canRecharge:true},
            {id:2,adminName:"管理员姓名",superAdmin:0,account:"222222",canRecharge:true}
        ],
        total:2
    };
    res.send(value);
});



module.exports = router;

