namespace mcscontrols {
    
    class $CheckboxControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $CheckboxControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor() {
        }

        templateUrl = 'templates/mcs.input.checkbox.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', function ($scope: any) {

            if (typeof ($scope.bindingValue) == 'undefined') {
                $scope.bindingValue = false;
            }

            if ($scope.bindingValue.constructor == String) {

                $scope.bindingValue = $scope.bindingValue == 'true' ? true : false;
            };

            if ($scope.bindingValue.constructor == Number) {

                $scope.bindingValue = $scope.bindingValue > 0 ? true : false;
            };

            if ($scope.bindingValue && $scope.bindingValue.constructor != Boolean) {
                $scope = Boolean($scope.bindingValue);
            }
        }];
    }

    var checkbox = angular.module('mcs.controls.input.checkbox', ['mcs.controls.templates']);
    checkbox.directive('mcsInputCheckbox', $CheckboxControlDirective.factory());
}