namespace mcscontrols {
    class $DateControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $DateControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor() {
        }

        templateUrl = 'templates/mcs.input.date.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            bindingOptions: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', function ($scope: any) {

            let defaultOptions = {
                format: "yyyy-mm-dd",
                readonlyFormat: "yyyy-MM-dd",
                autoclose: true,
                todayBtn: 'linked',
                todayHighlight: 'true',
                minView: 2,
                language: 'zh-CN'
            }

            $scope.options = angular.extend({}, defaultOptions, $scope.bindingOptions);
        }];

        link = (
            scope: any,
            instanceElement: any,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {

            var datetimepicker: any;

            scope.$watch('bindingValue', function (newValue: any, oldValue: any) {

                if (datetimepicker) {
                    datetimepicker.datetimepicker('update', newValue);
                }
            });

            scope.$watch('readonly', function (newValue: any, oldValue: any) {

                if (newValue) {

                    if (datetimepicker) {
                        datetimepicker.datetimepicker('remove'); //TODO: 没生效
                    }
                } else {

                    datetimepicker = instanceElement.find('.form_datetime')
                        .datetimepicker(scope.options)
                        .on('changeDate', function (event: any) {
                            scope.$apply(function () {
                                scope.bindingValue = event.date;
                            });
                        });

                    datetimepicker.datetimepicker('update', scope.bindingValue);
                }
            });
        };
    }

    var inputDate = angular.module('mcs.contols.input.date', ['mcs.controls.templates']);
    inputDate.directive('mcsInputDate', $DateControlDirective.factory());
}