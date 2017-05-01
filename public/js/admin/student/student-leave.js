/**
 * Created by liuyao on 2017/3/21.
 */
define(["angular","angular-sortable"],function (angular) {
    var studentLeave = angular.module("studentLeave",['ui.bootstrap','ngAnimate','ui.router',"ui.sortable"]);
    studentLeave.controller("StudentLeaveListController",StudentLeaveListController);
    studentLeave.controller("StudentLeaveEditController",StudentLeaveEditController);
    studentLeave.controller("RoleListController",RoleListController);
    studentLeave.controller("RoleEditController",RoleEditController);

    RoleListController.$inject = ["model","$http","$filter","$state","$uibModal"];
    function RoleListController(model,$http,$filter,$state,$uibModal){
        var mv = this;
        mv.roleList = [];
        mv.sortableOptions={
            stop:updateRolePayload
        };

        mv.loadLeaveList = loadLeaveList;
        mv.getValue = getValue;
        mv.getCondition = getCondition;
        mv.editRole = editRole;
        mv.delRole = delRole;
        mv.checkSwitch = checkSwitch;

        loadLeaveList();
        loadcheckSwitch();

        function loadLeaveList(){
            $http.get("/adminStudentLeave/loadLeaveList").success(function(data){
                mv.roleList = data.list;
            })
        }

        function loadcheckSwitch(){
            $http.get("/adminStudentLeave/loadcheckSwitch").success(function(data){
                mv.isShow = data.show;
            })
        }

        function checkSwitch(){
            $http.post("/adminStudentLeave/checkRoleSwitch").success(function(data){
                if(data.success){
                    mv.isShow = data.show;
                }else{
                    model.message(data.message);
                }
            });
        }

        function editRole(index){
            if(index==-1){
                var role = null;
            }else{
                var role = mv.roleList[index];
            }
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'/html/admin/leave/leave-role-auto.html',
                controller: 'RoleEditController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    role:function(){
                        return role;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadLeaveList();
            });
        }

        function updateRolePayload(){
            var ids = [];
            angular.forEach(mv.roleList,function(role){
                ids.push(role.id);
            });
            var p = model.loading("处理规则顺序重新排列,请稍后...");
            $http.post("/adminStudentLeave/sortLeaveRole",{roleIds:ids.join(",")}).success(function(data){
                p.close();
                $state.reload();
                if(data.success){
                    model.message("处理规则顺序重新排列重新排列成功");
                }else{
                    model.message(data.message);
                }
            });
        }

        function delRole(index){
            var role = mv.roleList[index];
            var config = {title:"删除处理规则",submitButton:"确认",cancelButton:"取消"};
            model.confirm("是否确认删除处理规则:"+role.title,doDelRole,angular.noop,config);

            function doDelRole(){
                var params = {
                    id:role.id
                }
                $http.post("/adminStudentLeave/delLeaveRole",params).success(function (date) {
                    if(date.success){
                        model.message("处理规则删除成功");
                        loadLeaveList();
                    }else{
                        model.message(data.message)
                    }
                })
            }
        }

        function getValue(index){
            var role = mv.roleList[index];
            if(role.type==0){
                return $filter("cashFilter")(role.reduceValue);
            }
            if(role.type==1){
                return role.reduceValue+"%";
            }
        }

        function getCondition(type,value){
            if(type==0){
                return "无条件";
            }
            if(type==1){
                return "距离上课时间>="+value+"小时";
            }
        }
    }

    RoleEditController.$inject = ["role","$uibModalInstance","$http","model"];
    function RoleEditController(role,$uibModalInstance,$http,model){
        var mv = this;
        if(!!role){
            mv.id = role.id;
            mv.title = role.title;
            mv.type = role.type;
            mv.reduceValue = role.reduceValue;
            mv.conditionType = role.conditionType;
            mv.conditionValue = role.conditionValue;
        }else{
            mv.type = 0;
            mv.conditionType = 0;
        }
        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = function(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var params = {};
            params.id = !!role?role.id:null;
            params.title = mv.title;
            params.type = mv.type;
            params.reduceValue = mv.reduceValue;
            params.conditionType = mv.conditionType;
            params.conditionValue = mv.conditionValue;
            $http.post("/adminStudentLeave/saveLeaveRole",params).success(function(data){
                if(data.success){
                    $uibModalInstance.close();
                    model.message("告假处理规则保存成功");
                }else{
                    model.message(data.message);
                }
            })
        }
    }

    StudentLeaveListController.$inject = ["$uibModal","model","pageService","$http"];
    function StudentLeaveListController($uibModal,model,pageService,$http){
        pageService.init("StudentLeaveListController");
        var mv = this;
        mv.leaveList = [];
        mv.page={
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };
        mv.sNum = "";
        mv.sName = "";
        var sNum = "";
        var sName = "";

        mv.loadLeaveList = loadLeaveList;
        mv.query = query;
        mv.editLeaveConfig = editLeaveConfig;
        mv.delLevelConfig = delLevelConfig;

        loadLeaveList();

        function query(){
            mv.page.currentPage = 1;
            sNum = mv.sNum;//持久化检索条件
            sName = mv.sName;
            loadLeaveList();
        }

        function loadLeaveList(){
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
            $http.post("/adminStudentLeave/loadLeavePage",params).success(function(data){
                if(data.success){
                    mv.leaveList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message(data.message);
                }
            });
            pageService.setIndex(mv.page.currentPage);
        }

        function editLeaveConfig(index){
            var config = mv.leaveList[index].leaveConfig;
            var id = mv.leaveList[index].id;
            var modalInstance = $uibModal.open({
                size:'md',
                animation: true,
                templateUrl:'/html/admin/leave/leave-edit.html',
                controller: 'StudentLeaveEditController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    id:function(){
                        return id;
                    },
                    leaveConfig:function(){
                        return config;
                    }
                }
            });
            modalInstance.result.then(function(){
                loadLeaveList();
            });
        }

        function delLevelConfig(index){
            var id = mv.leaveList[index].id;
            var config = {title:"取消告假的手动处理",submitButton:"确认",cancelButton:"取消"};
            model.confirm("是否确认取消学生的手动告假处理",doDelLevelConfig,angular.noop,config);

            function doDelLevelConfig(){
                $http.post("/adminStudentLeave/delLevelConfig",{id:id}).success(function(data){
                    if(data.success){
                        model.message("学生告假的手动处理已经取消");
                        loadLeaveList();
                    }else{
                        model.message(data.message);
                    }
                })
            }
        }
    }

    StudentLeaveEditController.$inject = ["id","leaveConfig","$uibModalInstance","$http","model"];
    function StudentLeaveEditController(id,leaveConfig,$uibModalInstance,$http,model){
        var mv = this;
        if(!!leaveConfig){
            mv.type = leaveConfig.type;
            if(mv.type==0){
                mv.leaveValue = parseFloat((leaveConfig.leaveValue/100).toFixed(2));
            }else{
                mv.leaveValue = leaveConfig.leaveValue;
            }
        }else{
            mv.type = 0;
        }

        mv.cancel = function(){$uibModalInstance.dismiss();};
        mv.submit = function () {
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            var params = {
                id:id,
                type:mv.type,
                leaveValue:mv.leaveValue
            };
            $http.post("/adminStudentLeave/editLevelConfig",params).success(function(data){
                if(data.success){
                    $uibModalInstance.close();
                    model.message("手动处理告假配置成功");
                }else{
                    model.message(data.message);
                }
            });
        }
    }

    return studentLeave;
});