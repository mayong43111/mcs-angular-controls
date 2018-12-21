//HEAD 
(function(app) {
try { app = angular.module("mcs.controls.templates"); }
catch(err) { app = angular.module("mcs.controls.templates", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("templates/mcs.checkbox.list.html","<div><label ng-repeat=\"option in internalOptions\"><input type=\"checkbox\" ng-checked=\"option.selected\" ng-click=\"toggle(option)\" ng-disabled=\"readonly\">{{option.name}}</label></div>")

$templateCache.put("templates/mcs.input.checkbox.html","<input type=\"checkbox\" ng-model=\"bindingValue\" ng-disabled=\"readonly\">")

$templateCache.put("templates/mcs.input.date.html","<span><div ng-if=\"!readonly\" class=\"input-group date form_datetime\"><input class=\"form-control\" type=\"text\" readonly=\"readonly\"> <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-remove\"></span></span> <span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-th\"></span></span></div><span ng-if=\"readonly\">{{bindingValue | date: options.readonlyFormat }}</span></span>")

$templateCache.put("templates/mcs.input.modal.html","<span><div class=\"input-group\" ng-if=\"!readonly\"><label class=\"form-control\" readonly=\"readonly\"><span class=\"tag label label-primary\" ng-repeat=\"bv in bindValue\">{{bv.text}}<span class=\"remove\" ng-click=\"$parent.remove(bv)\"></span></span></label> <span class=\"input-group-addon\" ng-click=\"$parent.open()\"><span class=\"glyphicon glyphicon-modal-window\"></span></span></div><span ng-if=\"readonly\">{{bindingText}}</span></span>")

$templateCache.put("templates/mcs.input.modal.open.html","<div class=\"modal-body\"><table class=\"table table-bordered\" mcs-table-pagination=\"gridOptions\" binding-value=\"data\"><thead><tr><th>名称</th></tr></thead><tbody><tr><td>{{item.text}}</td></tr></tbody></table></div><div class=\"modal-footer\"><button type=\"submit\" class=\"btn btn-default\" ng-click=\"closed()\">取消</button> <button type=\"submit\" class=\"btn btn-default\" ng-click=\"submitted(data)\">确定</button></div>")

$templateCache.put("templates/mcs.input.number.html","<span><input type=\"text\" class=\"form-control\" style=\"text-align: right;\" ng-if=\"!readonly && !unit\" ng-model=\"$parent.bindingText\" ng-blur=\"$parent.setValue($parent.bindingText)\" ng-keyup=\"$parent.keyup()\"><div class=\"input-group\" ng-if=\"!readonly && unit\"><input type=\"text\" class=\"form-control\" style=\"text-align: right;\" ng-model=\"$parent.bindingText\" ng-blur=\"$parent.setValue($parent.bindingText)\" ng-keyup=\"$parent.keyup()\"><div class=\"input-group-addon\">{{$parent.unit}}</div></div><span ng-if=\"readonly\">{{bindingText}}</span><span ng-if=\"readonly && unit\">{{$parent.unit}}</span></span>")

$templateCache.put("templates/mcs.input.text.html","<span><input type=\"text\" ng-if=\"!readonly\" class=\"form-control\" ng-model=\"$parent.bindingValue\"> <span ng-if=\"readonly\">{{bindingValue}}</span></span>")

$templateCache.put("templates/mcs.input.textarea.html","<span><textarea ng-if=\"!readonly\" class=\"form-control\" rows=\"3\" ng-trim=\"false\" ng-model=\"$parent.bindingValue\"></textarea><pre ng-if=\"readonly\" class=\"textarea-readonly\">{{bindingValue}}</pre></span>")

$templateCache.put("templates/mcs.modal.alert.html","<div class=\"modal-body\"><p>{{data}}</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-sm btn-primary\" ng-click=\"closed()\">确定</button></div>")

$templateCache.put("templates/mcs.modal.html","<div class=\"modal fade in {{className}}\" tabindex=\"-1\" style=\"display: block; padding-right: 16px;\"><div class=\"modal-dialog modal-{{sizeClassName}}\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"closed()\"><span aria-hidden=\"true\">×</span></button><h4 class=\"modal-title\">{{title}}</h4></div><div class=\"modal-body\"></div></div></div></div><div class=\"modal-backdrop fade in\"></div>")

$templateCache.put("templates/mcs.radio.list.html","<div><label ng-repeat=\"option in internalOptions\"><input type=\"radio\" ng-model=\"$parent.bindingValue\" ng-value=\"option.id\" ng-disabled=\"readonly\">{{option.name}}</label></div>")

$templateCache.put("templates/mcs.select.html","<span><select class=\"form-control\" ng-if=\"!readonly\" ng-model=\"$parent.bindingValue\" ng-options=\"option.id as option.name for option in $parent.internalOptions\"></select> <span ng-if=\"readonly\">{{bindingText || bindingValue}}</span></span>")

$templateCache.put("templates/mcs.table.pagination.html","<ul class=\"pagination\" style=\"margin: 0;\"><li><a href=\"#\"><span>&laquo;</span></a></li><li><a href=\"#\">1</a></li><li><a href=\"#\">2</a></li><li><a href=\"#\">3</a></li><li><a href=\"#\">4</a></li><li><a href=\"#\">5</a></li><li><a href=\"#\"><span>&raquo;</span></a></li></ul>")

$templateCache.put("templates/mcs.toast.html","<div id=\"toast-container\" class=\"toast-top-right\"><div class=\"toast toast-{{message.className}}\" ng-repeat=\"message in messages\"><div class=\"toast-progress\" ng-style=\"{ width: message.remaining }\"></div><button type=\"button\" class=\"toast-close-button\" ng-click=\"setRemainingTimeZero(message)\">×</button><div class=\"toast-title\">{{message.title}}</div><div class=\"toast-message\">{{message.content}}</div></div></div>")

$templateCache.put("templates/mcs.tree.html","<ul class=\"ztree\" style=\"background-color: #f8fafb;\"></ul>")

$templateCache.put("templates/mcs.tree.node.html","<li class=\"level{{item.level}}\"><span class=\"button level{{item.level}}\" ng-click=\"expand()\" ng-class=\"{ 'roots_open': item.open, 'roots_close': !item.open }\"></span> <a class=\"level{{item.level}}\" ng-class=\"{ 'curSelectedNode': item.focus }\"><span class=\"button level{{item.level}}\" ng-class=\"{ 'ico_open': item.open, 'ico_close': !item.open }\"></span> <span ng-click=\"focusNode()\">{{item.source.name}}</span> <span class=\"button add\" ng-if=\"item.allowAdd\"></span> <span class=\"button remove\" ng-if=\"item.allowDel\"></span> <span class=\"button edit\" ng-if=\"item.allowEdit\"></span></a><ul class=\"node-container level{{item.level}}\" ng-show=\"item.open && item.children && item.children.length > 0\"></ul></li>")
}]);
})();