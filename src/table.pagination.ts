namespace mcscontrols {

    interface TablePaginationOption {
        pageSize?: number;
        adapter: TablePaginationAdapterOption;
        async: TablePaginationAsyncOptions;
    }

    interface TablePaginationAsyncOptions {
        url: string;
        params: any;
    }

    interface TablePaginationAdapterOption {

        loadPaginationData?:
        ((pagination: Pagination, params: any) => ng.IPromise<PaginationData>)
        | ((pagination: Pagination, params: any) => PaginationData);
    }

    interface ITablePaginationScope extends ng.IScope {
        optionsName: string;
        data: Array<any>;
        currentPageIndex: number;
        currentPageSize: number;
        currentTotalCount: number;
        readonly: boolean;
        bindingValue: any | Array<any>;

        selected: (item: any) => void;
    }

    interface Pagination {
        pageIndex: number,
        pageSize: number
    }

    interface PaginationData extends Pagination {
        pageIndex: number,
        pageSize: number,
        totalCount: number,
        data: Array<any>
    }

    interface ITableInfo {
        container: JQLite,
        table: JQLite,
        thead: JQLite,
        tBody: JQLite,
        tfoot: JQLite,
        columnsCount: number,
    }

    class $TablePaginationController {

        static $inject: Array<string> = ['$scope', '$q', 'toastrService'];
        constructor(
            private $scope: ITablePaginationScope,
            private $q: ng.IQService,
            toastrService: any
        ) {
            var options: TablePaginationOption = $scope.$parent.$eval($scope.optionsName);
            if (!options) throw 'Must have options';

            var pagination: Pagination = {
                pageIndex: 0,
                pageSize: options.pageSize || 20
            }

            $scope.selected = function (item: any) {

                $scope.bindingValue = item;
            }

            this.loadPaginationData(pagination, options).then(data => {

                this.initializeScope(data, $scope);
            });
        }

        private initializeScope(source: PaginationData, $scope: ITablePaginationScope) {

            $scope.data = source.data;
            $scope.currentPageIndex = source.pageIndex;
            $scope.currentPageSize = source.pageSize;
            $scope.currentTotalCount = source.totalCount;
        }

        private loadPaginationData(pagination: Pagination, options: TablePaginationOption): ng.IPromise<PaginationData> {

            var defer = this.$q.defer<PaginationData>();

            var params = null;
            if (options.async && options.async.params) {
                params = options.async.params;
            }

            if (options.adapter && options.adapter.loadPaginationData) {

                var loadData = options.adapter.loadPaginationData(pagination, params);

                if (this.isIPromise(loadData)) {

                    (<ng.IPromise<PaginationData>>loadData).then(data => {

                        defer.resolve(data);
                    });
                } else {
                    defer.resolve(loadData);
                }
            }

            return defer.promise;
        }

        private isIPromise(source: any) {

            return source && typeof (source.then) != 'undefined';
        }
    }

    class $TablePaginationDirective implements ng.IDirective<ITablePaginationScope> {

        static factory(): ng.IDirectiveFactory {

            const directive = (a: ng.ITemplateCacheService, b: ng.ICompileService) => new $TablePaginationDirective(a, b);
            directive.$inject = ['$templateCache', '$compile'];
            return directive;
        }

        constructor(
            private $templateCache: ng.ITemplateCacheService,
            private $compile: ng.ICompileService
        ) {
        }

        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            optionsName: '@mcsTablePagination',
            readonly: '=?mcsReadonly'
        };

        controller = $TablePaginationController;

        template = (tElement: JQLite, tAttrs: ng.IAttributes): string => {

            let tableInfo = this.initializTableInfo(tElement);

            this.initializHead(tableInfo);
            this.initializeBody(tableInfo);

            this.initializPagination(tableInfo);

            this.initializAllCheckbox(tableInfo);

            return tableInfo.container[0].outerHTML;
        };

        private initializTableInfo(instanceElement: JQLite): ITableInfo {

            var container = angular.element('<div></div>');
            //container.addClass('table-responsive');

            var table = instanceElement.clone();
            table.removeAttr('mcs-table-pagination');

            container.append(table);

            var tbody = table.find('tbody');
            if (tbody.length != 1) throw 'Tables can only have one tbody;'

            var tbodyTemplete = tbody.find('tr');
            if (tbodyTemplete.length == 0) throw 'tbody must have tr;'

            var columnsCount = 0;

            for (let index = 0; index < tbodyTemplete[0].children.length; index++) {
                const element = tbodyTemplete[0].children[index];

                columnsCount += (Number(element.getAttribute('colspan')) || 1)
            }

            return {
                container: container,
                table: table,
                thead: table.find('thead'),
                tBody: tbody,
                tfoot: table.find('tfoot'),
                columnsCount: columnsCount,
            };
        }

        private initializAllCheckbox(tableInfo: ITableInfo): void {

            var theadCheckbox = this.renderCheckbox(tableInfo.thead);
            var tBodyCheckbox = this.renderCheckbox(tableInfo.tBody);
            var tfootCheckbox = this.renderCheckbox(tableInfo.tfoot);

            this.bindingItemCheckbox(tBodyCheckbox);
        }

        private bindingItemCheckbox(checkbox: JQLite | undefined) {

            if (!checkbox) return;

            checkbox.attr('ng-click', 'selected(item, $event)');
        }

        private renderCheckbox(element: JQLite): JQLite | undefined {

            var tr = element.find('tr');

            if (tr.length > 0) {

                var td = angular.element('<th></th>');
                var checkbox = angular.element('<input type="checkbox" ng-disabled="readonly" />');
                td.append(checkbox);

                td.attr('rowspan', tr.length);

                angular.element(tr[0]).prepend(td);

                return checkbox;
            }

            return undefined;
        }

        private initializHead(tableInfo: ITableInfo) {

        }

        private initializeBody(tableInfo: ITableInfo) {

            var tBoydTR = tableInfo.tBody.find('tr')

            if (tBoydTR.length == 1) {

                tBoydTR.attr('ng-repeat', 'item in data track by $index');
            } else {

                tBoydTR[0].setAttribute('ng-repeat-start', 'item in data track by $index');
                tBoydTR[tBoydTR.length - 1].setAttribute('ng-repeat-end', '');
            }
        }

        private initializPagination(tableInfo: ITableInfo): void {

            var paginationTemplate = <string>this.$templateCache.get('templates/mcs.table.pagination.html');

            tableInfo.container.append(paginationTemplate)
        }
    }

    const tablePagination = angular.module('mcs.contols.table.pagination', ['mcs.controls.templates']);
    tablePagination.directive('mcsTablePagination', $TablePaginationDirective.factory());
}