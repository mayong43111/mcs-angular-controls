namespace mcscontrols {

    class $LoadingService {

        private template?: JQLite;
        private count: number;

        private initLoading(): void {

            this.template = angular.element(<string>this.$templateCache.get('templates/mcs.loading.html'));
            angular.element(document).find('body').append(this.template);

            this.template.addClass('hidden');
        }

        public static $inject: Array<string> = ['$rootScope', '$templateCache'];
        constructor(
            private $rootScope: ng.IScope,
            private $templateCache: ng.ITemplateCacheService
        ) {
            this.initLoading();
            this.count = 0;
        }

        start(): void {

            this.count++;
            if (this.template) {
                this.template.removeClass('hidden');
            }
        }

        stop(): void {

            this.count--;

            if (this.template && this.count <= 0) {

                this.template.addClass('hidden');
            }
        }
    }

    const loadingService = angular.module('mcs.controls.loading', ['mcs.controls.templates']);
    loadingService.service('loadingService', $LoadingService);
    loadingService.run(['loadingService', '$rootScope', function (loadingService: $LoadingService, $rootScope: ng.IScope) {

        $rootScope.$on('HTTP_REQUEST_START', function (event: ng.IAngularEvent) {

            loadingService.start();
        });

        $rootScope.$on('HTTP_REQUEST_STOP', function (event: ng.IAngularEvent) {

            loadingService.stop();
        });
    }]);

    class httpLoadingInterceptor implements ng.IHttpInterceptor {

        static factory(): ng.IHttpInterceptorFactory {

            const directive = (a: any, b: any) => new httpLoadingInterceptor(a, b);
            directive.$inject = ['$q', '$rootScope'];
            return directive;
        }

        constructor(private $q: ng.IQService, private $rootScope: ng.IRootScopeService) {
        }

        request = (config: any) => {

            if (config && config.data && config.data.$autoLoading) {
                this.$rootScope.$broadcast('HTTP_REQUEST_START');
            }
            return config;
        };

        requestError = (err: any) => {

            this.$rootScope.$broadcast('HTTP_REQUEST_STOP');
            return this.$q.reject(err);
        };

        response = (res: any) => {

            if (res.config && res.config.data && res.config.data.$autoLoading) {
                this.$rootScope.$broadcast('HTTP_REQUEST_STOP');
            }
            return res;
        };

        responseError = (err: any) => {

            this.$rootScope.$broadcast('HTTP_REQUEST_STOP');
            return this.$q.reject(err);
        }
    }

    loadingService.config(['$httpProvider', function ($httpProvider: ng.IHttpProvider) {

        $httpProvider.interceptors.push(httpLoadingInterceptor.factory());
    }]);
}