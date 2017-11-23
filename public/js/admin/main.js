/**
 * Created by liuyao on 2017/3/4.
 */
require.config({
    baseUrl:"/js/",
    paths:{
        'jquery': 'lib/jquery.min',
        'jquery-ui-sortable':'lib/jquery-ui-sortable.min',
        'quicksearch':'lib/jquery.quicksearch',
        'multi-select':'lib/jquery.multi-select',
        'angular': 'lib/angular.min',
        'angular-animate':'lib/angular-animate.min',
        'animate':'lib/animate',
        'angular-ui-router':'lib/angular-ui-router.min',
        'angular-sortable':'lib/angular-sortable.min',
        'ui-bootstrap-tpls':'lib/ui-bootstrap-tpls-0.14.3.min',
        'app':"admin/app",
        'model':'admin/model',
        'admin':'admin/system/admin',
        'musical':"admin/system/musical-level",
        'system':"admin/system/system",
        'student-router':"admin/student/student-router",
        'student':"admin/student/student",
        'student-leave':"admin/student/student-leave",
        'course':"admin/course/course",
        "course-router":"admin/course/course-router",
        'teacher':"admin/teacher/teacher",
        'cash-audit':'admin/cash/cash-audit',
        'cash-router':'admin/cash/cash-router'
    },
    shim:{
        'quicksearch':{exports:'quicksearch',deps:["jquery"]},
        'multi-select':{exports:'multi-select',deps:["jquery","quicksearch"]},
        'angular':{exports:'angular',deps:["jquery","multi-select"]},
        'animate':{exports:'animate',deps:["angular"]},
        'angular-animate':{exports:'angular-animate',deps:["angular"]},
        'angular-ui-router':{exports: 'angular-ui-router',deps:['angular']},
        'angular-sortable':{exports: 'angular-sortable',deps:['angular','jquery-ui-sortable']},
        'ui-bootstrap-tpls':{exports:"ui-bootstrap-tpls",deps:['angular','angular-animate']}
    },
    deps:['app'],
    //urlArgs: "bust=" + (new Date()).getTime()  //防止读取缓存，调试用
});

define(['angular',"app","system","student-router","teacher","course-router","cash-router","model"],function(angular){
    'use strict';
    angular.bootstrap(document,['app',"system","student","teacher","course","cashRouter","model"]);
});