"use strict";
var $CheckboxListControlDirective = /** @class */ (function () {
    function $CheckboxListControlDirective() {
        this.templateUrl = 'templates/mcs.checkbox.list.html';
        this.restrict = 'A';
        this.replace = true;
        this.scope = {
            bindingValue: '=',
            bindingOptions: '=',
            readonly: '=?mcsReadonly'
        };
        this.controller = ['$scope', function ($scope) {
                var initializeOptions = function (scope) {
                    scope.internalOptions = [];
                    if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {
                        for (var index = 0; index < scope.bindingOptions.length; index++) {
                            var element = angular.copy(scope.bindingOptions[index]);
                            element.text = element.text || element.value;
                            scope.internalOptions.push(element);
                        }
                    }
                    initializebindingValue(scope.bindingValue); // 就是为了触发重新绑定，其实
                };
                var hasValue = function (options, option) {
                    for (var index = 0; index < options.length; index++) {
                        var element = options[index];
                        if (option.value == element.value) {
                            return true;
                        }
                    }
                    return false;
                };
                var initializebindingValue = function (newValue) {
                    for (var index = 0; index < $scope.internalOptions.length; index++) {
                        var element = $scope.internalOptions[index];
                        element.selected = hasValue(newValue, element);
                    }
                    for (var index = 0; index < newValue.length; index++) {
                        var element = newValue[index];
                        if (!hasValue($scope.internalOptions, element)) {
                            if (!$scope.readonly) {
                                newValue.splice(index, 1);
                                index--;
                            }
                            else {
                                var newOption = angular.copy(element);
                                newOption.selected = true;
                                $scope.internalOptions.push(newOption);
                            }
                        }
                    }
                };
                $scope.$watch('bindingOptions', function () { initializeOptions($scope); }, true);
                $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                    if (!newValue || newValue.constructor != Array) {
                        newValue = [];
                    }
                    initializebindingValue(newValue);
                }, true);
                $scope.toggle = function (option) {
                    if (option.selected) {
                        for (var index = 0; index < $scope.bindingValue.length; index++) {
                            var element = $scope.bindingValue[index];
                            if (element.value == option.value) {
                                $scope.bindingValue.splice(index, 1);
                                return;
                            }
                        }
                    }
                    else {
                        $scope.bindingValue.push({
                            value: option.value,
                            text: option.text
                        });
                    }
                };
            }];
    }
    $CheckboxListControlDirective.factory = function () {
        var directive = function () { return new $CheckboxListControlDirective(); };
        //directive.$inject = [];
        return directive;
    };
    return $CheckboxListControlDirective;
}());
var module = angular.module('mcs.contols.checkboxlist', ['mcs.controls.templates']);
module.directive('mcsCheckboxList', $CheckboxListControlDirective.factory());

"use strict";
var module = angular.module('mcs.contols', [
    'mcs.controls.templates',
    'mcs.contols.input.text',
    'mcs.contols.select',
    'mcs.contols.input.checkbox',
    'mcs.contols.checkboxlist',
    'mcs.contols.radiolist',
    'mcs.contols.toastr',
    'mcs.contols.tree'
]);

"use strict";
var $CheckboxControlDirective = /** @class */ (function () {
    function $CheckboxControlDirective() {
        this.templateUrl = 'templates/mcs.input.checkbox.html';
        this.restrict = 'A';
        this.replace = true;
        this.scope = {
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };
        this.controller = ['$scope', function ($scope) {
                if (typeof ($scope.bindingValue) == 'undefined') {
                    $scope.bindingValue = false;
                }
                if ($scope.bindingValue.constructor == String) {
                    $scope.bindingValue = $scope.bindingValue == 'true' ? true : false;
                }
                ;
                if ($scope.bindingValue.constructor == Number) {
                    $scope.bindingValue = $scope.bindingValue > 0 ? true : false;
                }
                ;
                if ($scope.bindingValue && $scope.bindingValue.constructor != Boolean) {
                    $scope = Boolean($scope.bindingValue);
                }
            }];
    }
    $CheckboxControlDirective.factory = function () {
        var directive = function () { return new $CheckboxControlDirective(); };
        //directive.$inject = [];
        return directive;
    };
    return $CheckboxControlDirective;
}());
var module = angular.module('mcs.contols.input.checkbox', ['mcs.controls.templates']);
module.directive('mcsInputCheckbox', $CheckboxControlDirective.factory());

