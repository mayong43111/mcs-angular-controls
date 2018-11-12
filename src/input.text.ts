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

var module = angular.module('mcs.contols.input.text', ['mcs.controls.templates'])
module.directive('mcsInputText', $TextControlDirective.factory())