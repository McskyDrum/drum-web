/**
 * Created by liuyao on 2017/3/18.
 */
/**
 * Created by liuyao on 2017/3/4.
 */
define(["angular"],function (angular) {
    var studentLevel = angular.module("studentLevel",['ui.bootstrap','ngAnimate','ui.router']);
    studentLevel.controller("StudentLevelController",StudentLevelController);
    studentLevel.controller("AddLevelController",AddLevelController);
    studentLevel.service("StudentLevelService",StudentLevelService);

    StudentLevelController.$inject = ["StudentLevelService","$uibModal","model","$http"];
    function StudentLevelController(StudentLevelService,$uibModal,model,$http){
        var mv = this;
        mv.levelList = [];
        mv.addLevel = addLevel;
        mv.editLevel = editLevel;
        mv.delLevel = delLevel;
        mv.setDefault = setDefault;

        loadAllLevelList();

        function loadAllLevelList(){
            StudentLevelService.loadAllLevelList().then(function(list){
                mv.levelList = list;
            });
        }

        function addLevel(){
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'/html/admin/level/addLevel.html',
                controller: 'AddLevelController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    id:function(){
                        return null;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadAllLevelList();
            });
        }

        function editLevel(index){
            var level = mv.levelList[index];
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'/html/admin/level/addLevel.html',
                controller: 'AddLevelController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    id:function(){
                        return level.id;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadAllLevelList();
            });
        }

        function delLevel(index) {
            var level = mv.levelList[index];

            var config = {title:"删除等级提示",submitButton:"确认删除",cancelButton:"取消删除"};
            model.confirm("确定删除等级("+level.levelName+")？删除后,如果有学生是当前等级,将转为默认等级",doDelLevel,angular.noop,config);

            function doDelLevel(){
                var params = {
                    id:level.id
                }
                $http.post("/adminStudentLevel/delLevel",params).success(function(data){
                    if(data.success){
                        model.message("等级已经删除");
                        loadAllLevelList();
                    }else{
                        model.message(data.message);
                    }
                })
            }
        }

        function setDefault(index){
            var level = mv.levelList[index];
            var config = {title:"默认等级变更",submitButton:"确认",cancelButton:"取消"};
            model.confirm("你确定将等级("+level.levelName+")设为默认等级吗？",doSetDefault,angular.noop,config);

            function doSetDefault(){
                var params = {
                    id:level.id
                }
                $http.post("/adminStudentLevel/doSetDefault",params).success(function(data){
                    if(data.success){
                        model.message("默认等级变更成功");
                        loadAllLevelList();
                    }else{
                        model.message(data.message);
                    }
                })
            }
        }
    }

    AddLevelController.$inject = ["$uibModalInstance","StudentLevelService","id","$http","model","$filter"];
    function AddLevelController($uibModalInstance,StudentLevelService,id,$http,model,$filter){
        var mv = this;
        mv.id = id;
        mv.levelName = "";
        mv.deduct = "";

        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        if(!!id){
            StudentLevelService.loadLevel(id).then(function (level) {
                mv.levelName = level.levelName;
                mv.deduct = level.deduct/100;
            });
        }

        function submit(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var params = {
                levelName:mv.levelName,
                deduct:mv.deduct*100
            };
            if(!!id){
                params.id = id;
                $http.post("/adminStudentLevel/updateLevel",params).success(function(data){
                    if(data.success){
                        model.message("等级更新成功");
                        $uibModalInstance.close();
                    }else{
                        model.message(data.message);
                    }
                })
            }else{
                $http.post("/adminStudentLevel/addLevel",params).success(function(data){
                    if(data.success){
                        model.message("等级添加成功");
                        $uibModalInstance.close();
                    }else{
                        model.message(data.message);
                    }
                })
            }
        }
    }

    StudentLevelService.$inject = ["$http","$q"];
    function StudentLevelService($http,$q){

        function loadAllLevelList(){
            var def = $q.defer();
            $http.get("/adminStudentLevel/findAllLevel").success(function (data) {
                if(data.success){
                    def.resolve(data.list);
                }else{
                    def.resolve(data.message);
                }
            });
            return def.promise;
        }

        function loadLevel(id){
            var def = $q.defer();
            $http.get("/adminStudentLevel/loadLevel",{params:{id:id}}).success(function (data) {
                if(data.success){
                    def.resolve(data.level);
                }else{
                    def.resolve(data.message);
                }
            });
            return def.promise;
        }

        function loadAllLevelConfig() {
            var def = $q.defer();
            loadAllLevelList().then(function(list){
                var config = {};
                angular.forEach(list,function(level){
                    config[level.id] = level.levelName;
                });
                def.resolve(config);
            },function(e){
                def.reject(e);
            });
            return def.promise;
        }

        return {
            loadAllLevelList:loadAllLevelList,
            loadAllLevelConfig:loadAllLevelConfig,
            loadLevel:loadLevel
        }

    }

    return studentLevel;
});