"use strict";
var $TextControlDirective = /** @class */ (function () {
    function $TextControlDirective() {
        this.templateUrl = 'templates/mcs.input.text.html';
        this.restrict = 'A';
        this.replace = true;
        this.scope = {
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };
        this.controller = ['$scope', function ($scope) {
            }];
    }
    $TextControlDirective.factory = function () {
        var directive = function () { return new $TextControlDirective(); };
        //directive.$inject = [];
        return directive;
    };
    return $TextControlDirective;
}());
var module = angular.module('mcs.contols.input.text', ['mcs.controls.templates']);
module.directive('mcsInputText', $TextControlDirective.factory());

"use strict";
var $RadiokboxListControlDirective = /** @class */ (function () {
    function $RadiokboxListControlDirective() {
        this.templateUrl = 'templates/mcs.radio.list.html';
        this.restrict = 'A';
        this.replace = true;
        this.scope = {
            bindingValue: '=',
            bindingText: '=?',
            bindingOptions: '=',
            readonly: '=?mcsReadonly'
        };
        this.controller = ['$scope', function ($scope) {
                var initializeOptions = function (scope) {
                    scope.internalOptions = [];
                    if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {
                        for (var index = 0; index < scope.bindingOptions.length; index++) {
                            var element = angular.copy(scope.bindingOptions[index]);
                            element.text = element.text || element.value;
                            scope.internalOptions.push(element);
                        }
                    }
                    initializebindingValue(scope.bindingValue); // 就是为了触发重新绑定，其实
                };
                var hasValue = function (option, value) {
                    return value == option.value;
                };
                var initializebindingValue = function (newValue) {
                    var haslOption = false;
                    for (var index = 0; index < $scope.internalOptions.length; index++) {
                        var element = $scope.internalOptions[index];
                        element.selected = hasValue(element, newValue);
                        if (element.selected) {
                            haslOption = true;
                        }
                    }
                    if (!haslOption) {
                        if (!$scope.readonly) {
                            $scope.bindingValue = undefined;
                        }
                        else if (typeof ($scope.bindingValue) != 'undefined') {
                            $scope.internalOptions.push({
                                value: $scope.bindingValue,
                                text: $scope.bindingText || $scope.bindingValue
                            });
                        }
                    }
                };
                $scope.$watch('bindingOptions', function () { initializeOptions($scope); }, true);
                $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                    scope.bindingText = undefined;
                    if (newValue && scope.internalOptions && scope.internalOptions.length > 0) {
                        for (var index = 0; index < scope.internalOptions.length; index++) {
                            var element = scope.internalOptions[index];
                            if (element.value == scope.bindingValue) {
                                scope.bindingText = element.text;
                                break;
                            }
                        }
                    }
                    initializebindingValue(newValue);
                }, true);
            }];
    }
    $RadiokboxListControlDirective.factory = function () {
        var directive = function () { return new $RadiokboxListControlDirective(); };
        //directive.$inject = [];
        return directive;
    };
    return $RadiokboxListControlDirective;
}());
var module = angular.module('mcs.contols.radiolist', ['mcs.controls.templates']);
module.directive('mcsRadioList', $RadiokboxListControlDirective.factory());

"use strict";
var $SelectControlDirective = /** @class */ (function () {
    function $SelectControlDirective() {
        this.templateUrl = 'templates/mcs.select.html';
        this.restrict = 'A';
        this.replace = true;
        this.scope = {
            bindingValue: '=',
            bindingText: '=?',
            bindingOptions: '=',
            readonly: '=?mcsReadonly'
        };
        this.controller = ['$scope', function ($scope) {
                var initialize = function (scope) {
                    scope.bindingValue = scope.bindingValue || '';
                    if (scope.readonly)
                        return;
                    scope.internalOptions = [];
                    scope.internalOptions.push({ value: '', text: '请选择...' });
                    if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {
                        var hasValue = false;
                        for (var index = 0; index < scope.bindingOptions.length; index++) {
                            var element = scope.bindingOptions[index];
                            scope.internalOptions.push(angular.copy(element));
                            if (element.value == scope.bindingValue) {
                                hasValue = true;
                            }
                        }
                        if (!hasValue) {
                            scope.bindingValue = '';
                        }
                    }
                    else if (scope.bindingValue) {
                        scope.internalOptions.push({
                            value: scope.bindingValue,
                            text: scope.bindingText || scope.bindingValue
                        });
                    }
                };
                $scope.$watch('readonly', function () { initialize($scope); }, true);
                $scope.$watch('bindingOptions', function () { initialize($scope); }, true);
                $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                    scope.bindingText = undefined;
                    if (newValue && scope.internalOptions && scope.internalOptions.length > 0) {
                        for (var index = 0; index < scope.internalOptions.length; index++) {
                            var element = scope.internalOptions[index];
                            if (element.value == scope.bindingValue) {
                                scope.bindingText = element.text;
                                break;
                            }
                        }
                    }
                });
            }];
    }
    $SelectControlDirective.factory = function () {
        var directive = function () { return new $SelectControlDirective(); };
        //directive.$inject = [];
        return directive;
    };
    return $SelectControlDirective;
}());
var module = angular.module('mcs.contols.select', ['mcs.controls.templates']);
module.directive('mcsSelect', $SelectControlDirective.factory());

