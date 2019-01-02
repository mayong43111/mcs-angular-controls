angular.element(document).ready(function () {

    var app = angular.module('app', ['mcs.controls']);

    app.config(['configurationBrokerProvider', function (configurationBroker) {

        configurationBroker.initialize({
            'uploader.swfUrl': '/plugins/webuploader/Uploader.swf'
        });
    }]);

    app.controller('FormController', ['$scope', function ($scope) {

        $scope.formData = {};

        $scope.formData.applicationDate = new Date();
        $scope.formData.applicantCompanyName = '正荣地产有限公司';
        $scope.formData.applicantDepartmentName = '经营管理中心';

        $scope.dictionaries = {};
        $scope.dictionaries.cooperationTypes = [
            { id: '001', name: '第一种合作' },
            { id: '002', name: '第二种合作' }
        ];
    }]);

    angular.element(document).find('body').attr('ng-controller', 'FormController');
    angular.bootstrap(document, ['app']);
});