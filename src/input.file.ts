namespace mcscontrols {

    declare var WebUploader: any;

    class FileController {

        //当前附件控件的状态 pedding, ready, uploading, confirm, done.
        private currentState: string;
        private uploader: any;

        //更新进度条
        private updateTotalProgress = () => {

            var loaded = 0,
                total = 0,
                //spans = $progress.children(),
                percent;
            // $.each(percentages, function (k, v) {
            //     total += v[0];
            //     loaded += v[0] * v[1];
            // });

            // percent = total ? loaded / total : 0;

            // spans.eq(0).text(Math.round(percent * 100) + '%');
            // spans.eq(1).css('width', Math.round(percent * 100) + '%');
            // updateStatus();
        }

        private setState = (val: any) => {
            var file, stats;

            if (val === this.currentState) {
                return;
            }

            // $upload.removeClass('state-' + state);
            // $upload.addClass('state-' + val);
            this.currentState = val;

            switch (this.currentState) {
                case 'pedding':
                    //$placeHolder.removeClass('element-invisible');
                    //$queue.parent().removeClass('filled');
                    //$queue.hide();
                    //$statusBar.addClass('element-invisible');
                    this.uploader.refresh();
                    break;

                case 'ready':
                    // $placeHolder.addClass('element-invisible');
                    // $('#filePicker2').removeClass('element-invisible');
                    // $queue.parent().addClass('filled');
                    // $queue.show();
                    // $statusBar.removeClass('element-invisible');
                    this.uploader.refresh();
                    break;

                case 'uploading':
                    //$('#filePicker2').addClass('element-invisible');
                    //$progress.show();
                    //$upload.text('暂停上传');
                    break;

                case 'paused':
                    //$progress.show();
                    //$upload.text('继续上传');
                    break;

                case 'confirm':
                    //$progress.hide();
                    //$upload.text('开始上传').addClass('disabled');

                    stats = this.uploader.getStats();
                    if (stats.successNum && !stats.uploadFailNum) {
                        this.setState('finish');
                        return;
                    }
                    break;
                case 'finish':
                    stats = this.uploader.getStats();
                    if (stats.successNum) {
                        this.toastrService.send('上传成功', ':)', 1);
                    } else {
                        // 没有成功的图片，重设
                        this.currentState = 'done';
                    }
                    break;
            }

            // updateStatus();
        }

        // 当有文件添加进来时执行，负责view的创建, 要区分已有的文件和新增的文件
        private addFile = (file: any) => {

            var pfile: any = { id: file.id, name: file.name, uploaderFile: file };

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

            file.on('statuschange', function (cur: any, prev: any) {

                if (cur === 'error' || cur === 'invalid') {
                    console.log(file.statusText);
                    showError(file.statusText);
                    // percentages[file.id][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                }
            });
        }

        // 负责文件的销毁, 要区分已有的文件和新增的文件
        private removeFile = (file: any) => {

            //需要捏造一个新对象，不能直接用uploader的file，因为从服务器下来的附件无法还原成file
            for (var i = 0; i < this.$scope.files.length; i++) {

                var element = this.$scope.files[i];

                if (element.id == file.id) {

                    this.$scope.files.splice(i, 1);
                    break;
                }
            }

            if (file.uploaderFile) {
                this.uploader.removeFile(file.uploaderFile);
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

            let $wrap: JQLite = this.$scope.container,
                // 附件容器
                $queue = $wrap.find('.filelist'),
                // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),
                // 文件总体选择信息。
                $info = $statusBar.find('.info'),
                // 上传按钮
                $upload = $wrap.find('.uploadBtn'),
                // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),
                // 总体进度条
                $progress = $statusBar.find('.progress');

            this.uploader = WebUploader.create({
                pick: {
                    id: this.$scope.container.find('.filePicker'),
                    label: '点击选择附件'
                },
                dnd: this.$scope.container.find('.queueList'),
                paste: document.body,

                // swf文件路径
                swf: this.configurationBroker.getAppSetting('uploader.swfUrl'),

                disableGlobalDnd: true,

                chunked: true,
                server: 'http://2betop.net/fileupload.php',
                fileNumLimit: 300,
                fileSizeLimit: 5 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit: 1 * 1024 * 1024    // 50 M
            });

            // 添加“添加文件”的按钮，
            this.uploader.addButton({
                id: this.$scope.container.find('.filePicker2'),
                label: '继续添加'
            });

            this.uploader.onUploadProgress = function (file: any, percentage: any) {
                // var $li = $('#' + file.id),
                //     $percent = $li.find('.progress span');

                // $percent.css('width', percentage * 100 + '%');
                // percentages[file.id][1] = percentage;
                // updateTotalProgress();
            };

            this.uploader.onFileQueued = (file: any) => {

                this.$scope.$apply(function (scope: any) {

                    scope.fileCount++;
                    scope.fileSize += file.size;
                });

                if (this.$scope.fileCount === 1) {
                    //$placeHolder.addClass('element-invisible');
                    //$statusBar.show();
                }

                this.addFile(file);
                this.setState('ready');
                // updateTotalProgress();
            };

            this.uploader.onFileDequeued = (file: any) => {

                this.$scope.fileCount--;
                this.$scope.fileSize -= file.size;
                // if (!fileCount) {
                //     setState('pedding');
                // }

                // removeFile(file);
                // updateTotalProgress();
            };

            this.uploader.on('all', (type: any) => {
                var stats;
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
            });

            this.uploader.onError = (code: any) => {
                this.toastrService.send('Eroor: ' + code, '出错了 :(', 3)
            };
        }

        static $inject = ['$scope', '$timeout', 'toastrService', 'configurationBroker'];

        constructor(
            private $scope: any,
            $timeout: ng.ITimeoutService,
            private toastrService: any,
            private configurationBroker: any) {

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

            // 添加的文件数量（未上传的，上传后会减掉）
            $scope.fileCount = 0; //TODO: 前天目前用这个判读显示模式，其实不对，而是已有文件+新选的文件>0
            // 添加的文件总大小（未上传的，上传后会减掉）
            $scope.fileSize = 0;

            $scope.files = [];

            $scope.removeFile = this.removeFile;
            $scope.upload = this.upload;

            $timeout(() => this.initializeUploader());
        }
    }

    class $FileControlDirective implements ng.IDirective {

        static factory(): ng.IDirectiveFactory {

            const directive = () => new $FileControlDirective();
            //directive.$inject = [];
            return directive;
        }

        private defaultOptions = {};

        constructor() {
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

            $scope.open = () => {

                modalService.open({
                    title: '附件上传...',
                    templateUrl: 'templates/mcs.input.file.modal.html',
                    data: { options: options, value: $scope.bindingValue },
                    controller: FileController
                }).then(function (data: any) {
                    $scope.bindingValue = data;
                });
            }
        }];
    }

    var inputTFile = angular.module('mcs.contols.input.file', ['mcs.controls.templates', 'mcs.contols.configurationBroker']);
    inputTFile.directive('mcsInputFile', $FileControlDirective.factory());
}