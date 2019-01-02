namespace mcscontrols {

    //树控件的配置
    interface TreeControlOptions {
        adapter?: TreeControlAdapterOptions;
        data: TreeNode;
        async: TreeControlAsyncOptions;
        edit: TreeControlEditOptions;
        callback: TreeControlcallBackOptions;
    }

    interface TreeControlcallBackOptions {
        onClick?: (treeNode: TreeNode, context: any) => void;
    }

    //树控件的配置中编辑的设定
    interface TreeControlEditOptions {
        enable: boolean;
        allowAdd: boolean;
        allowDel: boolean;
        allowEdit: boolean;
    }

    //树控件的配置中适配器的设定
    interface TreeControlAsyncOptions {
        url: string;
        params: any;
    }

    //树控件的配置中适配器的设定
    interface TreeControlAdapterOptions {
        loadRootNode?:
        ((parentID: string, parameters: any) => ng.IPromise<TreeNode>)
        | ((parentID: string, parameters: any) => TreeNode);

        loadChildren?:
        ((parentID: string, parameters: any) => ng.IPromise<Array<TreeNode>>)
        | ((parentID: string, parameters: any) => Array<TreeNode>);
    }

    //树节点的类型
    enum TreeNodeType {
        folder = 0,
        file = 1,
        user = 2
    }

    //树节点数据源的定义
    interface TreeNode {
        id: string;
        name: string;
        parentID: string;
        fullPath: string;
        data: any;
        open?: boolean;
        type?: TreeNodeType;
        allowAdd?: boolean;
        allowDel?: boolean;
        allowEdit?: boolean;
        children?: Array<TreeNode>;
    }

    //树节点视图模型的定义
    interface TreeNodeViewModel {
        level: number;
        type: TreeNodeType;
        open: boolean;
        loaded: boolean;
        focus: boolean;
        source: TreeNode;
        allowAdd: boolean;
        allowDel: boolean;
        allowEdit: boolean;
        children?: Array<TreeNodeViewModel>;
    }

    //树控件Scope的定义
    interface ITreeControlScope extends ng.IScope {
        optionsName: string;
        data?: TreeNodeViewModel;
        rootContainer: JQLite;
        bindingValue?: Array<TreeNode> | TreeNode;
    }

    //树控件的控制器
    class $TreeControlController {

        private _options: TreeControlOptions;
        private _focusNode?: TreeNodeViewModel;

        static $inject: Array<string> = ['$scope', '$q', '$templateCache', '$compile', '$controller', '$http', 'toastrService'];
        constructor(
            private $scope: ITreeControlScope,
            private $q: ng.IQService,
            private $templateCache: ng.ITemplateCacheService,
            private $compile: ng.ICompileService,
            private $controller: ng.IControllerService,
            private $http: ng.IHttpService,
            private toastrService: any,
        ) {

            if (!$scope.optionsName) throw 'must need options.'
            var options = $scope.$parent.$eval($scope.optionsName);
            if (!options) throw 'must need options.'

            this._options = angular.copy(options);
            this.initializeOptions(this._options);

            this.loadRootNode().then(data => {

                this.renderTreeNode($scope.rootContainer, $scope, data);
            })
        }

        public renderTreeNode(container: JQLite, $parentScope: ng.IScope, data: TreeNodeViewModel): void {

            var template = angular.element(this.$templateCache.get('templates/mcs.tree.node.html') as string);

            var newScope = $parentScope.$new() as ITreeNodeControlScope;
            newScope.rootController = this;
            newScope.item = data;
            newScope.nodeContainer = template.find('.node-container');

            this.$controller($TreeNodeController, { $scope: newScope });
            var clonedElement = this.$compile(template)(newScope);

            container.append(clonedElement);
        }

        public focusNode(item: TreeNodeViewModel): void {

            if (this._focusNode) this._focusNode.focus = false;
            item.focus = true;
            this._focusNode = item;

            //TODO:只有单选才是激活及选择
            this.selected(item);

            if (this._options.callback && this._options.callback.onClick) {

                this._options.callback.onClick(item.source, {});
            }
        }

        //加载根节点
        public loadRootNode(): ng.IPromise<TreeNodeViewModel> {

            var defer = this.$q.defer<TreeNodeViewModel>();

            if (this.$scope.data) { //相当于缓存
                defer.resolve(this.convertViewModel(this._options.data, 0));
            }
            else if (this._options.data) { //从配置初始化

                var data = angular.copy(this._options.data);

                data.open = this._options.data.children != null; //根节点需要展开
                this.$scope.data = this.convertViewModel(data, 0);

                defer.resolve(this.$scope.data);
            } else if (this._options.async && this._options.async.url) { //用HTTP加载

                var params = null;
                if (this._options.async && this._options.async.params) {
                    params = this._options.async.params;
                }

                this.$http.get<TreeNode>(this._options.async.url + '/Root', { params: params }).then(
                    response => {

                        var data = response.data;

                        if (!data) {
                            this.toastrService.send('HTTP无法找到节点', '出错了 :(', 2);
                            return;
                        }

                        this.$scope.data = this.convertViewModel(data, 0);

                        defer.resolve(this.$scope.data);
                    },
                    reason => { this.toastrService.send('HTTP获取根节点失败', '出错了 :(', 3) }
                );
            }

            return defer.promise;
        }

        public loadChildrenTreeNode(treeNode: TreeNodeViewModel): ng.IPromise<Array<TreeNodeViewModel>> {

            var defer = this.$q.defer<Array<TreeNodeViewModel>>();
            var options: TreeControlOptions = this._options;

            if (treeNode.children) {//相当于缓存
                defer.resolve(treeNode.children);
            }
            else if (options.adapter && options.adapter.loadChildren) {

                var params = null;

                if (options.async && options.async.params) {

                    params = options.async.params;
                }

                var loadChildren = options.adapter.loadChildren(treeNode.source.id, params);

                if (this.isIPromise(loadChildren)) {

                    (<ng.IPromise<Array<TreeNode>>>loadChildren).then(data => {

                        data = data || [];

                        var children = this.convertViewModels(data, treeNode.level);
                        treeNode.children = children;
                        treeNode.loaded = true;

                        defer.resolve(treeNode.children);
                    });
                } else {

                    var children = this.convertViewModels(<Array<TreeNode>>loadChildren, treeNode.level);
                    treeNode.children = children;
                    treeNode.loaded = true;

                    defer.resolve(treeNode.children);
                }
            }

            return defer.promise;
        }

        private selected(item: TreeNodeViewModel): void {

            //TODO:单选、多选
            if (
                this.$scope.bindingValue
                && (<TreeNode>this.$scope.bindingValue).id == item.source.id) {
                return;
            }

            var newData: TreeNode = angular.copy(item.source);
            newData.children = undefined;

            this.$scope.bindingValue = newData;
        }

        private initializeOptions(options: TreeControlOptions) {

            if (!options.edit) {

                options.edit = {
                    enable: false,
                    allowAdd: false,
                    allowDel: false,
                    allowEdit: false
                }
            } else {
                options.edit.enable = typeof (options.edit.enable) == 'undefined' ? false : options.edit.enable;
                options.edit.allowAdd = typeof (options.edit.allowAdd) == 'undefined' ? options.edit.enable : options.edit.allowAdd;
                options.edit.allowDel = typeof (options.edit.allowDel) == 'undefined' ? options.edit.enable : options.edit.allowDel;
                options.edit.allowEdit = typeof (options.edit.allowEdit) == 'undefined' ? options.edit.enable : options.edit.allowEdit;
            }
        }

        private isIPromise(source: any) {

            return source && typeof (source.then) != 'undefined';
        }

        private convertViewModels(treeNodes: Array<TreeNode>, level: number): Array<TreeNodeViewModel> {

            var result: Array<TreeNodeViewModel> = [];

            for (let index = 0; index < treeNodes.length; index++) {

                const element = treeNodes[index];

                var newVm = this.convertViewModel(element, level);
                if (newVm) result.push(newVm);
            }

            return result;
        }

        //把数据源转换为视图模型
        private convertViewModel(treeNode: TreeNode, level: number): TreeNodeViewModel | undefined {

            if (!treeNode) { return undefined };

            var target: TreeNode = treeNode as TreeNode;

            level++;

            var result: TreeNodeViewModel = {
                level: level,
                open: target.open || false,
                loaded: false,
                type: target.type || TreeNodeType.folder,
                source: treeNode,
                focus: false,
                allowAdd: typeof (treeNode.allowAdd) == 'undefined' ? this._options.edit.allowAdd : treeNode.allowAdd,
                allowDel: typeof (treeNode.allowDel) == 'undefined' ? this._options.edit.allowDel : treeNode.allowDel,
                allowEdit: typeof (treeNode.allowEdit) == 'undefined' ? this._options.edit.allowEdit : treeNode.allowEdit,
            };

            if (target.children && target.children.constructor == Array) {

                result.loaded = true;
                result.children = this.convertViewModels(target.children, level);
            }

            return result;
        }
    }

    //树节点的Scope
    interface ITreeNodeControlScope extends ng.IScope {
        item: TreeNodeViewModel;
        nodeContainer: JQLite;
        rootController: $TreeControlController;

        expand: () => void;
        focusNode: () => void;
    }

    //树节点的控制器
    class $TreeNodeController {

        static $inject: Array<string> = ['$scope'];
        constructor(
            private $scope: ITreeNodeControlScope,
        ) {

            $scope.expand = () => {

                $scope.item.open = !$scope.item.open;

                if ($scope.item.open && !$scope.item.loaded && $scope.item.type == TreeNodeType.folder) {

                    this.internalRenderChildren($scope);
                }
            }

            $scope.focusNode = () => {
                $scope.rootController.focusNode($scope.item);
            };

            if ($scope.item.open && $scope.item.type == TreeNodeType.folder) {

                this.internalRenderChildren($scope);
            }
        }

        private internalRenderChildren($scope: ITreeNodeControlScope) {

            $scope.rootController.loadChildrenTreeNode($scope.item).then(data => {

                $scope.nodeContainer.html('');

                for (let index = 0; index < data.length; index++) {

                    const element = data[index];
                    $scope.rootController.renderTreeNode($scope.nodeContainer, $scope, element);
                }
            });
        }
    }

    //Directive 的定义
    class $TreeControlDirective implements ng.IDirective<ITreeControlScope> {

        static factory(): ng.IDirectiveFactory<ITreeControlScope> {

            const directive = () => new $TreeControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor(
        ) {
        }

        templateUrl = 'templates/mcs.tree.html';
        restrict = 'A';
        scope = {
            optionsName: '@mcsTree',
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };

        controller = $TreeControlController;

        link = (
            scope: ITreeControlScope,
            instanceElement: JQLite,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {

            scope.rootContainer = instanceElement.find('.ztree');
        }
    }

    var tree = angular.module('mcs.controls.tree', ['mcs.controls.templates']);
    tree.directive('mcsTree', $TreeControlDirective.factory());
}