/**
 * Created by liuyao on 2017/9/9.
 */
define(["admin","musical"],function(admin, musical){

    var system = angular.module("system",['admin','musical']);
    system.config(Config);
    system.run(Run);
    system.factory("LoginInterceptor",LoginInterceptor);

    Config.$inject = ['$stateProvider',"$httpProvider"];
    function Config($stateProvider,$httpProvider){
        $httpProvider.interceptors.push(LoginInterceptor);//拦截未登录请求直接跳转登录页

        $stateProvider.state("system",{template:"<div ui-view></div>"})
            .state('system.adminList',{url:"/admin/list",templateUrl:'/html/admin/admin/admin_list.html',controller:'AdminListController',controllerAs:'mv'})
            .state('system.musicalList',{url:"/musicalList",templateUrl:'/html/admin/level/musicalLevel.html',controller:"MusicalController",controllerAs:"mv"})
            .state('system.leaveList',{url:"/leaveRoleList/leave",templateUrl:'/html/admin/leave/leave-role.html',controller:"RoleListController",controllerAs:"mv"});
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

    return system;
});