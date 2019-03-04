namespace mcscontrols {
    class $DateControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = (a: any) => new $DateControlDirective(a);
            directive.$inject = ['$ocLazyLoad'];
            return directive;
        }

        constructor(private $ocLazyLoad: any, ) {
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

            $scope.$watch('bindingValue', function (newValue: any, oldValue: any) {

                if ($scope.datetimepicker) {
                    $scope.datetimepicker.datetimepicker('update', newValue);
                }
            });
        }];

        link = (
            scope: any,
            instanceElement: any,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {

            this.$ocLazyLoad.load(['datetimepicker']).then(() => {

                scope.datetimepicker = instanceElement.find('.form_datetime')
                    .datetimepicker(scope.options)
                    .on('changeDate', function (event: any) {
                        scope.$apply(function () {
                            scope.bindingValue = event.date;
                        });
                    });

                scope.datetimepicker.datetimepicker('update', scope.bindingValue);
            });
        }
    };

    var inputDate = angular.module('mcs.controls.input.date', ['oc.lazyLoad', 'mcs.controls.templates']);
    inputDate.directive('mcsInputDate', $DateControlDirective.factory());
}