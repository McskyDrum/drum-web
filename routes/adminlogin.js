/**
 * Created by liuyao on 2017/3/4.
 */
var express = require('express');
var router = express.Router();

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


module.exports = router;