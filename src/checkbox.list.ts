namespace mcscontrols {

    class $CheckboxListControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $CheckboxListControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor() {
        }

        templateUrl = 'templates/mcs.checkbox.list.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            bindingOptions: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', function ($scope: any) {

            let initializeOptions = function (scope: any): void {

                scope.internalOptions = [];

                if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {

                    for (let index = 0; index < scope.bindingOptions.length; index++) {

                        const element = angular.copy(scope.bindingOptions[index]);
                        element.name = element.name || element.id;

                        scope.internalOptions.push(element);
                    }
                }

                initializebindingValue(scope.bindingValue);// 就是为了触发重新绑定，其实
            }

            let hasValue = function (options: Array<any>, option: any): boolean {

                for (let index = 0; index < options.length; index++) {

                    const element = options[index];

                    if (option.id == element.id) {

                        return true;
                    }
                }

                return false;
            }

            let initializebindingValue = function (newValue: Array<any>) {

                for (let index = 0; index < $scope.internalOptions.length; index++) {

                    const element = $scope.internalOptions[index];
                    element.selected = hasValue(newValue, element);
                }

                for (let index = 0; index < newValue.length; index++) {

                    const element = newValue[index];

                    if (!hasValue($scope.internalOptions, element)) {

                        if (!$scope.readonly) {
                            newValue.splice(index, 1);
                            index--;
                        } else {
                            var newOption = angular.copy(element);
                            newOption.selected = true;
                            $scope.internalOptions.push(newOption);
                        }
                    }
                }
            }

            $scope.$watch('bindingOptions', function () { initializeOptions($scope); }, true);
            $scope.$watch('bindingValue', function (newValue: any, oldValue: any, scope: any) {

                if (!newValue || newValue.constructor != Array) {

                    newValue = [];
                }

                initializebindingValue(newValue);
            }, true);

            $scope.toggle = function (option: any) {

                if (option.selected) {

                    for (let index = 0; index < $scope.bindingValue.length; index++) {

                        const element = $scope.bindingValue[index];

                        if (element.id == option.id) {

                            $scope.bindingValue.splice(index, 1);
                            return;
                        }
                    }
                } else {
                    $scope.bindingValue.push({
                        id: option.id,
                        name: option.name
                    });
                }
            }
        }];
    }

    var checkboxlist = angular.module('mcs.controls.checkboxlist', ['mcs.controls.templates']);
    checkboxlist.directive('mcsCheckboxList', $CheckboxListControlDirective.factory());
}