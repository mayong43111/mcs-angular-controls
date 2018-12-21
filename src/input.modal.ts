namespace mcscontrols {

    class GridController {

        static $inject = ['$scope'];

        constructor($scope: any) {

            $scope.gridOptions = {
                adapter: {
                    loadPaginationData: this.loadPaginationData
                },
            };
        }

        private loadPaginationData = function (pagination: any, params: any) {

            return {
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                totalCount: 500,
                data: [
                    { id: pagination.pageIndex + '001', text: '的第一孩子', },
                    { id: pagination.pageIndex + '002', text: '的第二孩子', },
                    { id: pagination.pageIndex + '003', text: '的第三孩子', }
                ]
            };
        };
    }

    class $InputModalControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $InputModalControlDirective();
            //directive.$inject = [];
            return directive;
        }

        private defaultOptions = {
            templateUrl: 'templates/mcs.input.modal.open.html',
            Controller: GridController
        };

        constructor() {
        }

        templateUrl = 'templates/mcs.input.modal.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            optionsName: '@mcsInputModal',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', '$templateCache', 'modalService', ($scope: any, $templateCache: any, modalService: any) => {

            if (!$scope.bindingValue || $scope.bindingValue.constructor != Array) {
                $scope.bindingValue = [];
            }

            var options = angular.extend({}, this.defaultOptions, $scope.$eval($scope.optionsName));

            $scope.open = () => {

                modalService.open({
                    title: '请选择...',
                    template: $templateCache.get(options.templateUrl),
                    data: { options: options, value: $scope.bindingValue },
                    controller: options.Controller
                }).then(function (data: any) {

                    $scope.bindingValue = data;
                });
            };
        }];
    }

    var inputModal = angular.module('mcs.contols.input.modal', ['mcs.controls.templates']);
    inputModal.directive('mcsInputModal', $InputModalControlDirective.factory());
}