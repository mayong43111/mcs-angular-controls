namespace mcscontrols {

    enum KEYS {
        ESC = 27,
        TAB = 9,
        RETURN = 13,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    };

    class $AutocompleteControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = (a: any, b: any) => new $AutocompleteControlDirective(a, b);
            directive.$inject = ['$q', '$http'];
            return directive;
        }

        constructor(
            private $q: ng.IQService,
            private $http: ng.IHttpService
        ) {
        }

        templateUrl = 'templates/mcs.autocomplete.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            bindingOptions: '=?',
            readonly: '=?mcsReadonly',
            optionsName: '@?mcsAutocomplete',
        };

        controller = ['$scope', ($scope: any) => {

            if (!$scope.bindingValue || !angular.isArray($scope.bindingValue)) {
                $scope.bindingValue = [];
            }

            if (!$scope.bindingOptions || !angular.isArray($scope.bindingOptions)) {
                $scope.bindingOptions = [];
            }
            $scope.that = { suggestions: $scope.bindingOptions };

            $scope.options = $scope.optionsName ? $scope.$parent.$eval($scope.optionsName) : {};

            $scope.$cache = {};

            $scope.onKeyUp = (e: any) => {

                if ($scope.readonly) {
                    return;
                }

                switch (e.which) {
                    case KEYS.UP:
                    case KEYS.DOWN:
                    case KEYS.LEFT:
                    case KEYS.RIGHT:
                    case KEYS.ESC:
                        return;
                }

                let currentValue = e.target.value;

                if ($scope.that && currentValue == $scope.that.currentValue) {
                    return;
                }

                if ($scope.that) {
                    clearTimeout($scope.that.onChangeTimeout);
                }

                $scope.that = { currentValue: currentValue, show: true };

                if ($scope.$cache[currentValue]) {

                    $scope.that.suggestions = $scope.$cache[currentValue];
                    return;
                }

                $scope.that.onChangeTimeout = setTimeout(() => {
                    this.onValueChange($scope.that, $scope);
                }, 1000);
            };

            $scope.onFocus = () => {

                if ($scope.that) {

                    clearTimeout($scope.that.onFocusTimeout);
                    $scope.that.onFocusTimeout = setTimeout(() => {
                        $scope.that.show = true;
                        $scope.$apply();
                    }, 200);
                }
            }

            $scope.onBlur = () => {

                if ($scope.that) {

                    clearTimeout($scope.that.onBlurTimeout);
                    $scope.that.onBlurTimeout = setTimeout(() => {
                        $scope.that.show = false;
                        $scope.$apply();
                    }, 200);
                }
            }

            $scope.selected = (item: any) => {

                $scope.bindingValue.push(item);

                $scope.tempNewValue = '';
                $scope.that = {};

                if ($scope.queryInputText) {

                    $scope.queryInputText.focus();
                    setTimeout(() => {
                        this.onValueChange($scope.that, $scope);
                        $scope.$apply();
                    }, 200);
                }
            }

            $scope.remove = (item: any) => {

                for (let index = 0; index < $scope.bindingValue.length; index++) {

                    const element = $scope.bindingValue[index];

                    if (element == item || element.id == item.id) {

                        $scope.bindingValue.splice(index, 1);
                        return;
                    }
                }
            }
        }];

        link = (
            scope: any,
            instanceElement: any,
            instanceAttributes: ng.IAttributes,
            controller?: ng.IController | ng.IController[] | { [key: string]: ng.IController },
            transclude?: ng.ITranscludeFunction
        ): void => {

            scope.queryInputText = instanceElement.find(':text');
        };

        private onValueChange(that: any, $scope: any) {

            clearTimeout(that.onChangeTimeout);

            that.loading = true;

            if (that.currentValue && $scope.options && $scope.options.async && $scope.options.async.url) {

                var params = $scope.options.async.params || {};
                params = angular.extend(params, { searchTerm: that.currentValue });

                this.$http.get($scope.options.async.url, { params: params, data: { $autoLoading: false } }).then(res => {

                    that.loading = false;
                    that.suggestions = res.data;
                    $scope.$cache[that.currentValue] = res.data;
                }, () => {
                    that.loading = false;
                })
            } else {

                this.getSuggestionsLocal(that.currentValue, $scope.bindingOptions).then(data => {

                    that.loading = false;
                    that.suggestions = data;
                    $scope.$cache[that.currentValue] = data;
                }, () => {
                    that.loading = false;
                });
            }
        }

        private getSuggestionsLocal(query: string, options: Array<any>): ng.IPromise<Array<any>> {

            var defer = this.$q.defer<Array<any>>();

            var suggestions = [];

            if (query) {

                for (let index = 0; index < options.length; index++) {
                    const element = options[index];

                    if (angular.isString(element) && element.indexOf(query) >= 0) {
                        suggestions.push(element);
                    } else if (element.name && element.name.indexOf(query) >= 0) {
                        suggestions.push(element);
                    }
                }
            } else {
                suggestions = options || [];
            }

            defer.resolve(suggestions);

            return defer.promise;
        }
    }

    var inputAutocomplete = angular.module('mcs.controls.autocomplete', ['mcs.controls.templates']);
    inputAutocomplete.directive('mcsAutocomplete', $AutocompleteControlDirective.factory());
}