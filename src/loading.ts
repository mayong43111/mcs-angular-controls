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

            //一个诡异的问题，也没那么诡异，template的初始化在run中，时序比较晚一些，所以只好再重新来一次
            if (this.template && !this.template[0]) {
                this.initLoading();
            }

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

    class httpLoadingInterceptor implements ng.IHttpInterceptor {

        static factory(): ng.IHttpInterceptorFactory {

            const directive = (a: any, b: any) => new httpLoadingInterceptor(a, b);
            directive.$inject = ['$q', 'loadingService'];
            return directive;
        }

        constructor(private $q: ng.IQService, private loadingService: any) {
        }

        request = (config: any) => {

            this.loadingService.start();
            return config;
        };

        requestError = (err: any) => {

            this.loadingService.stop();
            return this.$q.reject(err);
        };

        response = (res: any) => {

            this.loadingService.stop();
            return res;
        };

        responseError = (err: any) => {

            this.loadingService.stop();
            return this.$q.reject(err);
        }
    }

    loadingService.config(['$httpProvider', function ($httpProvider: ng.IHttpProvider) {

        $httpProvider.interceptors.push(httpLoadingInterceptor.factory());
    }]);
}