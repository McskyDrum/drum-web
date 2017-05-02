/**
 * Created by liuyao on 2017/3/4.
 */
define(["angular"],function (angular) {
    var student = angular.module("student",['ui.bootstrap','ngAnimate','ui.router',"studentLevel","studentLeave"]);

    student.controller("StudentEditController",StudentEditController);
    student.controller("StudentListController",StudentListController);
    student.controller("StudentCashController",StudentCashController);
    student.controller("StudentCashChangeController",StudentCashChangeController);
    student.controller("StudentPaikeController",StudentPaikeController);
    student.controller("StudentOnePaiqiController",StudentOnePaiqiController);
    student.controller("StudentAddCourseController",StudentAddCourseController);
    student.controller("StudentPaiqiController",StudentPaiqiController);
    student.controller("StudentHistoryController",StudentHistoryController);
    student.service("StudentService",StudentService);


    StudentListController.$inject = ["pageService","$http","model","$uibModal","$scope"];
    function StudentListController(pageService,$http,model,$uibModal,$scope){
        pageService.init("StudentListController");
        var mv = this;
        mv.studentList = [];
        mv.page={
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };
        mv.sNum = "";
        mv.sName = "";
        var sNum = "";
        var sName = "";

        mv.loadStudentList = loadStudentList;
        mv.query = query;
        mv.editStudent = editStudent;

        loadStudentList();

        $scope.$on("cashChange",function(){
            loadStudentList();
        });


        function query(){
            mv.page.currentPage = 1;
            sNum = mv.sNum;//持久化检索条件
            sName = mv.sName;
            loadStudentList();
        }

        function loadStudentList(){
            pageService.setIndex(mv.page.currentPage);
            var params = {
                offset:(pageService.getIndex()-1) * mv.page.max,
                max:mv.page.max
            };
            !!sNum && (params.studentNum = sNum);
            !!sName && (params.studentName = sName);

            mv.page.currentPage = pageService.getIndex();
            if(!pageService.isCanLoad()){
                return;
            }
            $http.post("/adminStudent/findStudentPage",params).success(function(data){
                if(data.success){
                    mv.studentList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message(data.message);
                }
            });
            pageService.setIndex(mv.page.currentPage);
        }

        function editStudent(index){
            var student = mv.studentList[index];
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'editStudent.html',
                controller: 'StudentEditController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    id:function(){
                        return student.id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadStudentList();
            });
        }
    }

    StudentEditController.$inject = ["$uibModalInstance","id","$http","model","StudentLevelService","StudentService"];
    function StudentEditController($uibModalInstance,id,$http,model,StudentLevelService,StudentService){
        var mv = this;
        mv.levelList = [];
        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = submit;
        
        function submit(){
            var params = {
                id:id,
                levelId:mv.levelId,
                mome:mv.mome
            }
            $http.post("/adminStudent/updataStudent",params).success(function(data){
                if(data.success){
                    model.message("学生信息更新成功");
                    $uibModalInstance.close();
                }else{
                    model.message(data.message);
                }
            })
        }

        StudentService.findOneStudent(id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.levelId = student.levelId;
            mv.mome = student.mome;
        },function(e){
            model.message("加载学生信息失败:"+e);
            $uibModalInstance.dismiss();
        });

        StudentLevelService.loadAllLevelList().then(function(list){
            angular.forEach(list,function(level){
                mv.levelList.push({id:level.id,name:level.levelName,deduct:level.deduct});
            });
        },function(e){
            model.message("加载等级信息失败");
            $uibModalInstance.dismiss();
        })
    }

    StudentCashController.$inject = ["$stateParams","StudentService","$http","model","$uibModal","$scope"];
    function StudentCashController($stateParams,StudentService,$http,model,$uibModal,$scope){
        var mv = this;
        mv.cashList = [];
        mv.page={
            currentPage:1,
            max:20,
            total:0
        };
        mv.addMoney = addMoney;
        mv.reduceMoney = reduceMoney;
        mv.loadcashFlowList = loadcashFlowList;

        StudentService.findOneStudent($stateParams.id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.remindMoney = student.remindMoney;
        },function(e){
            model.message("加载学生信息失败:"+e);
        });

        loadcashFlowList();

        function loadcashFlowList(){
            var params = {
                offset:(mv.page.currentPage-1) * mv.page.max,
                max:mv.page.max
            };
            $http.post("/adminStudent/cashFlowList",params).success(function(data){
                mv.cashList = data.list;
                mv.page.total = data.total;
            });
        }

        function addMoney(){
            StudentService.findToken().then(function (token) {
                openCashWinDow(token,1);
            },function (e) {
                model.message("请求资金变更失败")
            })
        }

        function reduceMoney(){
            StudentService.findToken().then(function (token) {
                openCashWinDow(token,2);
            },function (e) {
                model.message("请求资金变更失败")
            })
        }
        
        function openCashWinDow(token,type){//1为加钱,2为扣钱

            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'cashChange.html',
                controller: 'StudentCashChangeController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    id:function(){
                        return $stateParams.id;
                    },
                    token:function(){
                        return token;
                    },
                    type:function(){
                        return type;
                    }
                }
            });
            modalInstance.result.then(function(){
                $scope.$emit("cashChange");
            });
        }
    }

    StudentCashChangeController.$inject = ["id","token","type","$uibModalInstance","model","StudentService","$http","$q"];
    function StudentCashChangeController(id,token,type,$uibModalInstance,model,StudentService,$http,$q){

        var mv = this;
        mv.lock = false;
        mv.type = type;

        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        StudentService.findOneStudent(id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.remindMoney = student.remindMoney;
        });

        function submit(){
            var params = {
                id:id,
                money:mv.money,
                mome:mv.mome,
                token:token
            }
            var promise;
            mv.lock = true;
            if(type==1){
                promise = addMoney(params);
            }else{
                promise = reduceMoney(params);
            }
            promise.then(function(){
                $uibModalInstance.close();
            },function(e){
                model.message(e);
                mv.lock = false;
            });
        }

        function addMoney(params){
            var defer = $q.defer();
            $http.post("/adminStudent/addMoney",params).success(function(data){
                if(data.success){
                    defer.resolve(data);
                    model.message(data.message);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function reduceMoney(params){
            var defer = $q.defer();
            $http.post("/adminStudent/reduceMoney",params).success(function(data){
                if(data.success){
                    defer.resolve(data);
                    model.message(data.message);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }
    }

    StudentPaikeController.$inject = ["$state","$http","StudentLevelService","$stateParams","StudentService","$uibModal","CourseService","model"];
    function StudentPaikeController($state,$http,StudentLevelService,$stateParams,StudentService,$uibModal,CourseService,model){
        var mv = this;
        mv.courseList = [];
        mv.levelConfig = {};
        mv.addCourse = addCourse;
        mv.delPaiKe = delPaiKe;
        mv.paiqi = paiqi;
        mv.history = history;
        mv.studentId = $stateParams.id;

        loadStudentCourseList();

        StudentLevelService.loadAllLevelConfig().then(function(config){
            mv.levelConfig = config;
        });
        StudentService.findOneStudent($stateParams.id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.levelId = student.levelId;
        });

        function loadStudentCourseList(){
            var params = {
                id:$stateParams.id
            };
            $http.post("/adminStudent/loadStudentCourseList",{params:params}).success(function(data){
                mv.courseList = data.list;
            });
        }

        function paiqi(){
            $state.go("student.list.paiqi",{id:$stateParams.id});
        }

        function history(){
            $state.go("student.list.history",{id:$stateParams.id});
        }

        function delPaiKe(index){
            var course = mv.courseList[index];
            var config = {title:"删除学生的选课",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("是否确认删除已选课程:"+course.courseName+",删除后将同时删除该选课下所有未完结的课程排期。",delPaiKe,angular.noop,config);

            function delPaiKe() {
                var params = {
                    studentId:mv.studentId,
                    courseId:course.id
                }
                $http.post("/adminStudent/delCourse",params).success(function(data){
                    if(data.success){
                        model.message("学生选课已经删除成功");
                    }else{
                        model.message(data.message);
                    }
                })

            }
        }

        function addCourse(){
            var modalInstance;
            CourseService.loadAllCourse().then(function (courseList) {
                modalInstance = $uibModal.open({
                    size:'md',
                    animation: true,
                    templateUrl:'addCourse.html',
                    controller: 'StudentAddCourseController',
                    controllerAs:'p',
                    backdrop:'static',
                    resolve:{
                        id:function(){
                            return $stateParams.id;
                        },
                        courseList:function(){
                            var set = new Set();
                            angular.forEach(mv.courseList,function(course){
                                set.add(course.courseId);
                            });
                            var list = [];
                            angular.forEach(courseList,function(course){
                                if(!set.has(course.id)){
                                    list.push(course);
                                }
                            });
                            return list;
                        }
                    }
                });
                modalInstance.result.then(function(){
                    loadStudentCourseList();
                });
            });
        }
    }

    StudentAddCourseController.$inject = ["$uibModalInstance","courseList","id","$http","model"];
    function StudentAddCourseController($uibModalInstance,courseList,id,$http,model){

        var mv = this;
        mv.courseList = courseList;
        mv.courseId = !!courseList.length?courseList[0].id:null;

        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        function submit(){
            var params = {
                studentId:id,
                courseId:mv.courseId
            };
            $http.post("/adminStudent/addCourse",params).success(function(data){
                if(data.success){
                    model.message("课程添加成功");
                    $uibModalInstance.close();
                }else{
                    model.message(data.message);
                }
            })
        }
    }

    StudentPaiqiController.$inject = ["$http","$stateParams","$state","model","StudentLevelService","StudentService","CourseScheduleService"];
    function StudentPaiqiController($http,$stateParams,$state,model,StudentLevelService,StudentService,CourseScheduleService){

        var mv = this;
        mv.paiqiList = [];
        mv.page={
            currentPage:1,
            max:20,
            total:0
        };

        mv.deletePaiqi = deletePaiqi;
        mv.loadPaiqiList = loadPaiqiList;

        StudentLevelService.loadAllLevelConfig().then(function(config){
            mv.levelConfig = config;
        });
        StudentService.findOneStudent($stateParams.id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.levelId = student.levelId;
        });

        loadPaiqiList();

        function loadPaiqiList(){
            var params = {
                offset:(mv.page.currentPage-1) * mv.page.max,
                max:mv.page.max,
                studentId:$stateParams.id
            };
            $http.post("/adminStudent/loadPaiqiList",params).success(function(data){
                if(data.success){
                    mv.paiqiList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message("学生课程排期列表加载失败");
                }
            });
        }

        function deletePaiqi(index){
            var paiqi = mv.paiqiList[index];
            var config = {title:"删除学生课程排期提示",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("你确定删除课程:"+paiqi.courseName+"的排期吗？",doDelPaiqi,angular.noop,config);

            function doDelPaiqi() {
                CourseScheduleService.doDelCourseSchedule(paiqi.id).then(function(){
                    model.message("课程排期删除成功");
                    loadPaiqiList();
                },function(e){
                    model.message(e);
                });
            }
        }
    }

    StudentOnePaiqiController.$inject = ["$http","$stateParams","$state","model","StudentLevelService","StudentService","CourseService","CourseScheduleService"];
    function StudentOnePaiqiController($http,$stateParams,$state,model,StudentLevelService,StudentService,CourseService,CourseScheduleService){
        var mv = this;
        mv.paiqiList = [];
        mv.page={
            currentPage:1,
            max:20,
            total:0
        };

        mv.deletePaiqi = deletePaiqi;
        mv.loadPaiqiList = loadPaiqiList;
        mv.importPaiqi = importPaiqi;

        StudentLevelService.loadAllLevelConfig().then(function(config){
            mv.levelConfig = config;
        });
        StudentService.findOneStudent($stateParams.id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.levelId = student.levelId;
        });
        CourseService.loadOneCourse($stateParams.courseId).then(function(data){
            mv.courseName = data.courseName;
        });

        loadPaiqiList();

        function loadPaiqiList(){
            var params = {
                offset:(mv.page.currentPage-1) * mv.page.max,
                max:mv.page.max,
                studentId:$stateParams.id,
                courseId:$stateParams.courseId
            };
            $http.post("/adminStudent/loadPaiqiList",params).success(function(data){
                if(data.success){
                    mv.paiqiList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message("学生课程排期列表加载失败");
                }

            });
        }

        function deletePaiqi(index){
            var paiqi = mv.paiqiList[index];
            var config = {title:"删除学生课程排期提示",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("你确定删除课程:"+paiqi.courseName+"的排期吗？",doDelPaiqi,angular.noop,config);

            function doDelPaiqi() {
                CourseScheduleService.doDelCourseSchedule(paiqi.id).then(function(){
                    model.message("课程排期删除成功");
                    loadPaiqiList();
                },function(e){
                    model.message(e);
                });
            }
        }

        function importPaiqi(){
            CourseService.findCourseCount($stateParams.id,$stateParams.courseId).then(function(count){
                var config = {title:"导入排期",submitButton:"确认导入",cancelButton:"取消导入"};
                model.confirm("当前课程还能导入:"+count+"节,请确认是否导入?",doImportPaiqi,angular.noop,config);
            })
            
            function doImportPaiqi(){
                CourseService.importPaiqi($stateParams.id,$stateParams.courseId).then(function(count){
                    model.message("成功导入"+count+"节课程");
                    loadPaiqiList();
                },function(e){
                    model.message(e);
                })
            }
            
        }
    }

    StudentHistoryController.$inject = ["$http","model","$stateParams","StudentLevelService","StudentService"];
    function StudentHistoryController($http,model,$stateParams,StudentLevelService,StudentService){
        var mv = this;
        mv.historyList = [];
        mv.page={
            currentPage:1,
            max:20,
            total:0
        };
        mv.buke = buke;

        StudentLevelService.loadAllLevelConfig().then(function(config){
            mv.levelConfig = config;
        });
        StudentService.findOneStudent($stateParams.id).then(function(student){
            mv.studentNum = student.studentNum;
            mv.studentName = student.studentName;
            mv.levelId = student.levelId;
        });

        loadHistoryList();

        function loadHistoryList(){
            var params = {
                offset:(mv.page.currentPage-1) * mv.page.max,
                max:mv.page.max,
                studentId:$stateParams.id
            };
            $http.post("/adminStudent/loadHistoryList",params).success(function(data){
                if(data.success){
                    mv.historyList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message("学生课程排期列表加载失败");
                }

            });
        }

        function buke(){
            console.log("安排补课");
        }
    }

    StudentService.$inject = ["$http","$q"];
    function StudentService($http,$q){

        function findOneStudent(id){
            var defer = $q.defer();
            $http.get("/adminStudent/findOneStudent",{params:{id:id}}).success(function (data) {
                if(data.success){
                    defer.resolve(data.student);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function findOneStudentByNum(studentNum){
            var defer = $q.defer();
            $http.get("/adminStudent/findOneStudentByNum",{params:{studentNum:studentNum}}).success(function (data) {
                if(data.success){
                    defer.resolve(data.student);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function findToken(){
            var defer = $q.defer();
            $http.post("/adminStudent/findToken").success(function (data) {
                if(data.success){
                    defer.resolve(data.token);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function findSelectCourseStudent(courseId){
            var defer = $q.defer();
            $http.get("/adminStudent/findSelectCourseStudent",{params:{courseId:courseId}}).success(function(data){
                if(data.success){
                    defer.resolve(data.list);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        return {
            findOneStudentByNum:findOneStudentByNum,
            findOneStudent:findOneStudent,
            findToken:findToken,
            findSelectCourseStudent:findSelectCourseStudent
        }
    }
    return student;
});