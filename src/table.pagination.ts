namespace mcscontrols {

    interface PagedQueryCriteria {
        condition?: any;
        pageParams: Pagination;
        orderBy?: any;
    }

    interface TablePaginationOption {
        pageSize?: number;
        adapter?: TablePaginationAdapterOption;
        async?: TablePaginationAsyncOptions;
        callback?: TablePaginationCallBackOptions;
    }

    interface TablePaginationCallBackOptions {
        onInitiated?: (controller: $TablePaginationController) => void;
    }

    interface TablePaginationAsyncOptions {
        url?: string;
        params?: any;
        orderBy?: any;
    }

    interface TablePaginationAdapterOption {

        loadPaginationData?:
        ((pagination: PagedQueryCriteria) => ng.IPromise<PaginationData>)
        | ((pagination: PagedQueryCriteria) => PaginationData);
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
        changePaginate: (pagination: Pagination) => void;
    }

    interface Pagination {
        pageIndex: number,
        pageSize: number,
        totalCount: number,
        top: number;
    }

    interface PaginationData extends Pagination {
        pagedData: Array<any>
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

        private currentPagination: Pagination;
        private currentOptions: TablePaginationOption;

        static $inject: Array<string> = ['$scope', '$q', '$http', 'toastrService'];
        constructor(
            private $scope: ITablePaginationScope,
            private $q: ng.IQService,
            private $http: ng.IHttpService,
            private toastrService: any
        ) {
            this.currentOptions = $scope.$parent.$eval($scope.optionsName);
            if (!this.currentOptions) throw 'Must have options';

            this.currentPagination = {
                pageIndex: 1,
                pageSize: this.currentOptions.pageSize || 20,
                totalCount: -1,
                top: -1
            };

            $scope.selected = function (item: any) {

                $scope.bindingValue = item;
            }

            $scope.changePaginate = (pagination: Pagination) => {

                if (!pagination || pagination.pageIndex == this.currentPagination.pageIndex) return;

                this.refresh(pagination);
            }

            this.loadPaginationData(this.currentPagination, this.currentOptions).then(data => {

                this.initializeScope(data, $scope);
            });

            if (this.currentOptions.callback && this.currentOptions.callback.onInitiated) {

                this.currentOptions.callback.onInitiated(this);
            }
        }

        public refresh(pagination?: Pagination) {

            pagination = pagination || this.currentPagination;

            this.loadPaginationData(pagination, this.currentOptions).then(data => {

                this.initializeScope(data, this.$scope);
            });
        }

        public search(params?: any) {

            let pagination: Pagination = {
                pageIndex: 1,
                pageSize: this.currentOptions.pageSize || 20,
                totalCount: -1,
                top: -1
            };

            if (params) {
                this.currentOptions.async = this.currentOptions.async || {};
                this.currentOptions.async.params = params;
            }

            this.loadPaginationData(pagination, this.currentOptions).then(data => {

                this.initializeScope(data, this.$scope);
            });
        }

        private initializeScope(source: PaginationData, $scope: ITablePaginationScope) {

            this.calculateCurrentPaginate($scope, source);
            $scope.data = source.pagedData;
        }

        private loadPaginationData(pagination: Pagination, options: TablePaginationOption): ng.IPromise<PaginationData> {

            var defer = this.$q.defer<PaginationData>();

            var pagedQueryCriteria: PagedQueryCriteria = { pageParams: pagination };

            if (options.async && options.async.params) {
                pagedQueryCriteria.condition = options.async.params;
            }

            if (options.async && options.async.orderBy) {
                pagedQueryCriteria.orderBy = options.async.orderBy;
            }

            if (options.adapter && options.adapter.loadPaginationData) {

                var loadData = options.adapter.loadPaginationData(pagedQueryCriteria);

                if (this.isIPromise(loadData)) {

                    (<ng.IPromise<PaginationData>>loadData).then(data => {

                        defer.resolve(data);
                    });
                } else {
                    defer.resolve(loadData);
                }
            } else if (options.async && options.async.url) {

                this.$http.post<PaginationData>(options.async.url, pagedQueryCriteria).then(
                    res => {
                        defer.resolve(res.data);
                    },
                    res => {
                        this.toastrService.send('HTTP获取失败', '出错了 :(', 3)
                    });
            }

            return defer.promise;
        }

        private isIPromise(source: any) {

            return source && typeof (source.then) != 'undefined';
        }

        private calculateCurrentPaginate(scope: any, data: any): void {

            var currentPaginate = this.currentPagination = {
                pageIndex: data.pageIndex,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                top: -1
            };

            scope.currentPaginate = currentPaginate;

            scope.paginates = [];
            scope.previousPaginate = null;
            scope.nextPaginate = null;
            scope.firstPaginate = null;
            scope.lastestPaginate = null;
            scope.isShowLastestMore = false;
            scope.isShowFirstMore = false;

            if (!currentPaginate || !currentPaginate.totalCount || !currentPaginate.pageSize) return;

            var totalPageCount = Math.ceil(currentPaginate.totalCount / currentPaginate.pageSize);
            scope.totalPageCount = totalPageCount;

            if (currentPaginate.pageIndex < totalPageCount) {
                var nextPaginate: Pagination = {
                    pageIndex: currentPaginate.pageIndex + 1,
                    pageSize: currentPaginate.pageSize,
                    totalCount: currentPaginate.totalCount,
                    top: -1
                }
                scope.nextPaginate = nextPaginate;
            }

            if (currentPaginate.pageIndex > 1) {
                var previousPaginate: Pagination = {
                    pageIndex: currentPaginate.pageIndex - 1,
                    pageSize: currentPaginate.pageSize,
                    totalCount: currentPaginate.totalCount,
                    top: -1
                }

                scope.previousPaginate = previousPaginate;
            }

            var i = currentPaginate.pageIndex - 2;
            if (i < 1) { i = 1; }
            var maxi = i + 4;

            if (i > 1) {
                var firstPaginate: Pagination = {
                    pageIndex: 1,
                    pageSize: currentPaginate.pageSize,
                    totalCount: currentPaginate.totalCount,
                    top: -1
                };

                scope.firstPaginate = firstPaginate;
            }

            scope.isShowFirstMore = i > 2;

            if (maxi <= totalPageCount) {

                var lastestPaginate: Pagination = {
                    pageIndex: totalPageCount,
                    pageSize: currentPaginate.pageSize,
                    totalCount: currentPaginate.totalCount,
                    top: -1
                }

                scope.lastestPaginate = lastestPaginate;
            }

            if (maxi < totalPageCount) {
                scope.isShowLastestMore = true;
            }

            for (i; i < maxi && i <= totalPageCount; i++) {
                var item: Pagination = {
                    pageIndex: i,
                    pageSize: currentPaginate.pageSize,
                    totalCount: currentPaginate.totalCount,
                    top: -1
                }

                scope.paginates.push(item);
            }
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

    const tablePagination = angular.module('mcs.controls.table.pagination', ['mcs.controls.templates']);
    tablePagination.directive('mcsTablePagination', $TablePaginationDirective.factory());
}