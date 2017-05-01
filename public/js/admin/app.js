/**
 * Created by liuyao on 2017/3/4.
 */
define(["angular",'angular-animate','angular-ui-router',"ui-bootstrap-tpls",'animate'],function (angular) {
    var app = angular.module("app",['ui.bootstrap','ngAnimate','ui.router',"ngAnimate-animate.css","model"]);
    app.config(Config);
    app.run(Run);
    app.service("pageService",PageService);
    app.filter("cashFilter",CashFilter);
    app.directive('openSwitch', OpenSwitch);

    function OpenSwitch(){
        return {
            priority: 0,
            // terminal: true,
            scope: {}, // {} = isolate, true = child, false/undefined = no change
            controllerAs:'Switch',
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            template: "<div class='open-switch'><span class='open-button'></span></div>",
            replace: true,
            transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

            }
        };
    }

    Config.$inject = ['$httpProvider','$stateProvider','$urlRouterProvider'];
    function Config($httpProvider,$stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise("/student/list");
    }

    Run.$inject= ["$rootScope","$http","model","$state"];
    function Run($rootScope,$http,model,$state){
        $rootScope.$state = $state;
        $http.get("/admin/getMumeList").success(function(data){
            $rootScope.mumeList = data.mumeList;
            $rootScope.secondListMap = data.secondListMap;
        }).error(function(){
            model.message("获取菜单列表失败,请刷新重试");
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){
            $rootScope.stateName = toState.name;
        });

        $rootScope.getStateName = function(){
            return angular.element(".product-nav-list .active .nav-title").html();
        }

        $rootScope.goBack = function(){
            history.go(-1);
        };

        $rootScope.getFristState = function(){
            if(angular.isString($rootScope.stateName)){
                var stateList = $rootScope.stateName.split(".");
                return stateList[0];
            }else{
                return "";
            }
        };
    }

    function PageService(){
        this.pageType = null;
        this.pageIndex = 1;
        this.hasIndex = false;
        this.canload = true;
    }
    PageService.prototype.init = function(pageType){
        if(this.pageType==pageType && this.pageIndex !=1){
            this.hasIndex = true;
            return;
        }
        this.pageType = pageType;
        this.pageIndex = 1;
    };
    PageService.prototype.setIndex = function(index){
        if(this.hasIndex && index==1){
            this.hasIndex = false;
            this.canload = false;
            return;
        }
        this.pageIndex = index;
    };
    PageService.prototype.getIndex = function(){
        return this.pageIndex;
    };
    PageService.prototype.isCanLoad=function(){
        if(this.canload){
            return true;
        }else{
            this.canload = true;
            return false;
        }
    };


    CashFilter.$inject = [];
    function CashFilter(){
        var formet = 2;
        var zheng = "+";
        return function(input,fuhao){
            if(input!=0 && !input){
                return "";
            }
            if(fuhao && input>0){
                return zheng+(input/100).toFixed(formet);
            }else{
                return (input/100).toFixed(formet);
            }
        }
    }

    return app;
});