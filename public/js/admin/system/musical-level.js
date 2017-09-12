/**
 * Created by liuyao on 2017/3/4.
 */
define(["angular"],function (angular) {
    var musical = angular.module("musical",['ui.bootstrap','ngAnimate','ui.router']);
    musical.controller("MusicalController",MusicalController);
    musical.controller("AddMusicalController",AddMusicalController);
    musical.controller("MusicalLevelController",MusicalLevelController);

    musical.controller("AddLevelController",AddLevelController);
    musical.service("StudentLevelService",StudentLevelService);
    musical.service("MusicalService",MusicalService);

    MusicalController.$inject = ["$uibModal","$http","model","MusicalService"];
    function MusicalController($uibModal,$http,model,MusicalService){
        var mv = this;
        mv.musicalList = [];
        mv.addMusical = addMusical;
        mv.setEnable = setEnable;
        mv.setMusicalLevel = setMusicalLevel;


        loadMusicalList();

        function loadMusicalList(){
            MusicalService.loadMusicalList().then(function(list){
                mv.musicalList = list;
            });
        }

        function addMusical(){
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'addMusical.html',
                controller: 'AddMusicalController',
                controllerAs:'p',
                backdrop:'static'
            });
            modalInstance.result.then(function(){
                loadMusicalList();
            });
        }

        function setEnable(index){
            var musical = mv.musicalList[index];
            $http.post("/adminStudentLevel/setMusicalEnable",{id:musical.id}).success(function(data){
                if(data.success){
                    loadMusicalList();
                    model.message("乐器["+musical.name+"]有效状态发生变更");
                }else{
                    model.message(data.message);
                }
            });
        }

        function setMusicalLevel(index){
            var musical = mv.musicalList[index];
            var modalInstance = $uibModal.open({
                size:'lg',
                animation: true,
                templateUrl:'/html/admin/level/level.html',
                controller: 'MusicalLevelController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    musical:function(){
                        return musical;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadMusicalList();
            });
        }

    }

    AddMusicalController.$inject = ["$uibModalInstance","$http","model"];
    function AddMusicalController($uibModalInstance,$http,model) {
        var mv = this;
        mv.name = "";
        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.close();};

        function submit(){
            if(!mv.name){
                return;
            }
            $http.post("/adminStudentLevel/addMusical",{name:mv.name}).success(function(data){
                if(data.success){
                    model.message("乐器:"+mv.name+"添加成功");
                    $uibModalInstance.close();
                }else{
                    model.message(data.message);
                }
            })
        }
    }

    MusicalLevelController.$inject = ["$uibModalInstance","$uibModal","model","StudentLevelService","musical"];
    function MusicalLevelController($uibModalInstance,$uibModal,model,StudentLevelService,musical){
        var mv = this;
        mv.levelList = [];
        mv.musical = musical;
        mv.addLevel = addLevel;
        mv.editLevel = editLevel;
        mv.delLevel = delLevel;
        mv.setDefault = setDefault;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        loadAllLevelList();

        function loadAllLevelList(){
            StudentLevelService.loadAllLevelList(musical.id).then(function(list){
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
                    musicalId:function(){
                        return musical.id;
                    },
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
                    },
                    musicalId:function () {
                        return null;
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

    AddLevelController.$inject = ["$uibModalInstance","StudentLevelService","id","$http","model","musicalId"];
    function AddLevelController($uibModalInstance,StudentLevelService,id,$http,model,musicalId){
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
                params.musicalId = musicalId;
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

    MusicalService.$inject = ["$http","$q"];
    function MusicalService($http,$q) {

        function loadMusicalList(){
            var def = $q.defer();
            $http.get("/adminStudentLevel/loadMusicalList").success(function(data){
                def.resolve(data.list);
            });
            return def.promise;
        }

        return {
            loadMusicalList:loadMusicalList
        }
    }

    StudentLevelService.$inject = ["$http","$q"];
    function StudentLevelService($http,$q){

        function loadMusicalLevelList(musicalId){
            var def = $q.defer();
            $http.get("/adminStudentLevel/findAllLevel",{params:{musicalId:musicalId}}).success(function (data) {
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
            loadMusicalLevelList:loadMusicalLevelList,
            loadAllLevelConfig:loadAllLevelConfig,
            loadLevel:loadLevel
        }

    }

    return musical;
});