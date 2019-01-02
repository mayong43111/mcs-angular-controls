namespace mcscontrols {

    interface ToastrMessage {

        className: string;
        remaining: string;
        remainingTime: number;
        timeOut: number;
        title: string;
        content: string;
    }

    interface IToastrScope extends ng.IScope {
        messages: Array<ToastrMessage>;
        setRemainingTimeZero: (message: ToastrMessage) => void;
    }

    enum ToastrLevel {
        Info = 0,
        Success = 1,
        Warning = 2,
        Error = 3
    }

    class $ToastrService {

        private toastrScope: IToastrScope;
        private intervalID?: number;
        private interval = 10;

        public static $inject: Array<string> = ['$templateCache', '$compile', '$rootScope'];
        constructor(
            $templateCache: ng.ITemplateCacheService,
            $compile: ng.ICompileService,
            $rootScope: ng.IScope
        ) {

            var template = $templateCache.get<String>('templates/mcs.toast.html');

            if (!template) throw 'must need templates/mcs.toast.html'

            this.toastrScope = $rootScope.$new() as IToastrScope;

            this.toastrScope.messages = [];
            this.toastrScope.setRemainingTimeZero = function (message: ToastrMessage) {
                message.remainingTime = 0;
            };

            var clonedElement = $compile(angular.element(<string>template))(this.toastrScope);

            angular.element(document).find('body').append(clonedElement);
        }

        send(content: string, title?: string, level?: number, timeOut?: number) {

            if (!content) return;

            level = level || ToastrLevel.Info;
            timeOut = timeOut || 5000

            var newToastrMessage: ToastrMessage = {

                title: title || this.getDefautTitle(level),
                content: content,
                remaining: this.getRemaining(timeOut, timeOut),
                remainingTime: timeOut,
                timeOut: timeOut,
                className: this.getClassName(level),
            }

            this.toastrScope.messages.push(newToastrMessage);
            if (!this.intervalID) this.intervalID = window.setInterval(() => this.innerTimerHandler(), this.interval);
        }

        private innerTimerHandler(): void {

            var messages = this.toastrScope.messages;

            for (var i = 0; i < messages.length; i++) {

                var message = messages[i];
                message.remainingTime -= this.interval;
                message.remaining = this.getRemaining(message.remainingTime, message.timeOut);

                if (message.remainingTime <= 0) {

                    messages.splice(i, 1);
                    return this.innerTimerHandler();
                }
            }

            if (messages.length == 0) {
                window.clearInterval(this.intervalID);
                this.intervalID = undefined;
            }

            this.toastrScope.$apply();
        }

        private getRemaining(remainingTime: number, timeOut: number): string {

            if (remainingTime < 0) return '0';
            return ((remainingTime / timeOut) * 100) + '%';
        }

        private getDefautTitle(level: number): string {

            switch (level) {

                case ToastrLevel.Success:
                    return 'Success';
                case ToastrLevel.Warning:
                    return 'Warning';
                case ToastrLevel.Error:
                    return 'Error';
                default:
                    return 'Info';
            }
        }

        private getClassName(level: number): string {

            switch (level) {

                case ToastrLevel.Success:
                    return 'success';
                case ToastrLevel.Warning:
                    return 'warning';
                case ToastrLevel.Error:
                    return 'error';
                default:
                    return 'info';
            }
        }
    }

    const toastr = angular.module('mcs.controls.toastr', ['mcs.controls.templates']);
    toastr.service('toastrService', $ToastrService);
}