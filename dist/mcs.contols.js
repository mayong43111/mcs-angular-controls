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
    'mcs.contols.radiolist'
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

//# sourceMappingURL=mcs.contols.js.map
