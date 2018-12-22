namespace mcscontrols {
    class $TextareaControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $TextareaControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor() {
        }

        templateUrl = 'templates/mcs.input.textarea.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', function ($scope: any) {
        }];

        link = (
            scope: any,
            instanceElement: any,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {

            var textarea: any;
            var initHeight: number;

            let autoHeight = () => {

                var scrollHeight = textarea.scrollHeight + 2;
                var newHeight = initHeight > scrollHeight ? initHeight : scrollHeight;

                textarea.style.height = newHeight + 'px';
            };

            scope.$watch('readonly', function (newValue: any, oldValue: any) {

                if (newValue) {

                } else {
                    textarea = instanceElement.find('textarea')[0];
                    textarea.style['overflow-y'] = 'hidden';
                    textarea.style['word-break'] = 'break-all';
                    textarea.style['resize'] = 'vertical';
                    textarea.scrollTop = 0;
                    initHeight = textarea.scrollHeight;

                    autoHeight();
                }
            });

            scope.$watch('bindingValue', function (newValue: any, oldValue: any) {

                if (textarea) {
                    autoHeight();
                }
            });
        }
    }

    var inputText = angular.module('mcs.contols.input.textarea', ['mcs.controls.templates']);
    inputText.directive('mcsInputTextarea', $TextareaControlDirective.factory());
}