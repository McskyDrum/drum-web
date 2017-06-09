/**
 * Created by liuyao on 2017/4/13.
 */
define(["angular"],function (angular) {
    var teacher = angular.module("teacher",['ui.bootstrap','ngAnimate','ui.router']);
    teacher.config(Config);
    teacher.controller("TeacherListController",TeacherListController);
    teacher.controller("TeacherPaikeController",TeacherPaikeController);
    teacher.controller("CreateTeacherController",CreateTeacherController);
    teacher.service("TeacherService",TeacherService);



    TeacherListController.$inject = ["pageService","model","$http","$uibModal"];
    function TeacherListController(pageService,model,$http,$uibModal){
        pageService.init("TeacherListController");
        var mv = this;
        mv.teacherList = [];
        mv.page={
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };
        var tName = "";
        mv.tName = "";
        mv.query = query;
        mv.setEnble = setEnble;
        mv.setDisEnble = setDisEnble;
        mv.createTeacher = createTeacher;

        function query(){
            mv.page.currentPage = 1;
            tName = mv.tName;//持久化检索条件
            loadTeacherList();
        }

        loadTeacherList();

        function loadTeacherList(){
            pageService.setIndex(mv.page.currentPage);
            var params = {
                offset:(pageService.getIndex()-1) * mv.page.max,
                max:mv.page.max
            };
            !!tName && (params.tName = tName);

            mv.page.currentPage = pageService.getIndex();
            if(!pageService.isCanLoad()){
                return;
            }
            $http.post("/adminTeacher/findTeacherPage",params).success(function(data){
                if(data.success){
                    mv.teacherList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message(data.message);
                }
            });
            pageService.setIndex(mv.page.currentPage);
        }

        function setEnble(index){
            var teacher = mv.teacherList[index];
            $http.post("/adminTeacher/setEnble",{id:teacher.id}).success(function(data){
                if(data.success){
                    model.message(teacher.tName+"的状态已经切换为有效");
                    loadTeacherList();
                }else{
                    model.message(data.message);
                }
            })
        }

        function setDisEnble(index){
            var teacher = mv.teacherList[index];
            $http.post("/adminTeacher/setDisEnble",{id:teacher.id}).success(function(data){
                if(data.success){
                    model.message(teacher.tName+"的状态已经切换为无效");
                    loadTeacherList();
                }else{
                    model.message(data.message);
                }
            })
        }

        function createTeacher() {
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'createTeacher.html',
                controller: 'CreateTeacherController',
                controllerAs:'p',
                backdrop:'static',
            });
            modalInstance.result.then(function(){
                loadTeacherList()
            });
        }
    }

    CreateTeacherController.$inject = ["$uibModalInstance","$http","model"];
    function CreateTeacherController($uibModalInstance,$http,model){
        var mv = this;
        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        function submit() {
            if (mv.form.$invalid) {//拦截表单验证不通过的情况
                return;
            }
            var params = {
                phoneNum: mv.phoneNum,
                name: mv.name
            };
            $http.post("/adminTeacher/createTeacher",params).success(function (data) {
                if (data.success) {
                    model.message("教师创建成功");
                    $uibModalInstance.close();
                } else {
                    model.message(data.message);
                }
            })
        }
    }

    TeacherPaikeController.$inject = ["model","$http","CourseService","$stateParams"];
    function TeacherPaikeController(model,$http,CourseService,$stateParams){
        var mv = this;
        mv.courseList = [];
        mv.courseId = null;
        var courseId;
        CourseService.loadAllCourse().then(function(list){
            mv.courseList = list;
        });

        mv.query = query;
        function query(){
            mv.page.currentPage = 1;
            courseId = mv.courseId;//持久化检索条件
            loadTeacherPaikePage();
        }

        var teacherId = $stateParams.id;
        mv.page={
            currentPage:1,
            max:20,
            total:0
        };
        mv.paiqiList = [];
        mv.getCourseTime = getCourseTime;


        loadTeacherPaikePage();
        function loadTeacherPaikePage(){
            var params = {
                offset:(mv.page.currentPage-1) * mv.page.max,
                max:mv.page.max,
                teacherId:teacherId
            };
            !!courseId && (params.courseId = courseId);

            $http.post("/adminTeacher/findTeacherPaikePage",params).success(function(data){
                if(data.success){
                    mv.paiqiList = data.list;
                    mv.page.total = data.total;
                    mv.teacherName = data.teacherName;
                }else{
                    model.message(data.message);
                }
            });
        }

        function getCourseTime(paike){
            var time = paike.endTime - paike.startTime;
            return parseInt(time/60000);
        }
    }

    TeacherService.$inject = ["$http","$q"];
    function TeacherService($http,$q){

        function loadAllEnabelTeacher(){
            var promise = $q.defer();
            $http.get("/adminTeacher/loadAllEnabelTeacher").success(function(data){
                if(data.success){
                    promise.resolve(data.list);
                }else{
                    promise.reject(data.message);
                }
            });
            return promise.promise;
        }

        return {
            loadAllEnabelTeacher:loadAllEnabelTeacher
        }
    }

    Config.$inject = ['$stateProvider',"$httpProvider"];
    function Config($stateProvider,$httpProvider){
        $stateProvider.state("teacher",{template:'<div ui-view></div>'})
            .state('teacher.list',{url:"/teacher/list",templateUrl:'/html/admin/teacher/teachers.html',controller:'TeacherListController',controllerAs:'mv'})
            .state('teacher.list.qingdan',{url:"/paike/:id",templateUrl:'/html/admin/teacher/shangkeqingdan.html',controller:'TeacherPaikeController',controllerAs:'mv'})
    }

    return teacher;
});
