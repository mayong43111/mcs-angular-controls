class $RadiokboxListControlDirective implements ng.IDirective {

    static factory(): ng.IDirectiveFactory {

        const directive = () => new $RadiokboxListControlDirective();
        //directive.$inject = [];
        return directive;
    }

    constructor() {
    }

    templateUrl = 'templates/mcs.radio.list.html';
    restrict = 'A';
    replace = true;
    scope = {
        bindingValue: '=',
        bindingText: '=?',
        bindingOptions: '=',
        readonly: '=?mcsReadonly'
    };

    controller = ['$scope', function ($scope: any) {

        let initializeOptions = function (scope: any): void {

            scope.internalOptions = [];

            if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {

                for (let index = 0; index < scope.bindingOptions.length; index++) {

                    const element = angular.copy(scope.bindingOptions[index]);
                    element.text = element.text || element.value;

                    scope.internalOptions.push(element);
                }
            }

            initializebindingValue(scope.bindingValue);// 就是为了触发重新绑定，其实
        }

        let hasValue = function (option: any, value: any): boolean {

            return value == option.value;
        }

        let initializebindingValue = function (newValue: Array<any>) {

            var haslOption = false;

            for (let index = 0; index < $scope.internalOptions.length; index++) {

                const element = $scope.internalOptions[index];
                element.selected = hasValue(element, newValue);

                if (element.selected) {
                    haslOption = true;
                }
            }

            if (!haslOption) {

                if (!$scope.readonly) {

                    $scope.bindingValue = undefined;
                } else if (typeof ($scope.bindingValue) != 'undefined') {

                    $scope.internalOptions.push({
                        value: $scope.bindingValue,
                        text: $scope.bindingText || $scope.bindingValue
                    });
                }
            }
        }

        $scope.$watch('bindingOptions', function () { initializeOptions($scope); }, true);
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
            initializebindingValue(newValue);
        }, true);
    }];
}

var module = angular.module('mcs.contols.radiolist', ['mcs.controls.templates'])
module.directive('mcsRadioList', $RadiokboxListControlDirective.factory())