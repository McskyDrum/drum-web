/**
 * Created by liuyao on 2017/3/4.
 */
define(["angular"],function (angular) {
    var admin = angular.module("admin",['ui.bootstrap','ngAnimate','ui.router',"model"]);

    admin.config(Config);
    admin.run(Run);
    admin.factory("LoginInterceptor",LoginInterceptor);
    admin.controller("ResetPasswordController",ResetPasswordController);
    admin.controller("AdminResetPasswordController",AdminResetPasswordController);
    admin.controller("AdminListController",AdminListController);
    admin.controller("AdminController",AdminController);


    AdminController.$inject = ["$uibModalInstance","$http","model","admin"];
    function AdminController($uibModalInstance,$http,model,admin){
        var mv = this;
        mv.id = !!admin?admin.id:null;
        if(!!mv.id){
            mv.account = admin.account;
            mv.adminName = admin.adminName;
        }
        mv.password = "";
        mv.dpassword = "";

        mv.submit = submit;

        function submit(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            if(!!mv.id){
                var params = {
                    id:mv.id,
                    adminName:mv.adminName
                };
                $http.post("/admin/updataAdminInfo",params).success(function(data){
                    if(data.success){
                        $uibModalInstance.close("管理员信息更新成功");
                    }else{
                        model.message(data.message);
                    }
                })
            }else{
                if(mv.password!=mv.dpassword){
                    return;
                }
                var params = {
                    account:mv.account,
                    adminName:mv.adminName,
                    password:mv.password
                };
                $http.post("/admin/addAdmin",params).success(function(data){
                    if(data.success){
                        $uibModalInstance.close("管理员创建成功");
                    }else{
                        mv.message = data.message;
                    }
                })
            }

        }
        mv.cancel = function(){$uibModalInstance.dismiss();};
    }

    ResetPasswordController.$inject = ["$uibModalInstance","$http","model"];
    function ResetPasswordController($uibModalInstance,$http,model){
        var mv = this;
        mv.oldPassword = "";
        mv.password = "";
        mv.dpassword = "";

        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        function submit(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            if(mv.password!=mv.dpassword){
                return;
            }
            var params = {
                oldPassword:mv.oldPassword,
                password:mv.password
            };
            $http.post("/admin/resetPassword",params).success(function(data){
                if(data.success){
                    $uibModalInstance.close(data);
                }else{
                    model.message(data.message);
                }
            });
        }
    }

    AdminResetPasswordController.$inject = ["$uibModalInstance","$http","admin"];
    function AdminResetPasswordController($uibModalInstance,$http,admin){
        var mv = this;
        mv.adminName =admin.adminName;
        mv.password = "";
        mv.dpassword = "";
        mv.submit = submit;
        mv.cancel = function(){$uibModalInstance.dismiss();};

        function submit(){
            if(mv.form.$invalid){//拦截表单验证不通过的情况
                return;
            }
            if(mv.password!=mv.dpassword){
                return;
            }
            var params = {
                id:admin.id,
                password:mv.password,
            };
            $http.post("/admin/adminResetPassword",params).success(function(data){
                $uibModalInstance.close();
            })
        }
    }

    AdminListController.$inject = ["$http","pageService","model","$uibModal"];
    function AdminListController($http,pageService,model,$uibModal){
        pageService.init("AdminListController");

        var mv = this;
        mv.loadAdminList = loadAdminList;
        mv.addAdmin = addAdmin;
        mv.editAdmin = editAdmin;
        mv.resetPassword = resetPassword;
        mv.checkCashRecharge = checkCashRecharge;

        mv.page = {
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };
        mv.adminList = [];

        loadAdminList();
        function loadAdminList(){
            pageService.setIndex(mv.page.currentPage);
            var params = {
                offset:(pageService.getIndex()-1) * mv.page.max,
                max:mv.page.max
            };
            mv.page.currentPage = pageService.getIndex();
            if(!pageService.isCanLoad()){
                return;
            }
            $http.post("/admin/loadAdminList",params).success(function(data){
                if(data.success){
                    mv.adminList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message(data.message);
                }
            });
        }
        
        function checkCashRecharge(index){
            var admin = mv.adminList[index];
            $http.post("/admin/checkCashRecharge",{id:admin.id}).success(function(data){
                if(data.success){
                    model.message("管理员:"+admin.adminName+",资金权限修改成功")
                    loadAdminList();
                }
            });
        }

        function resetPassword(index){
            var admin = mv.adminList[index];
            var modalInstance = $uibModal.open({
                size:'sm',
                animation: true,
                templateUrl:'/html/admin/admin/admin_resetpassword.html',
                controller: 'AdminResetPasswordController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    admin:function(){
                        return admin;
                    }
                }
            });
        }

        function addAdmin(){
            var modalInstance = $uibModal.open({
                size:'sm',
                animation: true,
                templateUrl:'/html/admin/admin/admin_template.html',
                controller: 'AdminController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    admin:function(){
                        return null;
                    }
                }
            });
            modalInstance.result.then(function(message){
                model.message(message);
                loadAdminList();
            });
        }
        function editAdmin(index){
            var admin = mv.adminList[index];
            var modalInstance = $uibModal.open({
                size:'sm',
                animation: true,
                templateUrl:'/html/admin/admin/admin_template.html',
                controller: 'AdminController',
                controllerAs:'p',
                backdrop:'static',
                resolve:{
                    admin:function(){
                        return admin;
                    }
                }
            });
            modalInstance.result.then(function(message){
                model.message(message);
                loadAdminList();
            });
        }
    }

    Run.$inject = ['$rootScope',"$state","$http","$uibModal","model"];
    function Run($rootScope,$state,$http,$uibModal,model){
        $rootScope.isCollapsed = false;
        $rootScope.resetPassword = resetPassword;
        $rootScope.outLogin=outLogin;

        $rootScope.$on("loginLose",loginLose);

        $http.get("/admin/adminInfo").success(function(data){//检测登录
            if(data.success){
                $rootScope.adminId = data.id;
                $rootScope.adminName = data.name;
            }else{
                loginLose();
            }
        }).error(loginLose);

        function loginLose() {
            window.location.href = "/html/admin/login.html";
        }
        
        function resetPassword(){
            var modalInstance = $uibModal.open({
                size:'sm',
                animation: true,
                templateUrl:'/html/admin/template/reset_password.html',
                controller: 'ResetPasswordController',
                controllerAs:'p',
                backdrop:'static'
            });
            modalInstance.result.then(function(){
                model.message("密码修改成功,即将跳往登录页重新登录");
                setTimeout(function(){
                    loginLose();
                },2000);
            });
        }

        function outLogin(){
            $http.post("/admin/outLogin").success(function(data){
                if(data.success){
                    window.location.href = "/html/admin/login.html";
                }
            });
        }
        
    }


    Config.$inject = ['$stateProvider',"$httpProvider"];
    function Config($stateProvider,$httpProvider){
        $httpProvider.interceptors.push(LoginInterceptor);//拦截未登录请求直接跳转登录页

        $stateProvider.state("system",{template:"<div ui-view></div>"})
                      .state('system.adminList',{url:"/admin/list",templateUrl:'/html/admin/admin/admin_list.html',controller:'AdminListController',controllerAs:'mv'})
                      .state('system.levelList',{url:"/student/level",templateUrl:'/html/admin/level/level.html',controller:"StudentLevelController",controllerAs:"mv"})
                      .state('system.leaveList',{url:"/leaveRoleList/leave",templateUrl:'/html/admin/leave/leave-role.html',controller:"RoleListController",controllerAs:"mv"});
    }

    LoginInterceptor.$inject=["$q","$injector"];
    function LoginInterceptor($q,$injector){
        var responseInterceptor = {
            response: function(response) {
                var deferred = $q.defer();
                var data = response.data;
                if(!data.success && !!data.notLogin){
                    $injector.invoke(goLogin);
                    deferred.reject(response);
                }else{
                    deferred.resolve(response);
                }
                return deferred.promise;
            }
        };
        return responseInterceptor;

        goLogin.$inject = ["$rootScope"];
        function goLogin($rootScope){
            $rootScope.$broadcast("loginLose");
        }
    }

    return admin;
});