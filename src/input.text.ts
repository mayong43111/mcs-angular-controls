namespace mcscontrols {
    class $TextControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $TextControlDirective();
            //directive.$inject = [];
            return directive;
        }

        constructor() {
        }

        templateUrl = 'templates/mcs.input.text.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', function ($scope: any) {
        }];


    }

    var inputText = angular.module('mcs.controls.input.text', ['mcs.controls.templates']);
    inputText.directive('mcsInputText', $TextControlDirective.factory());
}