"use strict";
var ToastrLevel;
(function (ToastrLevel) {
    ToastrLevel[ToastrLevel["Info"] = 0] = "Info";
    ToastrLevel[ToastrLevel["Success"] = 1] = "Success";
    ToastrLevel[ToastrLevel["Warning"] = 2] = "Warning";
    ToastrLevel[ToastrLevel["Error"] = 3] = "Error";
})(ToastrLevel || (ToastrLevel = {}));
var $ToastrService = /** @class */ (function () {
    function $ToastrService($templateCache, $compile, $rootScope) {
        this.interval = 10;
        var template = $templateCache.get('templates/mcs.toast.html');
        if (!template)
            throw 'must need templates/mcs.toast.html';
        this.toastrScope = $rootScope.$new();
        this.toastrScope.messages = [];
        this.toastrScope.setRemainingTimeZero = function (message) {
            message.remainingTime = 0;
        };
        var clonedElement = $compile(angular.element(template))(this.toastrScope);
        angular.element(document).find('body').append(clonedElement);
    }
    $ToastrService.prototype.send = function (content, title, level, timeOut) {
        var _this = this;
        if (!content)
            return;
        level = level || ToastrLevel.Info;
        timeOut = timeOut || 5000;
        var newToastrMessage = {
            title: title || this.getDefautTitle(level),
            content: content,
            remaining: this.getRemaining(timeOut, timeOut),
            remainingTime: timeOut,
            timeOut: timeOut,
            className: this.getClassName(level),
        };
        this.toastrScope.messages.push(newToastrMessage);
        if (!this.intervalID)
            this.intervalID = window.setInterval(function () { return _this.innerTimerHandler(); }, this.interval);
    };
    $ToastrService.prototype.innerTimerHandler = function () {
        var messages = this.toastrScope.messages;
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            message.remainingTime -= this.interval;
            message.remaining = this.getRemaining(message.remainingTime, message.timeOut);
            if (message.remainingTime <= 0) {
                messages.splice(i, 1);
                return this.innerTimerHandler();
            }
        }
        if (messages.length == 0) {
            window.clearInterval(this.intervalID);
            this.intervalID = undefined;
        }
        this.toastrScope.$apply();
    };
    $ToastrService.prototype.getRemaining = function (remainingTime, timeOut) {
        if (remainingTime < 0)
            return '0';
        return ((remainingTime / timeOut) * 100) + '%';
    };
    $ToastrService.prototype.getDefautTitle = function (level) {
        switch (level) {
            case ToastrLevel.Success:
                return 'Success';
            case ToastrLevel.Warning:
                return 'Warning';
            case ToastrLevel.Error:
                return 'Error';
            default:
                return 'Info';
        }
    };
    $ToastrService.prototype.getClassName = function (level) {
        switch (level) {
            case ToastrLevel.Success:
                return 'success';
            case ToastrLevel.Warning:
                return 'warning';
            case ToastrLevel.Error:
                return 'error';
            default:
                return 'info';
        }
    };
    $ToastrService.$inject = ['$templateCache', '$compile', '$rootScope'];
    return $ToastrService;
}());
var modMain = angular.module('mcs.contols.toastr', ['mcs.controls.templates']);
modMain.service('toastrService', $ToastrService);

