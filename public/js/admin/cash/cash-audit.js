/**
 * Created by liuyao on 2017/5/4.
 */
define(["angular"],function (angular) {
    var cashAudit = angular.module("cashAudit", []);
    cashAudit.controller("CashAuditController",CashAuditController);

    CashAuditController.$inject = ["pageService","model","$http"];
    function CashAuditController(pageService,model,$http){
        pageService.init("CashAuditController");

        var mv = this;
        mv.page = {
            currentPage:pageService.getIndex(),
            max:20,
            total:0
        };
        mv.cashLogList = [];
        mv.loadCashLogList = loadCashLogList;
        mv.auditPass = auditPass;
        mv.chargeCashAuditSwitch = chargeCashAuditSwitch;

        function loadCashLogList(){
            pageService.setIndex(mv.page.currentPage);
            var params = {
                offset:(pageService.getIndex()-1) * mv.page.max,
                max:mv.page.max
            };
            mv.page.currentPage = pageService.getIndex();
            if(!pageService.isCanLoad()){
                return;
            }
            $http.post("/adminCash/loadCashLogPage",params).success(function(data){
                if(data.success){
                    mv.cashLogList = data.list;
                    mv.page.total = data.total;
                }else{
                    model.message(data.message);
                }
            });
        }

        function findCashAuditSwitch(){
            $http.get("/adminCash/findCashAuditSwitch").success(function(data){
                if(data.success){
                    mv.isShow = data.cashAuditSwitch;
                }else{
                    model.message(data.message);
                }
            });
        }

        function auditPass(index,success){
            var log = mv.cashLogList[index];
            $http.post("/adminCash/auditPass",{id:log.id,success:success}).success(function(data){
                if(data.success){
                    if(success){
                        model.message("资金变动申请审核成功");
                        loadCashLogList();
                    }else{
                        model.message("资金变动申请置为审核不通过");
                    }
                }else{
                    model.message(data.message);
                }
            });
        }

        function chargeCashAuditSwitch(){
            $http.post("/adminCash/chargeCashAuditSwitch").success(function(data){
                if(data.success){
                    mv.isShow = data.cashAuditSwitch;
                }else{
                    model.message(data.message);
                }
            });
        }

        loadCashLogList();
        findCashAuditSwitch();
    }


   

    return cashAudit
});