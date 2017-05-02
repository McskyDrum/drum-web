/**
 * Created by liuyao on 2017/3/20.
 */
define(["course"],function(course){
    course.config(Config);
    course.service("CourseService",CourseService);
    course.service("CourseScheduleService",CourseScheduleService);

    CourseScheduleService.$inject = ["$http","$q","model"];
    function CourseScheduleService($http,$q,model){
        /**
         * 加载课程排期下的所有学生排课
         * @param scheduleId 课程排期Id
         */
        function loadCourseSchedule(scheduleId){
            var promise = $q.defer();
            $http.get("/adminCourseSchedule/loadCourseSchedule",{params:{scheduleId:scheduleId}}).success(function(data){
                if(data.success){
                    promise.resolve(data.list);
                }else{
                    promise.reject(data.message);
                }
            });
            return promise.promise;
        };

        /**
         * 加载单个课程排期的配置
         * @param scheduleId
         * @returns {*}
         */
        function loadOneSchedule(scheduleId){
            var promise = $q.defer();
            $http.get("/adminCourseSchedule/loadOneSchedule",{params:{scheduleId:scheduleId}}).success(function(data){
                if(data.success){
                    promise.resolve(data.schedule);
                }else{
                    promise.reject(data.message);
                }
            });
            return promise.promise;
        }
        
        function updataCourseSchedule(schedule){
            var promise = $q.defer();
            $http.post("/adminCourseSchedule/updataCourseSchedule",schedule).success(function(data){
                if(data.success){
                    promise.resolve();
                }else{
                    promise.reject(data.message);
                }
            });
            return promise.promise;
        }

        /**
         * 单个或者批量创建课程排期
         * @param createCourseParams
         * @returns {e.promise|promise|*|d}
         */
        function createCourseSchedule(createCourseParams) {
            var promise = $q.defer();
            $http.post("/adminCourseSchedule/createCourseSchedule",createCourseParams).success(function(data){
                if(data.success){
                    promise.resolve();
                }else{
                    promise.reject(data.message);
                }
            });
            return promise.promise;
        }

        /**
         * 删除学生排期
         * @param id 排期计划的Id
         * @returns {promise|e.promise|*|d}
         */
        function doDelCourseSchedule(id){
            var defer = $q.defer();
            $http.post("/adminCourseSchedule/doDelCourseSchedule",{id:id}).success(function(data){
                if(data.success){
                    defer.resolve(data);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        /**
         * 删除课程一节排期
         * @param courseScheduleId 课程排期Id
         */
        function doDelCoursePaiqi(courseScheduleId){
            var defer = $q.defer();
            $http.post("/adminCourseSchedule/doDelCoursePaiqi",{id:courseScheduleId}).success(function(data){
                if(data.success){
                    defer.resolve();
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        /**
         * 检索当前课程排期还能导入的学生列表(学生选了这门课,但是在这个课程排期下没自己的上课排期)
         * @param scheduleId
         * @returns {promise|e.promise|d|*}
         */
        function findCanImportPaiqiStudent(scheduleId){
            var defer = $q.defer();
            $http.get("/adminCourseSchedule/findCanImportPaiqiStudent",{params:{scheduleId:scheduleId}}).success(function(data){
                if(data.success){
                    if(!!data.list.length){
                        model.message("当前课程排期还可导入"+data.list.length+"名学生,请在确认后执行导入");
                    }else{
                        model.message("未检索出可以导入的学生");
                    }
                    defer.resolve(data.list);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        /**
         * 批量为课程排期导入
         * @param scheduleId 课程排期的Id
         * @param studentIds 导入的学生Ids
         */
        function batchImportStudentSchedule(scheduleId,studentIds){
            var params = {
                scheduleId:scheduleId,
                studentIds:studentIds.join(",")
            }
            var defer = $q.defer();
            $http.post("/adminCourseSchedule/batchImportStudentSchedule",params).success(function(data){
                if(data.success){
                    defer.resolve(data.count)
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        return {
            loadOneSchedule:loadOneSchedule,
            loadCourseSchedule:loadCourseSchedule,
            doDelCourseSchedule:doDelCourseSchedule,
            doDelCoursePaiqi:doDelCoursePaiqi,
            updataCourseSchedule:updataCourseSchedule,
            findCanImportPaiqiStudent:findCanImportPaiqiStudent,
            batchImportStudentSchedule:batchImportStudentSchedule,
            createCourseSchedule:createCourseSchedule
        }
    }


    CourseService.$inject = ["$http","$q"];
    function CourseService($http,$q){

        function saveCourse(course){
            if(!!course.id){
                return $http.post("/adminCourse/updataCourse",course);
            }else{
                return $http.post("/adminCourse/insertCourse",course);
            }
        }

        function loadOneCourse(cid){
            var defer = $q.defer();
            $http.get("/adminCourse/loadOneCourse",{params:{id:cid}}).success(function(data){
                if(data.success){
                    defer.resolve(data);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function loadAllCourse(){
            var defer = $q.defer();
            $http.get("/adminCourse/loadAllCourse").success(function(data){
                if(data.success){
                    defer.resolve(data.list);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function findCourseCount(studentId,courseId) {
            var defer = $q.defer();
            var params = {
                studentId:studentId,
                courseId:courseId
            }
            $http.get("/adminCourse/findCourseCount",{params:params}).success(function(data){
                if(data.success){
                    defer.resolve(data.count);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        function importPaiqi(studentId,courseId){
            var defer = $q.defer();
            var params = {
                studentId:studentId,
                courseId:courseId
            }
            $http.post("/adminCourse/importPaiqi",params).success(function(data){
                if(data.success){
                    defer.resolve(data.count);
                }else{
                    defer.reject(data.message);
                }
            });
            return defer.promise;
        }

        return {
            saveCourse:saveCourse,
            loadAllCourse:loadAllCourse,
            loadOneCourse:loadOneCourse,
            findCourseCount:findCourseCount,
            importPaiqi:importPaiqi
        }
    }


    Config.$inject = ['$stateProvider',"$httpProvider"];
    function Config($stateProvider,$httpProvider){
        $stateProvider.state("course",{template:'<div ui-view></div>'})
            .state('course.list',{url:"/course/list",templateUrl:'/html/admin/course/course_list.html',controller:'CourseListController',controllerAs:'mv'})
            .state('course.list.coursePaiQi',{url:"/paiqi/:id",templateUrl:'/html/admin/course/course_paiqi.html',controller:'CoursePaiqiController',controllerAs:'mv'})
            .state('course.list.coursePaiQiEdit',{url:"/coursePaiQiEdit/:scheduleId",templateUrl:'/html/admin/course/course_edit_paiqi.html',controller:'CoursePaiqiEditController',controllerAs:'mv'})
    }

    return course;
});