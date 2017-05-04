/**
 * Created by liuyao on 2017/5/4.
 */
define(["cash-audit"],function (cashAudit) {
    var cashRouter = angular.module("cashRouter", ['cashAudit']);
    cashRouter.config(Config);

    Config.$inject = ['$stateProvider',"$httpProvider"];
    function Config($stateProvider,$httpProvider){
        $stateProvider.state("cash",{template:'<div ui-view></div>'})
            .state('cash.cashAudit',{url:"/cash/cashAudit",templateUrl:'/html/admin/cash/cash_audit.html',controller:'CashAuditController',controllerAs:'mv'})
    }

    return cashRouter;
});