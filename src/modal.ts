namespace mcscontrols {

    interface ModalOptions {
        title?: string,
        data: any;
        size?: ModalSize,
        className?: string;
        template?: string;
        templateUrl?: string;
        controller?: any;
    }

    interface IModalScope extends ng.IScope {

        container:JQLite;
        title: string;
        data: any;
        sizeClassName: string;
        className: string;
        closed: (...args: any[]) => void;
        submitted: (...args: any[]) => void;
    }

    enum ModalSize {
        lg = 0,
        sm = 1
    }

    enum ModalLevel {
        Info = 0,
        Success = 1,
        Warning = 2,
        Error = 3
    }

    class $ModalService {

        public static $inject: Array<string> = ['$rootScope', '$compile', '$controller', '$http', '$templateCache', '$q', 'toastrService'];
        constructor(
            private $rootScope: ng.IScope,
            private $compile: ng.ICompileService,
            private $controller: ng.IControllerService,
            private $http: ng.IHttpService,
            private $templateCache: ng.ITemplateCacheService,
            private $q: ng.IQService,
            private toastrService: any
        ) {

        }

        open(options: ModalOptions): ng.IPromise<any> {

            var defer = this.$q.defer<any>();

            var template = angular.element(<string>this.$templateCache.get('templates/mcs.modal.html'));

            this.loadModalBody(options).then(body => {

                template.find('.modal-body').replaceWith(body);

                let destroy = () => {
                    clonedElement.remove();
                    newScope.$destroy();
                };

                var newScope = this.$rootScope.$new() as IModalScope;
                newScope.container = body;
                newScope.data = angular.copy(options.data);
                newScope.title = options.title || 'Info';
                newScope.sizeClassName = this.getSizeClassName(options.size);
                newScope.className = options.className || '';
                newScope.closed = () => {

                    destroy();
                    defer.notify();
                };
                newScope.submitted = (data: any) => {

                    destroy();
                    defer.resolve(data);
                };

                if (options.controller) {

                    this.$controller(options.controller, { $scope: newScope });
                }

                var clonedElement = this.$compile(template)(newScope);

                angular.element(document).find('body').append(clonedElement);
            })

            return defer.promise;
        }

        alert(content: string, title?: string, level?: ModalLevel): ng.IPromise<any> {

            return this.open({
                title: title || this.getDefautTitle(level),
                data: content,
                controller: ['$scope', function ($scope: any) { $scope.closed = $scope.submitted }],
                size: ModalSize.sm,
                className: this.getClassName(level),
                template: this.$templateCache.get('templates/mcs.modal.alert.html')
            });
        }

        confirm(content: string, title?: string, level?: ModalLevel): ng.IPromise<any> {

            return this.open({
                title: title || this.getDefautTitle(level),
                data: content,
                size: ModalSize.sm,
                className: this.getClassName(level),
                template: this.$templateCache.get('templates/mcs.modal.confirm.html')
            });
        }

        private loadModalBody(options: ModalOptions): ng.IPromise<JQLite> {

            var defer = this.$q.defer<JQLite>();

            if (options.template) {

                defer.resolve(angular.element(options.template));
            } else if (options.templateUrl) {

                var template = this.$templateCache.get(options.templateUrl);

                if (template) {

                    defer.resolve(angular.element(<string>template));
                } else {

                    this.$http.get<string>(options.templateUrl).then(

                        response => {
                            var template = response.data;
                            defer.resolve(angular.element(template));
                        },
                        reason => { this.toastrService.send('HTTP获取页面', '出错了 :(', 3) }
                    );
                }
            } else {
                throw 'must need template or templateUrl';
            }

            return defer.promise;
        }

        private getDefautTitle(level?: ModalLevel): string {

            switch (level) {

                case ModalLevel.Success:
                    return 'Success';
                case ModalLevel.Warning:
                    return 'Warning';
                case ModalLevel.Error:
                    return 'Error';
                default:
                    return 'Info';
            }
        }

        private getSizeClassName(size?: ModalSize): string {

            if (size == ModalSize.sm) {
                return 'sm';
            }

            return 'lg';
        }

        private getClassName(level?: ModalLevel): string {

            switch (level) {

                case ModalLevel.Success:
                    return 'success';
                case ModalLevel.Warning:
                    return 'warning';
                case ModalLevel.Error:
                    return 'error';
                default:
                    return 'info';
            }
        }
    }

    const modal = angular.module('mcs.controls.modal', ['mcs.controls.templates']);
    modal.service('modalService', $ModalService);
}