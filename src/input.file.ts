namespace mcscontrols {

    declare var WebUploader: any;

    enum FileStatus {
        /// <summary>
        /// 未修改
        /// </summary>
        Unmodified = 0,

        /// <summary>
        /// 新增加
        /// </summary>
        Inserted = 1,

        /// <summary>
        /// 已修改
        /// </summary>
        Updated = 2,

        /// <summary>
        /// 已删除
        /// </summary>
        Deleted = 3,

        /// <summary>
        /// 已上传（客户端）
        /// </summary>
        Uploaded = 99
    }

    class FileController {

        //当前附件控件的状态 pedding, ready, uploading, confirm, done.
        private currentState: string;
        private uploader: any;

        private setState = (val: any) => {
            var file, stats;

            if (val === this.currentState) {
                return;
            }

            this.currentState = val;

            switch (this.currentState) {
                case 'pedding':
                    this.uploader.refresh();
                    break;

                case 'ready':
                    this.uploader.refresh();
                    break;

                case 'uploading':
                    break;

                case 'paused':
                    break;

                case 'confirm':
                    stats = this.uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        this.setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats = this.uploader.getStats();
                    if (stats.successNum) {
                    } else {
                        // 没有成功
                        this.currentState = 'done';
                    }
                    break;
            }
        }

        // 当有文件添加进来时执行，负责view的创建, 要区分已有的文件和新增的文件
        private addFile = (file: any) => {

            var pfile: any = { id: file.id, name: file.name, status: null };

            this.$scope.$apply(function (scope: any) {

                //需要捏造一个新对象，不能直接用uploader的file，因为从服务器下来的附件无法还原成file
                scope.files.push(pfile);
            });

            let showError = (code: string) => {

                var message: String;

                switch (code) {
                    case 'exceed_size':
                        message = '文件大小超出';
                        break;

                    case 'interrupt':
                        message = '上传暂停';
                        break;

                    default:
                        message = '上传失败，请重试';
                        break;
                }

                this.$scope.$apply(function (scope: any) {

                    pfile.isError = true;
                    pfile.errorMessage = message;
                });
            };

            let showCompleted = () => {

                this.$scope.$apply(function (scope: any) {
                    pfile.status = FileStatus.Uploaded;
                });
            };

            file.on('statuschange', function (cur: any, prev: any) {

                if (cur === 'error' || cur === 'invalid') {
                    console.log(file.statusText);
                    showError(file.statusText);
                    // percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur == 'complete') {
                    showCompleted();
                }
            });
        }

        // 负责文件的销毁, 要区分已有的文件和新增的文件
        private removeFile = (file: any) => {

            for (var i = 0; i < this.$scope.files.length; i++) {

                var element = this.$scope.files[i];

                if (element.id == file.id) {

                    this.$scope.files.splice(i, 1);
                    break;
                }
            }

            if (!file.status || file.status == FileStatus.Uploaded) {
                this.uploader.removeFile(file.id);
            }

            this.$scope.fileCount--;
            if (!file.status) {
                this.$scope.waitCount--;
            }

            //消除scope.data.value中的值
            for (let index = 0; index < this.$scope.data.value.length; index++) {
                const element = this.$scope.data.value[index];

                if (element.id == file.id || element.clientID == file.id) {
                    element.status = FileStatus.Deleted;
                    break;
                }
            }
        }

        private upload = () => {

            switch (this.currentState) {
                case 'ready':
                    this.uploader.upload();
                    break;
                case 'paused':
                    this.uploader.upload();
                    break;
                case 'uploading':
                    this.uploader.stop();
                    break;

            }
        }

        private initializeUploader = () => {

            var uploaderOptions = angular.extend(
                {},
                {
                    paste: document.body,
                    disableGlobalDnd: true,
                    fileNumLimit: 300,
                },
                this.$scope.data.options.webuploader,
                {
                    server: this.$scope.data.options.uploadUrl,
                    swf: this.configurationBroker.getAppSetting('uploader.swfUrl'),
                    pick: {
                        id: this.$scope.container.find('.filePicker'),
                        label: '点击选择附件'
                    },
                    dnd: this.$scope.container.find('.queueList')
                }
            );

            this.$scope.fileNumLimit = uploaderOptions.fileNumLimit;

            this.uploader = WebUploader.create(uploaderOptions);

            // 添加“添加文件”的按钮，
            this.uploader.addButton({
                id: this.$scope.container.find('.filePicker2'),
                label: '继续添加'
            });

            this.uploader.onFileQueued = (file: any) => {

                this.$scope.$apply(function (scope: any) {

                    scope.fileCount++;
                    scope.waitCount++;
                    scope.fileSize += file.size;
                });

                this.addFile(file);
                this.setState('ready');
            };

            this.uploader.onFileDequeued = (file: any) => {

                // this.$scope.fileCount--;
                // this.$scope.waitCount--;
                // this.$scope.fileSize -= file.size;
            };

            this.uploader.onUploadSuccess = (file: any, data: any) => {

                this.$scope.$apply(function (scope: any) {
                    scope.waitCount--;
                    data[0].clientID = file.id;
                    scope.data.value.push(data[0]);
                });
            };

            this.uploader.onUploadProgress = (file: any, percentage: number) => {

                this.$scope.$apply(function (scope: any) {

                    if (percentage == 1) {
                        scope.progress = null;
                    } else {
                        percentage = Number(percentage.toFixed(2));
                        scope.progress = percentage * 100 + '%';
                    }
                });
            };

            this.uploader.onAll = (type: any) => {

                switch (type) {
                    case 'uploadFinished':
                        this.setState('confirm');
                        break;

                    case 'startUpload':
                        this.setState('uploading');
                        break;

                    case 'stopUpload':
                        this.setState('paused');
                        break;
                }
            };

            this.uploader.onError = (code: any) => {
                this.toastrService.send('Eroor: ' + code, '出错了 :(', 3)
            };

            this.uploader.onUploadBeforeSend = this.mcsUploader.getInterceptor();
        }

        static $inject = ['$scope', '$timeout', 'toastrService', 'configurationBroker', '$ocLazyLoad', 'mcsUploader'];

        constructor(
            private $scope: any,
            private $timeout: ng.ITimeoutService,
            private toastrService: any,
            private configurationBroker: any,
            private $ocLazyLoad: any,
            private mcsUploader: $UploaderService) {

            this.currentState = 'pedding';

            var closedFunc = $scope.closed;
            $scope.closed = () => {

                if (this.uploader) this.uploader.destroy();
                closedFunc();
            }

            var submittedFunc = $scope.submitted;
            $scope.submitted = (data: any) => {

                if (this.uploader) this.uploader.destroy();
                submittedFunc(data);
            }

            $scope.files = [];

            if ($scope.data && $scope.data.value) {

                for (let index = 0; index < $scope.data.value.length; index++) {

                    const element = $scope.data.value[index];

                    if (element.status == FileStatus.Deleted) {
                        continue;
                    }

                    var pfile: any = { id: element.id, name: element.originalName, status: element.status };
                    $scope.files.push(pfile);
                }
            }

            $scope.fileCount = $scope.files.length;
            $scope.waitCount = 0;// 添加的文件数量（未上传的，上传后会减掉）
            // 添加的文件总大小
            $scope.fileSize = 0;

            $scope.removeFile = this.removeFile;
            $scope.upload = this.upload;

            $ocLazyLoad.load(['webuploader-load']).then(() => this.initializeUploader());
        }
    }

    class $FileControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $FileControlDirective();
            //directive.$inject = [];
            return directive;
        }

        private defaultOptions = {
        };

        constructor(
        ) {
        }

        templateUrl = 'templates/mcs.input.file.html';
        restrict = 'A';
        replace = true;
        scope = {
            bindingValue: '=',
            optionsName: '@mcsInputFile',
            readonly: '=?mcsReadonly'
        };

        controller = ['$scope', 'modalService', ($scope: any, modalService: any) => {

            var options = angular.extend({}, this.defaultOptions, $scope.$eval($scope.optionsName));

            if (!$scope.bindingValue || $scope.bindingValue.constructor !== Array) {
                $scope.bindingValue = [];
            }

            $scope.open = () => {

                modalService.open({
                    title: '附件上传...',
                    templateUrl: 'templates/mcs.input.file.modal.html',
                    data: { options: options, value: $scope.bindingValue },
                    controller: FileController
                }).then(function (data: any) {
                    $scope.bindingValue = data.value;
                });
            }

            $scope.remove = (item: any) => {
                item.status = FileStatus.Deleted;
            };
        }];
    }

    class $UploaderService {

        constructor(
            private interceptor?: (object: any, data: any, headers: any) => void
        ) {
        }

        public getInterceptor = () => {
            return this.interceptor;
        }
    }

    class $UploaderProvider implements ng.IServiceProvider {

        public interceptor?: (object: any, data: any, headers: any) => void;

        public static $inject: Array<string> = [];
        constructor() {
        }

        $get = [() => {

            return new $UploaderService(this.interceptor);
        }];
    }

    var inputTFile = angular.module('mcs.controls.input.file', ['oc.lazyLoad', 'mcs.controls.templates', 'mcs.controls.configurationBroker']);
    inputTFile.directive('mcsInputFile', $FileControlDirective.factory());
    inputTFile.provider('mcsUploader', $UploaderProvider);
}