/**
 * Created by liuyao on 2017/5/8.
 */
var express = require('express');
var router = express.Router();

router.post('/sendCode', function(req, res, next) {
    var value = {
        success:true
    };
    res.send(value);
});


module.exports = router;