"use strict";
//树节点的类型
var TreeNodeType;
(function (TreeNodeType) {
    TreeNodeType[TreeNodeType["folder"] = 0] = "folder";
    TreeNodeType[TreeNodeType["file"] = 1] = "file";
    TreeNodeType[TreeNodeType["user"] = 2] = "user";
})(TreeNodeType || (TreeNodeType = {}));
//树控件的控制器
var $TreeControlController = /** @class */ (function () {
    function $TreeControlController($scope, $q, $templateCache, $compile, $controller) {
        var _this = this;
        this.$scope = $scope;
        this.$q = $q;
        this.$templateCache = $templateCache;
        this.$compile = $compile;
        this.$controller = $controller;
        if (!$scope.optionsName)
            throw 'must need options.';
        $scope.options = $scope.$parent.$eval($scope.optionsName);
        if (!$scope.options)
            throw 'must need options.';
        this.options = $scope.options;
        this.loadRootNode().then(function (data) {
            _this.renderTreeNode($scope.rootContainer, $scope, data);
        });
    }
    $TreeControlController.prototype.renderTreeNode = function (container, $parentScope, data) {
        var template = angular.element(this.$templateCache.get('templates/mcs.tree.node.html'));
        var newScope = $parentScope.$new();
        newScope.rootController = this;
        newScope.item = data;
        newScope.nodeContainer = template.find('.node-container');
        this.$controller($TreeNodeController, { $scope: newScope });
        var clonedElement = this.$compile(template)(newScope);
        container.append(clonedElement);
    };
    //加载根节点
    $TreeControlController.prototype.loadRootNode = function () {
        var defer = this.$q.defer();
        if (this.$scope.data) {
            defer.resolve(this.convertViewModel(this.options.data, 0));
        }
        else if (this.options.data) {
            this.options.data.open = this.options.data.children != null; //根节点需要展开
            this.$scope.data = this.convertViewModel(this.options.data, 0);
            defer.resolve(this.$scope.data);
        }
        return defer.promise;
    };
    $TreeControlController.prototype.loadChildrenTreeNode = function (treeNode) {
        var _this = this;
        var defer = this.$q.defer();
        if (treeNode.children) {
            defer.resolve(treeNode.children);
        }
        else if (this.options.adapter && this.options.adapter.loadChildren) {
            var loadChildren = this.options.adapter.loadChildren(treeNode.source.id);
            if (this.isIPromise(loadChildren)) {
                loadChildren.then(function (data) {
                    data = data || [];
                    var children = _this.convertViewModels(data, treeNode.level);
                    treeNode.children = children;
                    treeNode.loaded = true;
                    defer.resolve(treeNode.children);
                });
            }
            else {
                var children = this.convertViewModels(loadChildren, treeNode.level);
                treeNode.children = children;
                treeNode.loaded = true;
                defer.resolve(treeNode.children);
            }
        }
        return defer.promise;
    };
    $TreeControlController.prototype.isIPromise = function (source) {
        return source && typeof (source.then) != 'undefined';
    };
    $TreeControlController.prototype.convertViewModels = function (treeNodes, level) {
        var result = [];
        for (var index = 0; index < treeNodes.length; index++) {
            var element = treeNodes[index];
            result.push(this.convertViewModel(element, level));
        }
        return result;
    };
    //把数据源转换为视图模型
    $TreeControlController.prototype.convertViewModel = function (treeNode, level) {
        level++;
        var result = {
            level: level,
            open: treeNode.open || false,
            loaded: false,
            type: treeNode.type || TreeNodeType.folder,
            source: treeNode
        };
        if (treeNode.children && treeNode.children.constructor == Array) {
            result.children = [];
            result.loaded = true;
            for (var index = 0; index < treeNode.children.length; index++) {
                var element = treeNode.children[index];
                result.children.push(this.convertViewModel(element, level));
            }
        }
        return result;
    };
    $TreeControlController.$inject = ['$scope', '$q', '$templateCache', '$compile', '$controller'];
    return $TreeControlController;
}());
//树节点的控制器
var $TreeNodeController = /** @class */ (function () {
    function $TreeNodeController($scope) {
        var _this = this;
        this.$scope = $scope;
        $scope.expand = function () {
            $scope.item.open = !$scope.item.open;
            if (!$scope.item.loaded && $scope.item.type == TreeNodeType.folder) {
                _this.internalRenderChildren($scope);
            }
        };
        if ($scope.item.open && $scope.item.type == TreeNodeType.folder) {
            this.internalRenderChildren($scope);
        }
    }
    $TreeNodeController.prototype.internalRenderChildren = function ($scope) {
        $scope.rootController.loadChildrenTreeNode($scope.item).then(function (data) {
            for (var index = 0; index < data.length; index++) {
                var element = data[index];
                $scope.rootController.renderTreeNode($scope.nodeContainer, $scope, element);
            }
        });
    };
    $TreeNodeController.$inject = ['$scope'];
    return $TreeNodeController;
}());
//Directive 的定义
var $TreeControlDirective = /** @class */ (function () {
    function $TreeControlDirective() {
        this.templateUrl = 'templates/mcs.tree.html';
        this.restrict = 'A';
        this.scope = {
            optionsName: '@mcsTree',
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };
        this.controller = $TreeControlController;
        this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
            scope.rootContainer = instanceElement.find('.ztree');
        };
    }
    $TreeControlDirective.factory = function () {
        var directive = function () { return new $TreeControlDirective(); };
        //directive.$inject = [];
        return directive;
    };
    return $TreeControlDirective;
}());
var module = angular.module('mcs.contols.tree', ['mcs.controls.templates']);
module.directive('mcsTree', $TreeControlDirective.factory());

//# sourceMappingURL=mcs.contols.js.map
