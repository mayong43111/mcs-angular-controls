namespace mcscontrols {

    declare var UM: any;

    class $TextControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = (a: any) => new $TextControlDirective(a);
            directive.$inject = ['$ocLazyLoad'];
            return directive;
        }

        constructor(private $ocLazyLoad: any, ) {
        }

        templateUrl = 'templates/mcs.input.ueditor.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', '$sce', function ($scope: any, $sce: ng.ISCEService) {

            $scope.$watch('readonly', function (newValue: any, oldValue: any) {

                if (!$scope.ueditor) return;

                if (newValue) {
                    $scope.ueditor.setHide();
                } else {
                    $scope.ueditor.setShow();
                }
            });

            $scope.$watch('bindingValue', function (newValue: any, oldValue: any) {

                $scope.bindingHtml = $sce.trustAsHtml(newValue);

                if ($scope.ueditor && !$scope.$innerUpdateValue) {

                    $scope.ueditor.setContent($scope.bindingValue);
                }

                $scope.$innerUpdateValue = false;
            });
        }];

        link = (
            scope: any,
            instanceElement: any,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {

            this.$ocLazyLoad.load(['ueditor']).then(() => {

                let container: JQLite = instanceElement.find('.container')
                let id = 'umeditor-' +
                    Math.floor(Math.random() * 100).toString() +
                    new Date().getTime().toString();

                container.attr('id', id);
                var ueditor = UM.getEditor(id); // 也可以不生成ID，使用 render(Element containerDom)

                ueditor.ready(function () {

                    scope.ueditor = ueditor;

                    ueditor.setContent(scope.bindingValue);
                    scope.$innerUpdateValue = false;

                    if (scope.readonly) {
                        scope.ueditor.setHide();
                    } else {
                        scope.ueditor.setShow();
                    }
                });

                let updateValue = () => {

                    let content = ueditor.getContent();

                    if (scope.bindingValue != content) {

                        scope.bindingValue = content
                        scope.$innerUpdateValue = true;
                        scope.$apply();
                    }
                };

                ueditor.addListener('contentChange', updateValue);
                ueditor.addListener('blur', updateValue);
            });
        }
    }

    var inputUeditor = angular.module('mcs.controls.input.ueditor', ['oc.lazyLoad', 'mcs.controls.templates']);
    inputUeditor.directive('mcsInputUeditor', $TextControlDirective.factory());
}