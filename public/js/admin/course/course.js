/**
 * Created by liuyao on 2017/3/20.
 */
define(["angular"],function (angular) {
    var course = angular.module("course",["model"]);
    
    course.controller("CourseListController",CourseListController);
    course.controller("CourseEditController",CourseEditController);
    course.controller("CoursePaiqiController",CoursePaiqiController);
    course.controller("CoursePaiqiEditController",CoursePaiqiEditController);
    course.controller("CourseImportStudentController",CourseImportStudentController);
    course.controller("CourseAddStudentController",CourseAddStudentController);
    course.controller("CourseAddPaiqiController",CourseAddPaiqiController);
    course.controller("CourseBatchAddPaiqiController",CourseBatchAddPaiqiController);
    course.controller("CourseWaitConductController",CourseWaitConductController);

    CourseListController.$inject = ["CourseService","$uibModal","model","$http"];
    function CourseListController(CourseService,$uibModal,model,$http){
        var mv = this;
        mv.courseList = [];
        mv.addCourse = addCourse;
        mv.editCourse = editCourse;
        mv.delCourse = delCourse;

        loadAllCourse();
        function loadAllCourse(){
            CourseService.loadAllCourse().then(function(list){
                mv.courseList = list;
            });
        }

        function addCourse(){
            var modalInstance = $uibModal.open({
                size:'md',
                animation:true,
                templateUrl:'editCourse.html',
                controller: 'CourseEditController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    courseId:function(){
                        return null;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadAllCourse();
            });
        }

        function editCourse(index){
            var course = mv.courseList[index];
            var modalInstance = $uibModal.open({
                size:'md',
                animation:true,
                templateUrl:'editCourse.html',
                controller: 'CourseEditController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    courseId:function(){
                        return course.id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadAllCourse();
            });
        }

        function delCourse(index){
            var course = mv.courseList[index];
            var config = {title:"删除课程",submitButton:"确认",cancelButton:"取消"};
            model.confirm("是否确认删除课程:"+course.courseName,doDelCourse,angular.noop,config);

            function doDelCourse(){
                $http.post("/adminCourse/delCourse",{"id":course.id}).success(function(data){
                    if(data.success){
                        model.message("课程删除成功");
                        loadAllCourse();
                    }else{
                        model.message(data.message);
                    }
                })
            }
        }
    }

    CourseEditController.$inject = ["$uibModalInstance","courseId","CourseService","TeacherService","model","MusicalService"];
    function CourseEditController($uibModalInstance,courseId,CourseService,TeacherService,model,MusicalService){
        var mv = this;
        mv.id = courseId;
        mv.courseName = "";
        mv.teacherId = null;
        mv.musicalId = null;
        mv.address = "";
        mv.musicalList = [];
        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = submit;

        if(!!courseId){
            CourseService.loadOneCourse(courseId).then(function(course){
                mv.courseName = course.courseName;
                mv.address = course.address;
                mv.teacherId = course.teacherId;
                mv.musicalId = course.musicalId;
            });
        }
        TeacherService.loadAllEnabelTeacher().then(function(list){
            mv.teacherList = list;
        });

        MusicalService.loadMusicalList().then(function(list){
            mv.musicalList = list;
        });

        function submit(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var params = {
                title:mv.courseName,
                teacherId:mv.teacherId,
                address:mv.address,
                musicalId:mv.musicalId
            };
            !!mv.id && (params.id = mv.id);
            CourseService.saveCourse(params).success(function(data){
                if(data.success){
                    model.message("课程保存成功");
                    $uibModalInstance.close();
                }else{
                    model.message(data.message);
                }
            });
        }
    }

    CoursePaiqiController.$inject = ["$stateParams","CourseService","$http","model","pageService","CourseScheduleService","$uibModal"];
    function CoursePaiqiController($stateParams,CourseService,$http,model,pageService,CourseScheduleService,$uibModal){
        pageService.init("CoursePaiqiController");
        var mv = this;
        mv.id = $stateParams.id;
        mv.paiqiList = [];
        mv.page={
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };
        mv.loadCoursePaiqi = loadCoursePaiqi;
        mv.getPaiqiState = getPaiqiState;
        mv.delPaiqi = delPaiqi;
        mv.addCoursePaiqi = addCoursePaiqi;
        mv.batchAddCoursePaiqi = batchAddCoursePaiqi;

        CourseService.loadOneCourse(mv.id).then(function(course){
            mv.courseName = course.courseName;
        });

        loadCoursePaiqi();

        function loadCoursePaiqi(){
            pageService.setIndex(mv.page.currentPage);
            var params = {
                offset:(pageService.getIndex()-1) * mv.page.max,
                max:mv.page.max,
                courseId:$stateParams.id
            };
            mv.page.currentPage = pageService.getIndex();
            if(!pageService.isCanLoad()){
                return;
            }
            $http.post("/adminCourse/loadPaiqiListPage",params).success(function(data){
                if(data.success){
                    mv.paiqiList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message("课程排期列表加载失败");
                }
            });
            pageService.setIndex(mv.page.currentPage);
        }

        function getPaiqiState(paiqi){
            var now = new Date().getTime();
            if(now<paiqi.startTime){
                return "正常排期";
            }
            if(now>paiqi.startTime && now<paiqi.endTime){
                return "正在上课";
            }
            return "已结束";
        }

        function delPaiqi(index){
            var paiqi = mv.paiqiList[index];
            var config = {title:"删除课程排期",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("是否确认删除课程:"+paiqi.courseName+"对应的一节课排期,删除后将同时删除所有学生对于该一节课程排期的学习任务。",doDelPaiqi,angular.noop,config);
            
            function doDelPaiqi(){
                CourseScheduleService.doDelCoursePaiqi(paiqi.id).then(function(){
                    model.message("课程排期删除成功");
                     loadCoursePaiqi();
                },function(message){
                    model.message(message);
                })
            }
        }

        function addCoursePaiqi(){
            var modalInstance = $uibModal.open({
                size:'lg',
                animation:true,
                templateUrl:'/html/admin/course/course_add_schedule.html',
                controller: 'CourseAddPaiqiController',
                controllerAs:'mv',
                backdrop:'static',
                resolve:{
                    courseId:function(){
                        return $stateParams.id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadCoursePaiqi();
            });
        }

        function batchAddCoursePaiqi(){
            var modalInstance = $uibModal.open({
                size:'lg',
                animation:true,
                templateUrl:'/html/admin/course/course_batch_add_schedule.html',
                controller: 'CourseBatchAddPaiqiController',
                controllerAs:'mv',
                backdrop:'static',
                resolve:{
                    courseId:function(){
                        return $stateParams.id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadCoursePaiqi();
            });
        }
    }

    CourseBatchAddPaiqiController.$inject = ["$uibModalInstance","courseId","CourseService","TeacherService","StudentService","model","CourseScheduleService"];
    function CourseBatchAddPaiqiController($uibModalInstance,courseId,CourseService,TeacherService,StudentService,model,CourseScheduleService) {
        var mv = this;
        mv.studentList = [];
        mv.dayNum = 1;
        mv.dayStap = 1;
        mv.courseNum = 1;
        mv.courseNumList = [1,2,3,4,5,6,7,8];
        mv.importStudent = importStudent;
        
        mv.timeList = [{}];
        mv.selectCourseNum = selectCourseNum;
        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = submit;

        function selectCourseNum(){
            if(mv.courseNum<=mv.timeList.length){
                mv.timeList = mv.timeList.slice(0,mv.courseNum);
            }else{
                var addNum = mv.courseNum-mv.timeList.length;
                for(var i=0;i<addNum;i++){
                    mv.timeList.push({});
                }
            }
        }

        CourseService.loadOneCourse(courseId).then(function(course){
            mv.courseName = course.courseName;
            mv.address = course.address;
            mv.teacherId = course.teacherId;
        });

        TeacherService.loadAllEnabelTeacher().then(function(list){
            mv.teacherList = list;
        });

        function importStudent(){
            StudentService.findSelectCourseStudent(courseId).then(function(list){
                mv.studentList = list;
            })
        }

        function getDataList(){
            for(var i=0;i<mv.timeList.length;i++){
                var time = mv.timeList[i];
                if(time.endTime<=time.startTime){
                    model.message("上课结束时间必须大于开始时间");
                    return;
                }
            }
            var dataTime = mv.dataTime.getTime();
            var stap = 24*3600*1000*mv.dayStap;
            var dataList = [];
            for(var i=0;i<mv.dayNum;i++){
                var data = dataTime+stap*i;
                for(var j=0;j<mv.timeList.length;j++){
                    var time = mv.timeList[j];
                    var timeObj = {};
                    timeObj.dataTime = data;
                    timeObj.startTime = time.startTime.getTime();
                    timeObj.endTime = time.endTime.getTime();
                    dataList.push(timeObj);
                }
            }
            return dataList;
        }

        function submit(){
            if(mv.endTime<=mv.startTime){
                model.message("上课结束时间必须大于开始时间");
                return;
            }
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var createCourseParams = {
                courseId:courseId,
                teacherId:mv.teacherId,
                address:mv.address,
                dataList:getDataList()
            };
            if(!!mv.studentList.length){
                var studentIds = [];
                angular.forEach(mv.studentList,function(student){
                    studentIds.push(student.id);
                });
                createCourseParams.studentIds = studentIds;
            }
            CourseScheduleService.createCourseSchedule(createCourseParams).then(function(){
                model.message("批量创建课程排期成功");
                $uibModalInstance.close();
            },function (message) {
                model.message(message);
            })
        }
    }

    CourseAddPaiqiController.$inject = ["$uibModalInstance","courseId","CourseService","TeacherService","StudentService","model","CourseScheduleService"];
    function CourseAddPaiqiController($uibModalInstance,courseId,CourseService,TeacherService,StudentService,model,CourseScheduleService){
        var mv = this;
        mv.studentList = [];
        mv.importStudent = importStudent;
        mv.submit = submit;

        CourseService.loadOneCourse(courseId).then(function(course){
            mv.courseName = course.courseName;
            mv.teacherId = course.teacherId;
            mv.address = course.address;
        });

        TeacherService.loadAllEnabelTeacher().then(function(list){
            mv.teacherList = list;
        });
        
        function importStudent(){
            StudentService.findSelectCourseStudent(courseId).then(function(list){
                mv.studentList = list;
            })
        }

        function submit(){
            if(mv.endTime<=mv.startTime){
                model.message("上课结束时间必须大于开始时间");
                return;
            }
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var createCourseParams = {
                courseId:courseId,
                teacherId:mv.teacherId,
                address:mv.address,
                dataList:[{dataTime:mv.dataTime.getTime(),startTime:mv.startTime.getTime(),endTime:mv.endTime.getTime()}],
            };
            if(!!mv.studentList.length){
                var studentIds = [];
                angular.forEach(mv.studentList,function(student){
                    studentIds.push(student.id);
                });
                createCourseParams.studentIds = studentIds;
            }
            CourseScheduleService.createCourseSchedule(createCourseParams).then(function(){
                model.message("课程排期创建成功");
                $uibModalInstance.close();
            },function (message) {
                model.message(message);
            })
        }

        mv.cancel = function(){$uibModalInstance.dismiss();};
    }
    
    CoursePaiqiEditController.$inject = ["CourseScheduleService","$stateParams","CourseService","TeacherService","model","$uibModal"];
    function CoursePaiqiEditController(CourseScheduleService,$stateParams,CourseService,TeacherService,model,$uibModal){
        var mv = this;
        mv.teacherId = null;
        mv.teacherList = [];
        mv.inlineOptions = {
            minDate: new Date(),
            showWeeks: true
        };
        var id = $stateParams.scheduleId;
        mv.submit = submit;
        mv.batchImportStudent = batchImportStudent;
        mv.addStudentPaiqi = addStudentPaiqi;
        mv.delStudentPaiQi = delStudentPaiQi;

        CourseScheduleService.loadOneSchedule(id).then(function(schedule){
            mv.dataTime = new Date().setTime(schedule.startTime);
            var start = new Date();start.setTime(schedule.startTime);
            var end = new Date();end.setTime(schedule.endTime);
            mv.startTime = new Date(1970, 0, 1,start.getHours(),start.getMinutes(),0);
            mv.endTime = new Date(1970, 0, 1,end.getHours(),end.getMinutes(),0);
            mv.address = schedule.address;
            mv.teacherId = schedule.teacherId;

            CourseService.loadOneCourse(schedule.courseId).then(function (data) {
                mv.courseName = data.courseName;
            })
        });

        TeacherService.loadAllEnabelTeacher().then(function(list){
            mv.teacherList = list;
        });

        function loadScheduleList() {
            CourseScheduleService.loadCourseSchedule(id).then(function (list) {
                mv.studentPaiQiList = list;
            });
        }

        function submit(){
            if(mv.endTime<=mv.startTime){
                model.message("上课结束时间必须大于开始时间");
                return;
            }
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var schedule = {
                id:id,
                dataTime:mv.dataTime.getTime(),
                startTime:mv.startTime.getTime(),
                endTime:mv.endTime.getTime(),
                teacherId:mv.teacherId,
                address:mv.address
            }
            CourseScheduleService.updataCourseSchedule(schedule).then(function(){
                model.message("课程排期配置保存成功");
            },function(message){
                model.message(message);
            })
        }

        function batchImportStudent(){
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'/html/admin/course/course_impot_student.html',
                controller: 'CourseImportStudentController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    scheduleId:function(){
                        return id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadScheduleList();
            });
        }

        function addStudentPaiqi(){
            var modalInstance = $uibModal.open({
                size:'sm',
                animation: true,
                templateUrl:'/html/admin/course/course_add_student.html',
                controller: 'CourseAddStudentController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    scheduleId:function(){
                        return id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadScheduleList();
            });
        }

        function delStudentPaiQi(index){
            var paiqi = mv.studentPaiQiList[index];
            var config = {title:"删除学生课程排期",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("你确定删除学生:"+paiqi.studentName+" 对应课程:"+mv.courseName+" 的一节课程排期",doDelPaiqi,angular.noop,config);

            function doDelPaiqi() {
                CourseScheduleService.doDelCourseSchedule(paiqi.id).then(function(){
                    model.message("学生课程排期删除成功");
                    loadScheduleList();
                },function(e){
                    model.message(e);
                });
            }
        }

        loadScheduleList();
    }

    CourseAddStudentController.$inject = ["CourseScheduleService","model","scheduleId","$uibModalInstance","StudentService"];
    function CourseAddStudentController(CourseScheduleService,model,scheduleId,$uibModalInstance,StudentService){
        var mv = this;
        mv.studentNum  = "";
        mv.studentName = "";
        mv.studentId = null;
        mv.level = "";
        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = submit;
        mv.searchStudent = searchStudent;
        
        function searchStudent(){
            mv.studentId = null;
            StudentService.findOneStudentByNum(mv.studentNum).then(function(student){
                mv.studentId = student.id;
                mv.studentName = student.studentName;
                mv.level = student.level;
            });
        }

        function submit(){
            if(!mv.studentId){
                return;
            }
            var studentIds = [mv.studentId];
            CourseScheduleService.batchImportStudentSchedule(scheduleId,studentIds).then(function(count){
                if(count!=1){
                    model.message("添加学生失败,请检查该学生有没有此课程的选课");
                }else{
                    model.message("添加学生成功");
                    $uibModalInstance.close();
                }
            },function(message){
                model.message(message);
            })
        }
    }

    CourseImportStudentController.$inject = ["CourseScheduleService","model","scheduleId","$uibModalInstance"];
    function CourseImportStudentController(CourseScheduleService,model,scheduleId,$uibModalInstance){
        var mv = this;
        mv.studentList = [];

        mv.searchImportStudent = searchImportStudent;
        mv.doImport = doImport;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        function searchImportStudent(){
            CourseScheduleService.findCanImportPaiqiStudent(scheduleId).then(function(list){
                mv.studentList = list;
            })
        }
        
        function doImport(){
            if(!mv.studentList.length){
                return;
            }
            var studentIds = [];
            angular.forEach(mv.studentList,function(student){
                studentIds.push(student.id);
            });
            CourseScheduleService.batchImportStudentSchedule(scheduleId,studentIds).then(function(count){
                model.message("成功为该课程导入"+count+"名学生");
                $uibModalInstance.close();
            },function(message){
                model.message(message);
            })
        }

    }

    CourseWaitConductController.$inject = ["CourseScheduleService","pageService","model"];
    function CourseWaitConductController(CourseScheduleService,pageService,model){
        pageService.init("CourseWaitConductController");
        var mv = this;
        mv.paiqiList = [];
        mv.page={
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };

        mv.loadPaiqiList = loadPaiqiList;
        mv.dealwith = dealwith;
        mv.delPaiqi = delPaiqi;

        function loadPaiqiList() {
            pageService.setIndex(mv.page.currentPage);
            var params = {
                offset:(pageService.getIndex()-1) * mv.page.max,
                max:mv.page.max
            };

            mv.page.currentPage = pageService.getIndex();
            if(!pageService.isCanLoad()){
                return;
            }
            CourseScheduleService.loadWaitConductSchedule(params).then(function(data){
                mv.paiqiList = data.list;
                mv.page.total = data.total;
            },function(message){
                model.message(message);
            });
            pageService.setIndex(mv.page.currentPage);
        }

        function dealwith(index) {
            var paiqi = mv.paiqiList[index];
            var config = {title:"课程结算",submitButton:"确认结算",cancelButton:"取消结算"};
            model.confirm("你确定对课程:"+paiqi.courseName+" 的排期进行结算？",doDealwith,angular.noop,config);
            
            function doDealwith(){
                CourseScheduleService.dealWith(paiqi.id).then(function(data){
                    model.message("课程已经结算成功，其中正常上课："+data.successCount+" 告假人数:"+data.leaveCount);
                    loadPaiqiList();
                },function (message) {
                    model.message(message);
                })
            }
        }

        function delPaiqi(index){
            var paiqi = mv.paiqiList[index];
            var config = {title:"删除课程排期",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("是否确认删除课程:"+paiqi.courseName+"对应的一节课排期,删除后将同时删除所有学生对于该一节课程排期的学习任务。",doDelPaiqi,angular.noop,config);

            function doDelPaiqi(){
                CourseScheduleService.doDelCoursePaiqi(paiqi.id).then(function(){
                    model.message("课程排期删除成功");
                    loadPaiqiList();
                },function(message){
                    model.message(message);
                })
            }
        }
        loadPaiqiList();
    }
    

    return course;
});