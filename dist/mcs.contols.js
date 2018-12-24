"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $CheckboxListControlDirective = /** @class */ (function () {
        function $CheckboxListControlDirective() {
            this.templateUrl = 'templates/mcs.checkbox.list.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                bindingOptions: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                    var initializeOptions = function (scope) {
                        scope.internalOptions = [];
                        if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {
                            for (var index = 0; index < scope.bindingOptions.length; index++) {
                                var element = angular.copy(scope.bindingOptions[index]);
                                element.name = element.name || element.id;
                                scope.internalOptions.push(element);
                            }
                        }
                        initializebindingValue(scope.bindingValue); // 就是为了触发重新绑定，其实
                    };
                    var hasValue = function (options, option) {
                        for (var index = 0; index < options.length; index++) {
                            var element = options[index];
                            if (option.id == element.id) {
                                return true;
                            }
                        }
                        return false;
                    };
                    var initializebindingValue = function (newValue) {
                        for (var index = 0; index < $scope.internalOptions.length; index++) {
                            var element = $scope.internalOptions[index];
                            element.selected = hasValue(newValue, element);
                        }
                        for (var index = 0; index < newValue.length; index++) {
                            var element = newValue[index];
                            if (!hasValue($scope.internalOptions, element)) {
                                if (!$scope.readonly) {
                                    newValue.splice(index, 1);
                                    index--;
                                }
                                else {
                                    var newOption = angular.copy(element);
                                    newOption.selected = true;
                                    $scope.internalOptions.push(newOption);
                                }
                            }
                        }
                    };
                    $scope.$watch('bindingOptions', function () { initializeOptions($scope); }, true);
                    $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                        if (!newValue || newValue.constructor != Array) {
                            newValue = [];
                        }
                        initializebindingValue(newValue);
                    }, true);
                    $scope.toggle = function (option) {
                        if (option.selected) {
                            for (var index = 0; index < $scope.bindingValue.length; index++) {
                                var element = $scope.bindingValue[index];
                                if (element.id == option.id) {
                                    $scope.bindingValue.splice(index, 1);
                                    return;
                                }
                            }
                        }
                        else {
                            $scope.bindingValue.push({
                                id: option.id,
                                name: option.name
                            });
                        }
                    };
                }];
        }
        $CheckboxListControlDirective.factory = function () {
            var directive = function () { return new $CheckboxListControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $CheckboxListControlDirective;
    }());
    var checkboxlist = angular.module('mcs.contols.checkboxlist', ['mcs.controls.templates']);
    checkboxlist.directive('mcsCheckboxList', $CheckboxListControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var ConfigurationBroker = /** @class */ (function () {
        function ConfigurationBroker() {
            this.configuration = {};
        }
        ConfigurationBroker.prototype.getConfig = function () {
            return this.configuration;
        };
        ConfigurationBroker.prototype.getAppSetting = function (key) {
            return this.getConfig()[key];
        };
        ConfigurationBroker.prototype.mergeConfigString = function (target) {
            this.mergeConfig(angular.fromJson(target));
        };
        ConfigurationBroker.prototype.mergeConfig = function (target) {
            return angular.extend(this.configuration, target);
        };
        return ConfigurationBroker;
    }());
    var ConfigurationProvider = /** @class */ (function () {
        function ConfigurationProvider() {
            this.configurationBroker = new ConfigurationBroker();
        }
        ConfigurationProvider.prototype.initialize = function (config) {
            this.configurationBroker.mergeConfig(config);
        };
        ;
        ConfigurationProvider.prototype.$get = function () {
            return this.configurationBroker;
        };
        ConfigurationProvider.$inject = [];
        return ConfigurationProvider;
    }());
    var configurationBroker = angular.module('mcs.contols.configurationBroker', []);
    configurationBroker.provider('configurationBroker', ConfigurationProvider);
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    angular.module('mcs.contols', [
        'mcs.controls.templates',
        'mcs.contols.input.text',
        'mcs.contols.select',
        'mcs.contols.input.checkbox',
        'mcs.contols.checkboxlist',
        'mcs.contols.radiolist',
        'mcs.contols.toastr',
        'mcs.contols.tree',
        'mcs.contols.modal',
        'mcs.contols.table.pagination',
        'mcs.contols.input.date',
        'mcs.contols.input.textarea',
        'mcs.contols.input.number',
        'mcs.contols.input.modal',
        'mcs.contols.input.file',
        'mcs.contols.configurationBroker'
    ]);
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $CheckboxControlDirective = /** @class */ (function () {
        function $CheckboxControlDirective() {
            this.templateUrl = 'templates/mcs.input.checkbox.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                    if (typeof ($scope.bindingValue) == 'undefined') {
                        $scope.bindingValue = false;
                    }
                    if ($scope.bindingValue.constructor == String) {
                        $scope.bindingValue = $scope.bindingValue == 'true' ? true : false;
                    }
                    ;
                    if ($scope.bindingValue.constructor == Number) {
                        $scope.bindingValue = $scope.bindingValue > 0 ? true : false;
                    }
                    ;
                    if ($scope.bindingValue && $scope.bindingValue.constructor != Boolean) {
                        $scope = Boolean($scope.bindingValue);
                    }
                }];
        }
        $CheckboxControlDirective.factory = function () {
            var directive = function () { return new $CheckboxControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $CheckboxControlDirective;
    }());
    var checkbox = angular.module('mcs.contols.input.checkbox', ['mcs.controls.templates']);
    checkbox.directive('mcsInputCheckbox', $CheckboxControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $DateControlDirective = /** @class */ (function () {
        function $DateControlDirective() {
            this.templateUrl = 'templates/mcs.input.date.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                bindingOptions: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                    var defaultOptions = {
                        format: "yyyy-mm-dd",
                        readonlyFormat: "yyyy-MM-dd",
                        autoclose: true,
                        todayBtn: 'linked',
                        todayHighlight: 'true',
                        minView: 2,
                        language: 'zh-CN'
                    };
                    $scope.options = angular.extend({}, defaultOptions, $scope.bindingOptions);
                }];
            this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
                var datetimepicker;
                scope.$watch('bindingValue', function (newValue, oldValue) {
                    if (datetimepicker) {
                        datetimepicker.datetimepicker('update', newValue);
                    }
                });
                scope.$watch('readonly', function (newValue, oldValue) {
                    if (newValue) {
                        if (datetimepicker) {
                            datetimepicker.datetimepicker('remove'); //TODO: 没生效
                        }
                    }
                    else {
                        datetimepicker = instanceElement.find('.form_datetime')
                            .datetimepicker(scope.options)
                            .on('changeDate', function (event) {
                            scope.$apply(function () {
                                scope.bindingValue = event.date;
                            });
                        });
                        datetimepicker.datetimepicker('update', scope.bindingValue);
                    }
                });
            };
        }
        $DateControlDirective.factory = function () {
            var directive = function () { return new $DateControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $DateControlDirective;
    }());
    var inputDate = angular.module('mcs.contols.input.date', ['mcs.controls.templates']);
    inputDate.directive('mcsInputDate', $DateControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var FileController = /** @class */ (function () {
        function FileController($scope, $timeout, toastrService, configurationBroker) {
            var _this = this;
            this.$scope = $scope;
            this.toastrService = toastrService;
            this.configurationBroker = configurationBroker;
            //更新进度条
            this.updateTotalProgress = function () {
                var loaded = 0, total = 0, 
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
            };
            this.setState = function (val) {
                var file, stats;
                if (val === _this.currentState) {
                    return;
                }
                // $upload.removeClass('state-' + state);
                // $upload.addClass('state-' + val);
                _this.currentState = val;
                switch (_this.currentState) {
                    case 'pedding':
                        //$placeHolder.removeClass('element-invisible');
                        //$queue.parent().removeClass('filled');
                        //$queue.hide();
                        //$statusBar.addClass('element-invisible');
                        _this.uploader.refresh();
                        break;
                    case 'ready':
                        // $placeHolder.addClass('element-invisible');
                        // $('#filePicker2').removeClass('element-invisible');
                        // $queue.parent().addClass('filled');
                        // $queue.show();
                        // $statusBar.removeClass('element-invisible');
                        _this.uploader.refresh();
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
                        stats = _this.uploader.getStats();
                        if (stats.successNum && !stats.uploadFailNum) {
                            _this.setState('finish');
                            return;
                        }
                        break;
                    case 'finish':
                        stats = _this.uploader.getStats();
                        if (stats.successNum) {
                            _this.toastrService.send('上传成功', ':)', 1);
                        }
                        else {
                            // 没有成功的图片，重设
                            _this.currentState = 'done';
                        }
                        break;
                }
                // updateStatus();
            };
            // 当有文件添加进来时执行，负责view的创建, 要区分已有的文件和新增的文件
            this.addFile = function (file) {
                var pfile = { id: file.id, name: file.name, uploaderFile: file };
                _this.$scope.$apply(function (scope) {
                    //需要捏造一个新对象，不能直接用uploader的file，因为从服务器下来的附件无法还原成file
                    scope.files.push(pfile);
                });
                var showError = function (code) {
                    var message;
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
                    _this.$scope.$apply(function (scope) {
                        pfile.isError = true;
                        pfile.errorMessage = message;
                    });
                };
                file.on('statuschange', function (cur, prev) {
                    if (cur === 'error' || cur === 'invalid') {
                        console.log(file.statusText);
                        showError(file.statusText);
                        // percentages[file.id][1] = 1;
                    }
                    else if (cur === 'interrupt') {
                        showError('interrupt');
                    }
                });
            };
            // 负责文件的销毁, 要区分已有的文件和新增的文件
            this.removeFile = function (file) {
                //需要捏造一个新对象，不能直接用uploader的file，因为从服务器下来的附件无法还原成file
                for (var i = 0; i < _this.$scope.files.length; i++) {
                    var element = _this.$scope.files[i];
                    if (element.id == file.id) {
                        _this.$scope.files.splice(i, 1);
                        break;
                    }
                }
                if (file.uploaderFile) {
                    _this.uploader.removeFile(file.uploaderFile);
                }
            };
            this.upload = function () {
                switch (_this.currentState) {
                    case 'ready':
                        _this.uploader.upload();
                        break;
                    case 'paused':
                        _this.uploader.upload();
                        break;
                    case 'uploading':
                        _this.uploader.stop();
                        break;
                }
            };
            this.initializeUploader = function () {
                var $wrap = _this.$scope.container, 
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
                _this.uploader = WebUploader.create({
                    pick: {
                        id: _this.$scope.container.find('.filePicker'),
                        label: '点击选择附件'
                    },
                    dnd: _this.$scope.container.find('.queueList'),
                    paste: document.body,
                    // swf文件路径
                    swf: _this.configurationBroker.getAppSetting('uploader.swfUrl'),
                    disableGlobalDnd: true,
                    chunked: true,
                    server: 'http://2betop.net/fileupload.php',
                    fileNumLimit: 300,
                    fileSizeLimit: 5 * 1024 * 1024,
                    fileSingleSizeLimit: 1 * 1024 * 1024 // 50 M
                });
                // 添加“添加文件”的按钮，
                _this.uploader.addButton({
                    id: _this.$scope.container.find('.filePicker2'),
                    label: '继续添加'
                });
                _this.uploader.onUploadProgress = function (file, percentage) {
                    // var $li = $('#' + file.id),
                    //     $percent = $li.find('.progress span');
                    // $percent.css('width', percentage * 100 + '%');
                    // percentages[file.id][1] = percentage;
                    // updateTotalProgress();
                };
                _this.uploader.onFileQueued = function (file) {
                    _this.$scope.$apply(function (scope) {
                        scope.fileCount++;
                        scope.fileSize += file.size;
                    });
                    if (_this.$scope.fileCount === 1) {
                        //$placeHolder.addClass('element-invisible');
                        //$statusBar.show();
                    }
                    _this.addFile(file);
                    _this.setState('ready');
                    // updateTotalProgress();
                };
                _this.uploader.onFileDequeued = function (file) {
                    _this.$scope.fileCount--;
                    _this.$scope.fileSize -= file.size;
                    // if (!fileCount) {
                    //     setState('pedding');
                    // }
                    // removeFile(file);
                    // updateTotalProgress();
                };
                _this.uploader.on('all', function (type) {
                    var stats;
                    switch (type) {
                        case 'uploadFinished':
                            _this.setState('confirm');
                            break;
                        case 'startUpload':
                            _this.setState('uploading');
                            break;
                        case 'stopUpload':
                            _this.setState('paused');
                            break;
                    }
                });
                _this.uploader.onError = function (code) {
                    _this.toastrService.send('Eroor: ' + code, '出错了 :(', 3);
                };
            };
            this.currentState = 'pedding';
            var closedFunc = $scope.closed;
            $scope.closed = function () {
                if (_this.uploader)
                    _this.uploader.destroy();
                closedFunc();
            };
            var submittedFunc = $scope.submitted;
            $scope.submitted = function (data) {
                if (_this.uploader)
                    _this.uploader.destroy();
                submittedFunc(data);
            };
            // 添加的文件数量（未上传的，上传后会减掉）
            $scope.fileCount = 0; //TODO: 前天目前用这个判读显示模式，其实不对，而是已有文件+新选的文件>0
            // 添加的文件总大小（未上传的，上传后会减掉）
            $scope.fileSize = 0;
            $scope.files = [];
            $scope.removeFile = this.removeFile;
            $scope.upload = this.upload;
            $timeout(function () { return _this.initializeUploader(); });
        }
        FileController.$inject = ['$scope', '$timeout', 'toastrService', 'configurationBroker'];
        return FileController;
    }());
    var $FileControlDirective = /** @class */ (function () {
        function $FileControlDirective() {
            var _this = this;
            this.defaultOptions = {};
            this.templateUrl = 'templates/mcs.input.file.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                optionsName: '@mcsInputFile',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', 'modalService', function ($scope, modalService) {
                    var options = angular.extend({}, _this.defaultOptions, $scope.$eval($scope.optionsName));
                    $scope.open = function () {
                        modalService.open({
                            title: '附件上传...',
                            templateUrl: 'templates/mcs.input.file.modal.html',
                            data: { options: options, value: $scope.bindingValue },
                            controller: FileController
                        }).then(function (data) {
                            $scope.bindingValue = data;
                        });
                    };
                }];
        }
        $FileControlDirective.factory = function () {
            var directive = function () { return new $FileControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $FileControlDirective;
    }());
    var inputTFile = angular.module('mcs.contols.input.file', ['mcs.controls.templates', 'mcs.contols.configurationBroker']);
    inputTFile.directive('mcsInputFile', $FileControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var GridController = /** @class */ (function () {
        function GridController($scope) {
            this.loadPaginationData = function (pagination, params) {
                return {
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    totalCount: 500,
                    data: [
                        { id: pagination.pageIndex + '001', text: '的第一孩子', },
                        { id: pagination.pageIndex + '002', text: '的第二孩子', },
                        { id: pagination.pageIndex + '003', text: '的第三孩子', }
                    ]
                };
            };
            $scope.gridOptions = {
                adapter: {
                    loadPaginationData: this.loadPaginationData
                },
            };
        }
        GridController.$inject = ['$scope'];
        return GridController;
    }());
    var TreeController = /** @class */ (function () {
        function TreeController($scope) {
            this.loadChildren = function (parentID) {
                return [
                    { id: parentID + '001', name: parentID + '的第一孩子', },
                    { id: parentID + '002', name: parentID + '的第二孩子', },
                    { id: parentID + '003', name: parentID + '的第三孩子', }
                ];
            };
            $scope.treeOptions = {
                adapter: {
                    loadChildren: this.loadChildren
                },
                data: {
                    id: '001',
                    name: '第一级节点',
                    loaded: true,
                    open: true,
                    children: [
                        { id: '001001', name: '第二级节点01' },
                        { id: '001002', name: '第二级节点02', loaded: true, },
                        { id: '001003', name: '第二级节点03', loaded: true, children: [] },
                        {
                            id: '001004', name: '第二级节点04', loaded: true, open: true,
                            children: [
                                { id: '001004001', name: '第三级节点01' }
                            ]
                        },
                    ]
                }
            };
        }
        TreeController.$inject = ['$scope'];
        return TreeController;
    }());
    var $InputModalControlDirective = /** @class */ (function () {
        function $InputModalControlDirective() {
            var _this = this;
            this.modeDefine = {
                'table': { templateUrl: 'templates/mcs.input.modal.table.html', controller: GridController },
                'tree': { templateUrl: 'templates/mcs.input.modal.tree.html', controller: TreeController },
                'custom': { templateUrl: null, controller: null }
            };
            this.defaultOptions = {
                mode: 'custom',
            };
            this.templateUrl = 'templates/mcs.input.modal.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                optionsName: '@mcsInputModal',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', '$templateCache', 'modalService', function ($scope, $templateCache, modalService) {
                    if (!$scope.bindingValue || $scope.bindingValue.constructor != Array) {
                        $scope.bindingValue = [];
                    }
                    var options = angular.extend({}, _this.defaultOptions, $scope.$eval($scope.optionsName));
                    var modeDefine = _this.modeDefine[options.mode];
                    options.templateUrl = options.templateUrl || modeDefine.templateUrl;
                    options.controller = options.controller || modeDefine.controller;
                    $scope.open = function () {
                        modalService.open({
                            title: '请选择...',
                            templateUrl: options.templateUrl,
                            data: { options: options, value: $scope.bindingValue },
                            controller: options.controller
                        }).then(function (data) {
                            $scope.bindingValue = data;
                        });
                    };
                }];
        }
        $InputModalControlDirective.factory = function () {
            var directive = function () { return new $InputModalControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $InputModalControlDirective;
    }());
    var inputModal = angular.module('mcs.contols.input.modal', ['mcs.controls.templates']);
    inputModal.directive('mcsInputModal', $InputModalControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $NumberControlDirective = /** @class */ (function () {
        function $NumberControlDirective() {
            var _this = this;
            this.templateUrl = 'templates/mcs.input.number.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                unit: '=',
                precision: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                    $scope.setValue = function (newValue) {
                        newValue = _this.removeComma(newValue);
                        if (newValue) {
                            newValue = Number(newValue);
                            if ($scope.precision && Number($scope.precision) > 0) {
                                newValue = newValue.toFixed(Number($scope.precision));
                            }
                        }
                        $scope.bindingValue = newValue;
                        $scope.bindingText = _this.addComma($scope.bindingValue);
                    };
                    $scope.keyup = function () {
                        $scope.bindingText = $scope.bindingText.replace(/[^\d+-\.]/g, '');
                    };
                    $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                        scope.setValue(newValue);
                    });
                }];
            this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
            };
            this.addComma = function (number) {
                if (number === 0)
                    return 0;
                var num = number + '';
                num = num.replace(new RegExp(',', 'g'), '');
                // 正负号处理   
                var symble = '';
                if (/^([-+]).*$/.test(num)) {
                    symble = num.replace(/^([-+]).*$/, '$1');
                    num = num.replace(/^([-+])(.*)$/, '$2');
                }
                if (/^[0-9]+(\.[0-9]+)?$/.test(num)) {
                    num = num.replace(new RegExp('^[0]+', 'g'), '');
                    if (/^\./.test(num)) {
                        num = '0' + num;
                    }
                    var decimal = num.replace(/^[0-9]+(\.[0-9]+)?$/, '$1');
                    var integer = num.replace(/^([0-9]+)(\.[0-9]+)?$/, '$1');
                    var re = /(\d+)(\d{3})/;
                    while (re.test(integer)) {
                        integer = integer.replace(re, '$1,$2');
                    }
                    return symble + integer + decimal;
                }
                else {
                    return number;
                }
            };
            this.removeComma = function (number) {
                var num = number + '';
                num = num.replace(new RegExp(',', 'g'), '');
                if (/^[-+]?[0-9]+(\.[0-9]+)?$/.test(num)) {
                    return num;
                }
                else {
                    return number;
                }
            };
        }
        $NumberControlDirective.factory = function () {
            var directive = function () { return new $NumberControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $NumberControlDirective;
    }());
    var inputNumber = angular.module('mcs.contols.input.number', ['mcs.controls.templates']);
    inputNumber.directive('mcsInputNumber', $NumberControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $TextControlDirective = /** @class */ (function () {
        function $TextControlDirective() {
            this.templateUrl = 'templates/mcs.input.text.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                }];
        }
        $TextControlDirective.factory = function () {
            var directive = function () { return new $TextControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $TextControlDirective;
    }());
    var inputText = angular.module('mcs.contols.input.text', ['mcs.controls.templates']);
    inputText.directive('mcsInputText', $TextControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $TextareaControlDirective = /** @class */ (function () {
        function $TextareaControlDirective() {
            this.templateUrl = 'templates/mcs.input.textarea.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                }];
            this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
                var textarea;
                var initHeight;
                var autoHeight = function () {
                    var scrollHeight = textarea.scrollHeight + 2;
                    var newHeight = initHeight > scrollHeight ? initHeight : scrollHeight;
                    textarea.style.height = newHeight + 'px';
                };
                scope.$watch('readonly', function (newValue, oldValue) {
                    if (newValue) {
                    }
                    else {
                        textarea = instanceElement.find('textarea')[0];
                        textarea.style['overflow-y'] = 'hidden';
                        textarea.style['word-break'] = 'break-all';
                        textarea.style['resize'] = 'vertical';
                        textarea.scrollTop = 0;
                        initHeight = textarea.scrollHeight;
                        autoHeight();
                    }
                });
                scope.$watch('bindingValue', function (newValue, oldValue) {
                    if (textarea) {
                        autoHeight();
                    }
                });
            };
        }
        $TextareaControlDirective.factory = function () {
            var directive = function () { return new $TextareaControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $TextareaControlDirective;
    }());
    var inputText = angular.module('mcs.contols.input.textarea', ['mcs.controls.templates']);
    inputText.directive('mcsInputTextarea', $TextareaControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var ModalSize;
    (function (ModalSize) {
        ModalSize[ModalSize["lg"] = 0] = "lg";
        ModalSize[ModalSize["sm"] = 1] = "sm";
    })(ModalSize || (ModalSize = {}));
    var ModalLevel;
    (function (ModalLevel) {
        ModalLevel[ModalLevel["Info"] = 0] = "Info";
        ModalLevel[ModalLevel["Success"] = 1] = "Success";
        ModalLevel[ModalLevel["Warning"] = 2] = "Warning";
        ModalLevel[ModalLevel["Error"] = 3] = "Error";
    })(ModalLevel || (ModalLevel = {}));
    var $ModalService = /** @class */ (function () {
        function $ModalService($rootScope, $compile, $controller, $http, $templateCache, $q, toastrService) {
            this.$rootScope = $rootScope;
            this.$compile = $compile;
            this.$controller = $controller;
            this.$http = $http;
            this.$templateCache = $templateCache;
            this.$q = $q;
            this.toastrService = toastrService;
        }
        $ModalService.prototype.open = function (options) {
            var _this = this;
            var defer = this.$q.defer();
            var template = angular.element(this.$templateCache.get('templates/mcs.modal.html'));
            this.loadModalBody(options).then(function (body) {
                template.find('.modal-body').replaceWith(body);
                var destroy = function () {
                    clonedElement.remove();
                    newScope.$destroy();
                };
                var newScope = _this.$rootScope.$new();
                newScope.container = body;
                newScope.data = angular.copy(options.data);
                newScope.title = options.title || 'Info';
                newScope.sizeClassName = _this.getSizeClassName(options.size);
                newScope.className = options.className || '';
                newScope.closed = function () {
                    destroy();
                    defer.notify();
                };
                newScope.submitted = function (data) {
                    destroy();
                    defer.resolve(data);
                };
                if (options.controller) {
                    _this.$controller(options.controller, { $scope: newScope });
                }
                var clonedElement = _this.$compile(template)(newScope);
                angular.element(document).find('body').append(clonedElement);
            });
            return defer.promise;
        };
        $ModalService.prototype.alert = function (content, title, level) {
            return this.open({
                title: title || this.getDefautTitle(level),
                data: content,
                controller: ['$scope', function ($scope) { $scope.closed = $scope.submitted; }],
                size: ModalSize.sm,
                className: this.getClassName(level),
                template: this.$templateCache.get('templates/mcs.modal.alert.html')
            });
        };
        $ModalService.prototype.confirm = function (content, title, level) {
            return this.open({
                title: title || this.getDefautTitle(level),
                data: content,
                size: ModalSize.sm,
                className: this.getClassName(level),
                template: this.$templateCache.get('templates/mcs.modal.confirm.html')
            });
        };
        $ModalService.prototype.loadModalBody = function (options) {
            var _this = this;
            var defer = this.$q.defer();
            if (options.template) {
                defer.resolve(angular.element(options.template));
            }
            else if (options.templateUrl) {
                var template = this.$templateCache.get(options.templateUrl);
                if (template) {
                    defer.resolve(angular.element(template));
                }
                else {
                    this.$http.get(options.templateUrl).then(function (response) {
                        var template = response.data;
                        defer.resolve(angular.element(template));
                    }, function (reason) { _this.toastrService.send('HTTP获取页面', '出错了 :(', 3); });
                }
            }
            else {
                throw 'must need template or templateUrl';
            }
            return defer.promise;
        };
        $ModalService.prototype.getDefautTitle = function (level) {
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
        };
        $ModalService.prototype.getSizeClassName = function (size) {
            if (size == ModalSize.sm) {
                return 'sm';
            }
            return 'lg';
        };
        $ModalService.prototype.getClassName = function (level) {
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
        };
        $ModalService.$inject = ['$rootScope', '$compile', '$controller', '$http', '$templateCache', '$q', 'toastrService'];
        return $ModalService;
    }());
    var modal = angular.module('mcs.contols.modal', ['mcs.controls.templates']);
    modal.service('modalService', $ModalService);
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $RadiokboxListControlDirective = /** @class */ (function () {
        function $RadiokboxListControlDirective() {
            this.templateUrl = 'templates/mcs.radio.list.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                bindingText: '=?',
                bindingOptions: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                    var initializeOptions = function (scope) {
                        scope.internalOptions = [];
                        if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {
                            for (var index = 0; index < scope.bindingOptions.length; index++) {
                                var element = angular.copy(scope.bindingOptions[index]);
                                element.name = element.name || element.id;
                                scope.internalOptions.push(element);
                            }
                        }
                        initializebindingValue(scope.bindingValue); // 就是为了触发重新绑定，其实
                    };
                    var hasValue = function (option, value) {
                        return value == option.id;
                    };
                    var initializebindingValue = function (newValue) {
                        var haslOption = false;
                        for (var index = 0; index < $scope.internalOptions.length; index++) {
                            var element = $scope.internalOptions[index];
                            element.selected = hasValue(element, newValue);
                            if (element.selected) {
                                haslOption = true;
                            }
                        }
                        if (!haslOption) {
                            if (!$scope.readonly) {
                                $scope.bindingValue = undefined;
                            }
                            else if (typeof ($scope.bindingValue) != 'undefined') {
                                $scope.internalOptions.push({
                                    id: $scope.bindingValue,
                                    name: $scope.bindingText || $scope.bindingValue
                                });
                            }
                        }
                    };
                    $scope.$watch('bindingOptions', function () { initializeOptions($scope); }, true);
                    $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                        scope.bindingText = undefined;
                        if (newValue && scope.internalOptions && scope.internalOptions.length > 0) {
                            for (var index = 0; index < scope.internalOptions.length; index++) {
                                var element = scope.internalOptions[index];
                                if (element.id == scope.bindingValue) {
                                    scope.bindingText = element.name;
                                    break;
                                }
                            }
                        }
                        initializebindingValue(newValue);
                    }, true);
                }];
        }
        $RadiokboxListControlDirective.factory = function () {
            var directive = function () { return new $RadiokboxListControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $RadiokboxListControlDirective;
    }());
    var radiolist = angular.module('mcs.contols.radiolist', ['mcs.controls.templates']);
    radiolist.directive('mcsRadioList', $RadiokboxListControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $SelectControlDirective = /** @class */ (function () {
        function $SelectControlDirective() {
            this.templateUrl = 'templates/mcs.select.html';
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                bindingText: '=?',
                bindingOptions: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = ['$scope', function ($scope) {
                    var initialize = function (scope) {
                        scope.bindingValue = scope.bindingValue || '';
                        if (scope.readonly)
                            return;
                        scope.internalOptions = [];
                        scope.internalOptions.push({ id: '', name: '请选择...' });
                        if (scope.bindingOptions && scope.bindingOptions.constructor == Array && scope.bindingOptions.length > 0) {
                            var hasValue = false;
                            for (var index = 0; index < scope.bindingOptions.length; index++) {
                                var element = scope.bindingOptions[index];
                                if (!element)
                                    continue; //IE8
                                scope.internalOptions.push(angular.copy(element));
                                if (element.id == scope.bindingValue) {
                                    hasValue = true;
                                }
                            }
                            if (!hasValue) {
                                scope.bindingValue = '';
                            }
                        }
                        else if (scope.bindingValue) {
                            scope.internalOptions.push({
                                id: scope.bindingValue,
                                name: scope.bindingText || scope.bindingValue
                            });
                        }
                    };
                    $scope.$watch('readonly', function () { initialize($scope); }, true);
                    $scope.$watch('bindingOptions', function () { initialize($scope); }, true);
                    $scope.$watch('bindingValue', function (newValue, oldValue, scope) {
                        scope.bindingText = undefined;
                        if (newValue && scope.internalOptions && scope.internalOptions.length > 0) {
                            for (var index = 0; index < scope.internalOptions.length; index++) {
                                var element = scope.internalOptions[index];
                                if (element.id == scope.bindingValue) {
                                    scope.bindingText = element.name;
                                    break;
                                }
                            }
                        }
                    });
                }];
        }
        $SelectControlDirective.factory = function () {
            var directive = function () { return new $SelectControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $SelectControlDirective;
    }());
    var select = angular.module('mcs.contols.select', ['mcs.controls.templates']);
    select.directive('mcsSelect', $SelectControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var $TablePaginationController = /** @class */ (function () {
        function $TablePaginationController($scope, $q, toastrService) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            var options = $scope.$parent.$eval($scope.optionsName);
            if (!options)
                throw 'Must have options';
            var pagination = {
                pageIndex: 0,
                pageSize: options.pageSize || 20
            };
            $scope.selected = function (item) {
                $scope.bindingValue = item;
            };
            this.loadPaginationData(pagination, options).then(function (data) {
                _this.initializeScope(data, $scope);
            });
        }
        $TablePaginationController.prototype.initializeScope = function (source, $scope) {
            $scope.data = source.data;
            $scope.currentPageIndex = source.pageIndex;
            $scope.currentPageSize = source.pageSize;
            $scope.currentTotalCount = source.totalCount;
        };
        $TablePaginationController.prototype.loadPaginationData = function (pagination, options) {
            var defer = this.$q.defer();
            var params = null;
            if (options.async && options.async.params) {
                params = options.async.params;
            }
            if (options.adapter && options.adapter.loadPaginationData) {
                var loadData = options.adapter.loadPaginationData(pagination, params);
                if (this.isIPromise(loadData)) {
                    loadData.then(function (data) {
                        defer.resolve(data);
                    });
                }
                else {
                    defer.resolve(loadData);
                }
            }
            return defer.promise;
        };
        $TablePaginationController.prototype.isIPromise = function (source) {
            return source && typeof (source.then) != 'undefined';
        };
        $TablePaginationController.$inject = ['$scope', '$q', 'toastrService'];
        return $TablePaginationController;
    }());
    var $TablePaginationDirective = /** @class */ (function () {
        function $TablePaginationDirective($templateCache, $compile) {
            var _this = this;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.restrict = 'A';
            this.replace = true;
            this.scope = {
                bindingValue: '=',
                optionsName: '@mcsTablePagination',
                readonly: '=?mcsReadonly'
            };
            this.controller = $TablePaginationController;
            this.template = function (tElement, tAttrs) {
                var tableInfo = _this.initializTableInfo(tElement);
                _this.initializHead(tableInfo);
                _this.initializeBody(tableInfo);
                _this.initializPagination(tableInfo);
                _this.initializAllCheckbox(tableInfo);
                return tableInfo.container[0].outerHTML;
            };
        }
        $TablePaginationDirective.factory = function () {
            var directive = function (a, b) { return new $TablePaginationDirective(a, b); };
            directive.$inject = ['$templateCache', '$compile'];
            return directive;
        };
        $TablePaginationDirective.prototype.initializTableInfo = function (instanceElement) {
            var container = angular.element('<div></div>');
            //container.addClass('table-responsive');
            var table = instanceElement.clone();
            table.removeAttr('mcs-table-pagination');
            container.append(table);
            var tbody = table.find('tbody');
            if (tbody.length != 1)
                throw 'Tables can only have one tbody;';
            var tbodyTemplete = tbody.find('tr');
            if (tbodyTemplete.length == 0)
                throw 'tbody must have tr;';
            var columnsCount = 0;
            for (var index = 0; index < tbodyTemplete[0].children.length; index++) {
                var element = tbodyTemplete[0].children[index];
                columnsCount += (Number(element.getAttribute('colspan')) || 1);
            }
            return {
                container: container,
                table: table,
                thead: table.find('thead'),
                tBody: tbody,
                tfoot: table.find('tfoot'),
                columnsCount: columnsCount,
            };
        };
        $TablePaginationDirective.prototype.initializAllCheckbox = function (tableInfo) {
            var theadCheckbox = this.renderCheckbox(tableInfo.thead);
            var tBodyCheckbox = this.renderCheckbox(tableInfo.tBody);
            var tfootCheckbox = this.renderCheckbox(tableInfo.tfoot);
            this.bindingItemCheckbox(tBodyCheckbox);
        };
        $TablePaginationDirective.prototype.bindingItemCheckbox = function (checkbox) {
            if (!checkbox)
                return;
            checkbox.attr('ng-click', 'selected(item, $event)');
        };
        $TablePaginationDirective.prototype.renderCheckbox = function (element) {
            var tr = element.find('tr');
            if (tr.length > 0) {
                var td = angular.element('<th></th>');
                var checkbox = angular.element('<input type="checkbox" ng-disabled="readonly" />');
                td.append(checkbox);
                td.attr('rowspan', tr.length);
                angular.element(tr[0]).prepend(td);
                return checkbox;
            }
            return undefined;
        };
        $TablePaginationDirective.prototype.initializHead = function (tableInfo) {
        };
        $TablePaginationDirective.prototype.initializeBody = function (tableInfo) {
            var tBoydTR = tableInfo.tBody.find('tr');
            if (tBoydTR.length == 1) {
                tBoydTR.attr('ng-repeat', 'item in data track by $index');
            }
            else {
                tBoydTR[0].setAttribute('ng-repeat-start', 'item in data track by $index');
                tBoydTR[tBoydTR.length - 1].setAttribute('ng-repeat-end', '');
            }
        };
        $TablePaginationDirective.prototype.initializPagination = function (tableInfo) {
            var paginationTemplate = this.$templateCache.get('templates/mcs.table.pagination.html');
            tableInfo.container.append(paginationTemplate);
        };
        return $TablePaginationDirective;
    }());
    var tablePagination = angular.module('mcs.contols.table.pagination', ['mcs.controls.templates']);
    tablePagination.directive('mcsTablePagination', $TablePaginationDirective.factory());
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    var ToastrLevel;
    (function (ToastrLevel) {
        ToastrLevel[ToastrLevel["Info"] = 0] = "Info";
        ToastrLevel[ToastrLevel["Success"] = 1] = "Success";
        ToastrLevel[ToastrLevel["Warning"] = 2] = "Warning";
        ToastrLevel[ToastrLevel["Error"] = 3] = "Error";
    })(ToastrLevel || (ToastrLevel = {}));
    var $ToastrService = /** @class */ (function () {
        function $ToastrService($templateCache, $compile, $rootScope) {
            this.interval = 10;
            var template = $templateCache.get('templates/mcs.toast.html');
            if (!template)
                throw 'must need templates/mcs.toast.html';
            this.toastrScope = $rootScope.$new();
            this.toastrScope.messages = [];
            this.toastrScope.setRemainingTimeZero = function (message) {
                message.remainingTime = 0;
            };
            var clonedElement = $compile(angular.element(template))(this.toastrScope);
            angular.element(document).find('body').append(clonedElement);
        }
        $ToastrService.prototype.send = function (content, title, level, timeOut) {
            var _this = this;
            if (!content)
                return;
            level = level || ToastrLevel.Info;
            timeOut = timeOut || 5000;
            var newToastrMessage = {
                title: title || this.getDefautTitle(level),
                content: content,
                remaining: this.getRemaining(timeOut, timeOut),
                remainingTime: timeOut,
                timeOut: timeOut,
                className: this.getClassName(level),
            };
            this.toastrScope.messages.push(newToastrMessage);
            if (!this.intervalID)
                this.intervalID = window.setInterval(function () { return _this.innerTimerHandler(); }, this.interval);
        };
        $ToastrService.prototype.innerTimerHandler = function () {
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
        };
        $ToastrService.prototype.getRemaining = function (remainingTime, timeOut) {
            if (remainingTime < 0)
                return '0';
            return ((remainingTime / timeOut) * 100) + '%';
        };
        $ToastrService.prototype.getDefautTitle = function (level) {
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
        };
        $ToastrService.prototype.getClassName = function (level) {
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
        };
        $ToastrService.$inject = ['$templateCache', '$compile', '$rootScope'];
        return $ToastrService;
    }());
    var toastr = angular.module('mcs.contols.toastr', ['mcs.controls.templates']);
    toastr.service('toastrService', $ToastrService);
})(mcscontrols || (mcscontrols = {}));

"use strict";
var mcscontrols;
(function (mcscontrols) {
    //树节点的类型
    var TreeNodeType;
    (function (TreeNodeType) {
        TreeNodeType[TreeNodeType["folder"] = 0] = "folder";
        TreeNodeType[TreeNodeType["file"] = 1] = "file";
        TreeNodeType[TreeNodeType["user"] = 2] = "user";
    })(TreeNodeType || (TreeNodeType = {}));
    //树控件的控制器
    var $TreeControlController = /** @class */ (function () {
        function $TreeControlController($scope, $q, $templateCache, $compile, $controller, $http, toastrService) {
            var _this = this;
            this.$scope = $scope;
            this.$q = $q;
            this.$templateCache = $templateCache;
            this.$compile = $compile;
            this.$controller = $controller;
            this.$http = $http;
            this.toastrService = toastrService;
            if (!$scope.optionsName)
                throw 'must need options.';
            var options = $scope.$parent.$eval($scope.optionsName);
            if (!options)
                throw 'must need options.';
            this._options = angular.copy(options);
            this.initializeOptions(this._options);
            this.loadRootNode().then(function (data) {
                _this.renderTreeNode($scope.rootContainer, $scope, data);
            });
        }
        $TreeControlController.prototype.renderTreeNode = function (container, $parentScope, data) {
            var template = angular.element(this.$templateCache.get('templates/mcs.tree.node.html'));
            var newScope = $parentScope.$new();
            newScope.rootController = this;
            newScope.item = data;
            newScope.nodeContainer = template.find('.node-container');
            this.$controller($TreeNodeController, { $scope: newScope });
            var clonedElement = this.$compile(template)(newScope);
            container.append(clonedElement);
        };
        $TreeControlController.prototype.focusNode = function (item) {
            if (this._focusNode)
                this._focusNode.focus = false;
            item.focus = true;
            this._focusNode = item;
            //TODO:只有单选才是激活及选择
            this.selected(item);
            if (this._options.callback && this._options.callback.onClick) {
                this._options.callback.onClick(item.source, {});
            }
        };
        //加载根节点
        $TreeControlController.prototype.loadRootNode = function () {
            var _this = this;
            var defer = this.$q.defer();
            if (this.$scope.data) { //相当于缓存
                defer.resolve(this.convertViewModel(this._options.data, 0));
            }
            else if (this._options.data) { //从配置初始化
                var data = angular.copy(this._options.data);
                data.open = this._options.data.children != null; //根节点需要展开
                this.$scope.data = this.convertViewModel(data, 0);
                defer.resolve(this.$scope.data);
            }
            else if (this._options.async && this._options.async.url) { //用HTTP加载
                var params = null;
                if (this._options.async && this._options.async.params) {
                    params = this._options.async.params;
                }
                this.$http.get(this._options.async.url + '/Root', { params: params }).then(function (response) {
                    var data = response.data;
                    if (!data) {
                        _this.toastrService.send('HTTP无法找到节点', '出错了 :(', 2);
                        return;
                    }
                    _this.$scope.data = _this.convertViewModel(data, 0);
                    defer.resolve(_this.$scope.data);
                }, function (reason) { _this.toastrService.send('HTTP获取根节点失败', '出错了 :(', 3); });
            }
            return defer.promise;
        };
        $TreeControlController.prototype.loadChildrenTreeNode = function (treeNode) {
            var _this = this;
            var defer = this.$q.defer();
            var options = this._options;
            if (treeNode.children) { //相当于缓存
                defer.resolve(treeNode.children);
            }
            else if (options.adapter && options.adapter.loadChildren) {
                var params = null;
                if (options.async && options.async.params) {
                    params = options.async.params;
                }
                var loadChildren = options.adapter.loadChildren(treeNode.source.id, params);
                if (this.isIPromise(loadChildren)) {
                    loadChildren.then(function (data) {
                        data = data || [];
                        var children = _this.convertViewModels(data, treeNode.level);
                        treeNode.children = children;
                        treeNode.loaded = true;
                        defer.resolve(treeNode.children);
                    });
                }
                else {
                    var children = this.convertViewModels(loadChildren, treeNode.level);
                    treeNode.children = children;
                    treeNode.loaded = true;
                    defer.resolve(treeNode.children);
                }
            }
            return defer.promise;
        };
        $TreeControlController.prototype.selected = function (item) {
            //TODO:单选、多选
            if (this.$scope.bindingValue
                && this.$scope.bindingValue.id == item.source.id) {
                return;
            }
            var newData = angular.copy(item.source);
            newData.children = undefined;
            this.$scope.bindingValue = newData;
        };
        $TreeControlController.prototype.initializeOptions = function (options) {
            if (!options.edit) {
                options.edit = {
                    enable: false,
                    allowAdd: false,
                    allowDel: false,
                    allowEdit: false
                };
            }
            else {
                options.edit.enable = typeof (options.edit.enable) == 'undefined' ? false : options.edit.enable;
                options.edit.allowAdd = typeof (options.edit.allowAdd) == 'undefined' ? options.edit.enable : options.edit.allowAdd;
                options.edit.allowDel = typeof (options.edit.allowDel) == 'undefined' ? options.edit.enable : options.edit.allowDel;
                options.edit.allowEdit = typeof (options.edit.allowEdit) == 'undefined' ? options.edit.enable : options.edit.allowEdit;
            }
        };
        $TreeControlController.prototype.isIPromise = function (source) {
            return source && typeof (source.then) != 'undefined';
        };
        $TreeControlController.prototype.convertViewModels = function (treeNodes, level) {
            var result = [];
            for (var index = 0; index < treeNodes.length; index++) {
                var element = treeNodes[index];
                var newVm = this.convertViewModel(element, level);
                if (newVm)
                    result.push(newVm);
            }
            return result;
        };
        //把数据源转换为视图模型
        $TreeControlController.prototype.convertViewModel = function (treeNode, level) {
            if (!treeNode) {
                return undefined;
            }
            ;
            var target = treeNode;
            level++;
            var result = {
                level: level,
                open: target.open || false,
                loaded: false,
                type: target.type || TreeNodeType.folder,
                source: treeNode,
                focus: false,
                allowAdd: typeof (treeNode.allowAdd) == 'undefined' ? this._options.edit.allowAdd : treeNode.allowAdd,
                allowDel: typeof (treeNode.allowDel) == 'undefined' ? this._options.edit.allowDel : treeNode.allowDel,
                allowEdit: typeof (treeNode.allowEdit) == 'undefined' ? this._options.edit.allowEdit : treeNode.allowEdit,
            };
            if (target.children && target.children.constructor == Array) {
                result.loaded = true;
                result.children = this.convertViewModels(target.children, level);
            }
            return result;
        };
        $TreeControlController.$inject = ['$scope', '$q', '$templateCache', '$compile', '$controller', '$http', 'toastrService'];
        return $TreeControlController;
    }());
    //树节点的控制器
    var $TreeNodeController = /** @class */ (function () {
        function $TreeNodeController($scope) {
            var _this = this;
            this.$scope = $scope;
            $scope.expand = function () {
                $scope.item.open = !$scope.item.open;
                if ($scope.item.open && !$scope.item.loaded && $scope.item.type == TreeNodeType.folder) {
                    _this.internalRenderChildren($scope);
                }
            };
            $scope.focusNode = function () {
                $scope.rootController.focusNode($scope.item);
            };
            if ($scope.item.open && $scope.item.type == TreeNodeType.folder) {
                this.internalRenderChildren($scope);
            }
        }
        $TreeNodeController.prototype.internalRenderChildren = function ($scope) {
            $scope.rootController.loadChildrenTreeNode($scope.item).then(function (data) {
                $scope.nodeContainer.html('');
                for (var index = 0; index < data.length; index++) {
                    var element = data[index];
                    $scope.rootController.renderTreeNode($scope.nodeContainer, $scope, element);
                }
            });
        };
        $TreeNodeController.$inject = ['$scope'];
        return $TreeNodeController;
    }());
    //Directive 的定义
    var $TreeControlDirective = /** @class */ (function () {
        function $TreeControlDirective() {
            this.templateUrl = 'templates/mcs.tree.html';
            this.restrict = 'A';
            this.scope = {
                optionsName: '@mcsTree',
                bindingValue: '=',
                readonly: '=?mcsReadonly'
            };
            this.controller = $TreeControlController;
            this.link = function (scope, instanceElement, instanceAttributes, controller, transclude) {
                scope.rootContainer = instanceElement.find('.ztree');
            };
        }
        $TreeControlDirective.factory = function () {
            var directive = function () { return new $TreeControlDirective(); };
            //directive.$inject = [];
            return directive;
        };
        return $TreeControlDirective;
    }());
    var tree = angular.module('mcs.contols.tree', ['mcs.controls.templates']);
    tree.directive('mcsTree', $TreeControlDirective.factory());
})(mcscontrols || (mcscontrols = {}));

//# sourceMappingURL=mcs.contols.js.map
