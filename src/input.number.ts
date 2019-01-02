namespace mcscontrols {
    class $NumberControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $NumberControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor() {
        }

        templateUrl = 'templates/mcs.input.number.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            unit: '=',
            precision: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', ($scope: any) => {

            $scope.setValue = (newValue: string | number) => {

                newValue = this.removeComma(newValue);

                if (newValue) {

                    newValue = Number(newValue);

                    if ($scope.precision && Number($scope.precision) > 0) {

                        newValue = newValue.toFixed(Number($scope.precision));
                    }
                }

                $scope.bindingValue = newValue;
                $scope.bindingText = this.addComma($scope.bindingValue);
            };

            $scope.keyup = () => {

                $scope.bindingText = $scope.bindingText.replace(/[^\d+-\.]/g, '')
            };

            $scope.$watch('bindingValue', (newValue: any, oldValue: any, scope: any) => {

                scope.setValue(newValue);
            });
        }];

        link = (
            scope: any,
            instanceElement: JQLite,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {
        };

        private addComma = function (number: number) {
            if (number === 0) return 0;
            var num = number + '';
            num = num.replace(new RegExp(',', 'g'), '');
            // 正负号处理   
            var symble = '';
            if (/^([-+]).*$/.test(num)) {
                symble = num.replace(/^([-+]).*$/, '$1');
                num = num.replace(/^([-+])(.*)$/, '$2');
            }

            if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
                num = num.replace(new RegExp('^[0]+', 'g'), '');
                if (/^\./.test(num)) {
                    num = '0' + num;
                }

                var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, '$1');
                var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, '$1');

                var re = /(\d+)(\d{3})/;

                while (re.test(integer)) {
                    integer = integer.replace(re, '$1,$2');
                }
                return symble + integer + decimal;

            } else {
                return number;
            }
        };

        private removeComma = function (number: string | number) {

            var num = number + '';
            num = num.replace(new RegExp(',', 'g'), '');
            if (/^[-+]?[0-9]+(\.[0-9]+)?$/.test(num)) {
                return num;
            } else {
                return number;
            }
        };
    }

    var inputNumber = angular.module('mcs.controls.input.number', ['mcs.controls.templates']);
    inputNumber.directive('mcsInputNumber', $NumberControlDirective.factory());
}