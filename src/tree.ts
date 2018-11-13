//树控件的配置
interface TreeControlOptions {
    adapter?: TreeControlAdapterOptions;
    data: TreeNode;
}

//树控件的配置中适配器的设定
interface TreeControlAdapterOptions {
    loadChildren?: ((parentID: string) => ng.IPromise<Array<TreeNode>>) | ((parentID: string) => Array<TreeNode>) | undefined;
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
    children?: Array<TreeNode>;
}

//树节点视图模型的定义
interface TreeNodeViewModel {
    level: number;
    type: TreeNodeType;
    open: boolean;
    loaded: boolean;
    source: TreeNode;
    children?: Array<TreeNodeViewModel>;
}

//树控件Scope的定义
interface ITreeControlScope extends ng.IScope {
    optionsName: string;
    options: TreeControlOptions;
    data: TreeNodeViewModel;
    rootContainer: JQLite;
}

//树控件的控制器
class $TreeControlController {

    private options: TreeControlOptions;

    static $inject: Array<string> = ['$scope', '$q', '$templateCache', '$compile', '$controller'];
    constructor(
        private $scope: ITreeControlScope,
        private $q: ng.IQService,
        private $templateCache: ng.ITemplateCacheService,
        private $compile: ng.ICompileService,
        private $controller: ng.IControllerService,
    ) {

        if (!$scope.optionsName) throw 'must need options.'
        $scope.options = $scope.$parent.$eval($scope.optionsName);
        if (!$scope.options) throw 'must need options.'

        this.options = $scope.options;

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

    //加载根节点
    public loadRootNode(): ng.IPromise<TreeNodeViewModel> {

        var defer = this.$q.defer<TreeNodeViewModel>();

        if (this.$scope.data) {
            defer.resolve(this.convertViewModel(this.options.data, 0));
        }
        else if (this.options.data) {

            this.options.data.open = this.options.data.children != null; //根节点需要展开
            this.$scope.data = this.convertViewModel(this.options.data, 0);

            defer.resolve(this.$scope.data);
        }

        return defer.promise;
    }

    public loadChildrenTreeNode(treeNode: TreeNodeViewModel): ng.IPromise<Array<TreeNodeViewModel>> {

        var defer = this.$q.defer<Array<TreeNodeViewModel>>();

        if (treeNode.children) {
            defer.resolve(treeNode.children);
        }
        else if (this.options.adapter && this.options.adapter.loadChildren) {


            var loadChildren = this.options.adapter.loadChildren(treeNode.source.id);

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

    private isIPromise(source: any) {

        return source && typeof (source.then) != 'undefined';
    }

    private convertViewModels(treeNodes: Array<TreeNode>, level: number): Array<TreeNodeViewModel> {

        var result: Array<TreeNodeViewModel> = [];

        for (let index = 0; index < treeNodes.length; index++) {
            const element = treeNodes[index];

            result.push(this.convertViewModel(element, level));
        }

        return result;
    }

    //把数据源转换为视图模型
    private convertViewModel(treeNode: TreeNode, level: number): TreeNodeViewModel {

        level++;

        var result: TreeNodeViewModel = {
            level: level,
            open: treeNode.open || false,
            loaded: false,
            type: treeNode.type || TreeNodeType.folder,
            source: treeNode
        };

        if (treeNode.children && treeNode.children.constructor == Array) {

            result.children = [];
            result.loaded = true;

            for (let index = 0; index < (<Array<TreeNode>>treeNode.children).length; index++) {
                const element = (<Array<TreeNode>>treeNode.children)[index];
                result.children.push(this.convertViewModel(element, level));
            }
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
}

//树节点的控制器
class $TreeNodeController {

    static $inject: Array<string> = ['$scope'];
    constructor(
        private $scope: ITreeNodeControlScope,
    ) {

        $scope.expand = () => {

            $scope.item.open = !$scope.item.open;

            if (!$scope.item.loaded && $scope.item.type == TreeNodeType.folder) {

                this.internalRenderChildren($scope);
            }
        }

        if ($scope.item.open && $scope.item.type == TreeNodeType.folder) {

            this.internalRenderChildren($scope);
        }
    }

    private internalRenderChildren($scope: ITreeNodeControlScope) {

        $scope.rootController.loadChildrenTreeNode($scope.item).then(data => {

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

var module = angular.module('mcs.contols.tree', ['mcs.controls.templates'])
module.directive('mcsTree', $TreeControlDirective.factory())