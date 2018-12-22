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

    class TreeController {

        static $inject = ['$scope'];

        constructor($scope: any) {

            $scope.treeOptions = {
                adapter: {
                    loadChildren: this.loadChildren
                },
                data: {
                    id: '001',
                    name: '第一级节点',
                    loaded: true,
                    open: true,
                    children: [
                        { id: '001001', name: '第二级节点01' },
                        { id: '001002', name: '第二级节点02', loaded: true, },
                        { id: '001003', name: '第二级节点03', loaded: true, children: [] },
                        {
                            id: '001004', name: '第二级节点04', loaded: true, open: true,
                            children: [
                                { id: '001004001', name: '第三级节点01' }
                            ]
                        },
                    ]
                }
            };
        }

        private loadChildren = function (parentID: string) {

            return [
                { id: parentID + '001', name: parentID + '的第一孩子', },
                { id: parentID + '002', name: parentID + '的第二孩子', },
                { id: parentID + '003', name: parentID + '的第三孩子', }
            ];
        };
    }

    class $InputModalControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $InputModalControlDirective();
            //directive.$inject = [];
            return directive;
        }

        private modeDefine: { [key: string]: any; } = {
            'table': { templateUrl: 'templates/mcs.input.modal.table.html', controller: GridController },
            'tree': { templateUrl: 'templates/mcs.input.modal.tree.html', controller: TreeController },
            'custom': { templateUrl: null, controller: null }
        }

        private defaultOptions = {
            mode: 'custom',
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

            let modeDefine = this.modeDefine[options.mode];
            options.templateUrl = options.templateUrl || modeDefine.templateUrl;
            options.controller = options.controller || modeDefine.controller

            $scope.open = () => {

                modalService.open({
                    title: '请选择...',
                    templateUrl: options.templateUrl,
                    data: { options: options, value: $scope.bindingValue },
                    controller: options.controller
                }).then(function (data: any) {

                    $scope.bindingValue = data;
                });
            };
        }];
    }

    var inputModal = angular.module('mcs.contols.input.modal', ['mcs.controls.templates']);
    inputModal.directive('mcsInputModal', $InputModalControlDirective.factory());
}