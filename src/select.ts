namespace mcscontrols {

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
                scope.internalOptions.push({ id: '', name: '请选择...' });

                if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {

                    var hasValue = false;

                    for (let index = 0; index < scope.bindingOptions.length; index++) {

                        const element = scope.bindingOptions[index];
                        if (!element) continue; //IE8

                        scope.internalOptions.push(angular.copy(element));

                        if (element.id == scope.bindingValue) {
                            hasValue = true;
                        }
                    }

                    if (!hasValue) {
                        scope.bindingValue = '';
                    }

                } else if (scope.bindingValue) {

                    scope.internalOptions.push({
                        id: scope.bindingValue,
                        name: scope.bindingText || scope.bindingValue
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

                        if (element.id == scope.bindingValue) {
                            scope.bindingText = element.name;
                            break;
                        }
                    }
                }
            });
        }];
    }

    var select = angular.module('mcs.controls.select', ['mcs.controls.templates']);
    select.directive('mcsSelect', $SelectControlDirective.factory());
}