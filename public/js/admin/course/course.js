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
                $http.post("/adminCourse/delCourse").success(function(data){
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

    CourseEditController.$inject = ["$uibModalInstance","courseId","CourseService","TeacherService","model"];
    function CourseEditController($uibModalInstance,courseId,CourseService,TeacherService,model){
        var mv = this;
        mv.id = courseId;
        mv.courseName = "";
        mv.teacherId = null;
        mv.address = "";
        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = submit;

        if(!!courseId){
            CourseService.loadOneCourse(courseId).then(function(course){
                mv.courseName = course.courseName;
                mv.address = course.address;
                mv.teacherId= course.teacherId;
            });
        }
        TeacherService.loadAllEnabelTeacher().then(function(list){
            mv.teacherList = list;
        });

        function submit(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var params = {
                title:mv.courseName,
                teacherId:mv.teacherId,
                address:mv.address
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

    CoursePaiqiController.$inject = ["$stateParams","CourseService","$http","model","pageService"];
    function CoursePaiqiController($stateParams,CourseService,$http,model,pageService){
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
                dataTime:mv.dataTime,
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
    

    return course;
});