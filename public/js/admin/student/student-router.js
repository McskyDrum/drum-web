/**
 * Created by liuyao on 2017/3/4.
 */

define(["student","student-level","student-leave"],function(student,studentLevel,studentLeave){
    student.config(Config);

    Config.$inject = ['$stateProvider',"$httpProvider"];
    function Config($stateProvider,$httpProvider){
        $stateProvider.state("student",{template:'<div ui-view></div>'})
                      .state('student.list',{url:"/student/list",templateUrl:'/html/admin/student/students.html',controller:'StudentListController',controllerAs:'mv'})
                      .state('student.list.cash',{url:"/cash/:id",templateUrl:'/html/admin/student/cash.html',controller:"StudentCashController",controllerAs:"mv"})
                      .state("student.list.paike",{url:"/paike/:id",templateUrl:"/html/admin/student/paike.html",controller:"StudentPaikeController",controllerAs:"mv"})
                      .state("student.list.paiqi",{url:"/paiqi/:id",templateUrl:"/html/admin/student/paiqi.html",controller:"StudentPaiqiController",controllerAs:"mv"})
                      .state("student.list.onePaiqi",{url:"/paiqi/:id/:courseId",templateUrl:"/html/admin/student/kechengpaiqi.html",controller:"StudentOnePaiqiController",controllerAs:"mv"})
                      .state("student.list.history",{url:"/history/:id",templateUrl:"/html/admin/student/history.html",controller:"StudentHistoryController",controllerAs:"mv"})
                      .state("student.leave",{url:"/student/leave",templateUrl:"/html/admin/leave/leave.html",controller:"StudentLeaveListController",controllerAs:"mv"});
    }

    return student;
});