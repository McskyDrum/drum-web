define(["angular"],function (angular) {
    var model = angular.module("model",[]);

    model.service('model',Model)
    model.controller('ModelCtrl',ModelCtrl);

    ModelCtrl.$inject = ['$timeout','$interval','model']
    function ModelCtrl($timeout,$interval,model){
        var mv = this;
        mv.hasMask = false;
        mv.isWhite = false;
        mv.selection = null;
        mv.title = "";
        mv.message = "";
        mv.confirm_submit = confirm_submit;
        mv.confirm_cancel = confirm_cancel;
        mv.submitButton = "";
        mv.cancelButton = "";
        mv.promptMessage = "";


        //供服务反向调用
        this.alert = alert;
        this.confirm = confirm;
        this.prompt = prompt;
        this.loading = loading;
        this.loading_stop = loading_stop;
        this.updateMessage = updateMessage;

        model.regestModelCtrl(this);

        var messageQueue = [];
        var promiss = null;

        function alert(message,title,delay,intervalMark){
            if(!!promiss || !!mv.selection){
                if(!intervalMark){
                    messageQueue.push({"message":message,'title':title,"delay":delay});
                    openInterval();
                }
                return
            }
            var time =  !!delay?delay:2000;
            mv.selection = "message";
            mv.title = !!title?title:'提示';
            mv.message = message;
            promiss = $timeout(function(){
                init();
                promiss = null;
            },time)
        }

        //每5秒检测一次消息队列
        var interval = null;
        function openInterval(){
            if(!!interval) return
            $timeout(function(){
                interval = 	$interval(function(){
                    if(messageQueue.length>0){
                        var m = messageQueue.shift()
                        alert(m.message,m.title,m.delay,true)
                        if(messageQueue.length<=0){
                            $interval.cancel(interval);
                            interval = null;
                        }
                    }
                },3000)
            },3000)
        }

        function confirm(message,config,prms){
            if(!!promiss || !!mv.selection) return;
            if(!prms) throw 'confirm传入的prms为空';
            mv.selection = "confirm";
            if(angular.isString(config)){
                mv.title = config;
            }
            if(angular.isObject(config)){
                mv.title = config.title;
                mv.submitButton = config.submitButton;
                mv.cancelButton = config.cancelButton;
            }
            mv.message = message;
            mv.hasMask = true;
            mv.isWhite = true;
            promiss = prms;
        }

        function prompt(message,config,prms){
            if(!!promiss || !!mv.selection) return;
            if(!prms) throw 'prompt传入的prms为空';
            mv.selection = "prompt";
            if(angular.isString(config)){
                mv.title = config;
            }
            if(angular.isObject(config)){
                mv.title = config.title;
                mv.submitButton = config.submitButton;
                mv.cancelButton = config.cancelButton;
            }
            mv.message = message;
            mv.hasMask = true;
            mv.isWhite = true;
            promiss = prms;
        }

        function confirm_submit(){
            if(!promiss) return;
            promiss.resolve(mv.promptMessage);
            init()
            promiss = null;
        }

        function confirm_cancel(){
            if(!promiss) return;
            promiss.reject();
            init()
            promiss = null;
        }

        function loading(message,outTime){
            if(!!promiss || !!mv.selection) return false;
            mv.message = message;
            mv.hasMask = true;
            mv.selection = 'loading';
            if(!!outTime && angular.isNumber(outTime)){
                promiss = $timeout(function(){
                    loading_stop();
                    alert('等待超时')
                },outTime);
            }
            return true;
        }

        function loading_stop(){
            if(mv.selection != 'loading') return
            init();
            if(!!promiss){
                $timeout.cancel(promiss);
                promiss = null;
            }
        }

        function updateMessage(message){
            mv.message = message;
        }

        function init(){
            mv.hasMask = false;
            mv.selection = null;
            mv.message = "";
            mv.isWhite = false;
            mv.title = "";
            mv.submitButton = "";
            mv.cancelButton = "";
            mv.promptMessage = "";
        }

    }

    Model.$inject = ['$q']
    function Model($q){
        //打开消息提示
        this.message = message;
        this.confirm = confirm;
        this.prompt = prompt;
        this.loading = loading;

        this.controller = null;
        this.regestModelCtrl = regestModelCtrl;

        function regestModelCtrl(controller){
            this.controller = controller;
        }

        function message(config){
            if(!this.controller) return;
            if(angular.isString(config)){
                this.controller.alert(config);
            }else{
                this.controller.alert(config.message,config.title,config.delay);
            }
        }

        function confirm(message,resolve,reject,config){
            if(!angular.isFunction(resolve) || !angular.isFunction(reject)){
                throw 'confirm传入参数不是回调函数'
            }
            var deferred = $q.defer();
            var promiss = deferred.promise;
            promiss.then(resolve,reject);
            this.controller.confirm(message,config,deferred);
        }

        function prompt(message,resolve,reject,config){
            if(!angular.isFunction(resolve) || !angular.isFunction(reject)){
                throw 'prompt传入参数不是回调函数'
            }
            var deferred = $q.defer();
            var promiss = deferred.promise;
            promiss.then(resolve,reject);
            this.controller.prompt(message,config,deferred);
        }


        var _this = this;
        function LoadCtrl(){
            this.controller = _this.controller;
            this.close = function(){
                this.controller.loading_stop();
            }
            this.notify = function (message) {
                this.controller.updateMessage(message);
            }
        }

        function loading(message,delay){
            if(this.controller.loading(message,delay)){
                return new LoadCtrl()
            }else{
                return {close:angular.noop}
            }
        }
    }

    return model;
});


