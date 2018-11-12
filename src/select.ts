class $SelectControlDirective implements ng.IDirective {

    static factory(): ng.IDirectiveFactory {

        const directive = () => new $SelectControlDirective();
        //directive.$inject = [];
        return directive;
    }

    constructor() {
    }

    templateUrl = 'templates/mcs.select.html';
    restrict = 'A';
    replace = true;
    scope = {
        bindingValue: '=',
        bindingText: '=?',
        bindingOptions: '=',
        readonly: '=?mcsReadonly'
    };

    controller = ['$scope', function ($scope: any) {



        let initialize = function (scope: any): void {

            scope.bindingValue = scope.bindingValue || '';

            if (scope.readonly) return;

            scope.internalOptions = [];
            scope.internalOptions.push({ value: '', text: '请选择...' });

            if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {

                var hasValue = false;

                for (let index = 0; index < scope.bindingOptions.length; index++) {

                    const element = scope.bindingOptions[index];
                    scope.internalOptions.push(angular.copy(element));

                    if (element.value == scope.bindingValue) {
                        hasValue = true;
                    }
                }

                if (!hasValue) {
                    scope.bindingValue = '';
                }

            } else if (scope.bindingValue) {

                scope.internalOptions.push({
                    value: scope.bindingValue,
                    text: scope.bindingText || scope.bindingValue
                });
            }
        }

        $scope.$watch('readonly', function () { initialize($scope); }, true);
        $scope.$watch('bindingOptions', function () { initialize($scope); }, true);
        $scope.$watch('bindingValue', function (newValue: any, oldValue: any, scope: any) {

            scope.bindingText = undefined;

            if (newValue && scope.internalOptions && scope.internalOptions.length > 0) {

                for (let index = 0; index < scope.internalOptions.length; index++) {
                    const element = scope.internalOptions[index];

                    if (element.value == scope.bindingValue) {
                        scope.bindingText = element.text;
                        break;
                    }
                }
            }
        });
    }];
}

var module = angular.module('mcs.contols.select', ['mcs.controls.templates'])
module.directive('mcsSelect', $SelectControlDirective.factory())