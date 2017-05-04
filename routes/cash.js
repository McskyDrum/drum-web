/**
 * Created by Administrator on 2017/5/4 0004.
 */
var express = require('express');
var router = express.Router();

router.post('/loadCashLogPage', function(req, res, next) {
    var value = {
        success:true,
        list:[
            {id:1,changeMoney:10000,studentNum:"100062656222",studentName:'哈哈哈',adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870},
            {id:2,changeMoney:-10000,studentNum:"100062656222",studentName:'哈哈哈',adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870},
            {id:3,changeMoney:-10000,studentNum:"100062656222",studentName:'哈哈哈',adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870},
            {id:4,changeMoney:-10000,studentNum:"100062656222",studentName:'哈哈哈',adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870},
            {id:5,changeMoney:10000,studentNum:"100062656222",studentName:'哈哈哈',adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870},
            {id:6,changeMoney:10000,studentNum:"100062656222",studentName:'哈哈哈',adminName:"刘瑶",mome:"我叫备注",gmtCreate:1489737958870}
        ],
        total:80
    };
    res.send(value);
});

router.get('/findCashAuditSwitch', function(req, res, next) {
    var value = {
        success:true,
        cashAuditSwitch:true
    };
    res.send(value);
});

router.post('/chargeCashAuditSwitch', function(req, res, next) {
    var value = {
        success:true,
        cashAuditSwitch:false//改变后的结果
    };
    res.send(value);
});

router.post('/auditPass', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});




module.exports = router;