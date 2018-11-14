//HEAD 
(function(app) {
try { app = angular.module("mcs.controls.templates"); }
catch(err) { app = angular.module("mcs.controls.templates", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("templates/mcs.checkbox.list.html","<div><label ng-repeat=\"option in internalOptions\"><input type=\"checkbox\" ng-checked=\"option.selected\" ng-click=\"toggle(option)\" ng-disabled=\"readonly\">{{option.text}}</label></div>")

$templateCache.put("templates/mcs.input.checkbox.html","<input type=\"checkbox\" ng-model=\"bindingValue\" ng-disabled=\"readonly\">")

$templateCache.put("templates/mcs.input.text.html","<span><input type=\"text\" ng-if=\"!readonly\" class=\"form-control\" ng-model=\"$parent.bindingValue\"> <span ng-if=\"readonly\">{{bindingValue}}</span></span>")

$templateCache.put("templates/mcs.modal.alert.html","<div class=\"modal-body\"><p>{{data}}</p></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-sm btn-primary\" ng-click=\"closed()\">确定</button></div>")

$templateCache.put("templates/mcs.modal.html","<div class=\"modal fade in {{className}}\" tabindex=\"-1\" style=\"display: block; padding-right: 16px;\"><div class=\"modal-dialog modal-{{sizeClassName}}\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"closed()\"><span aria-hidden=\"true\">×</span></button><h4 class=\"modal-title\">{{title}}</h4></div><div class=\"modal-body\"></div></div></div></div><div class=\"modal-backdrop fade in\"></div>")

$templateCache.put("templates/mcs.radio.list.html","<div><label ng-repeat=\"option in internalOptions\"><input type=\"radio\" ng-model=\"$parent.bindingValue\" ng-value=\"option.value\" ng-disabled=\"readonly\">{{option.text}}</label></div>")

$templateCache.put("templates/mcs.select.html","<span><select class=\"form-control\" ng-if=\"!readonly\" ng-model=\"$parent.bindingValue\" ng-options=\"option.value as option.text for option in $parent.internalOptions\"></select> <span ng-if=\"readonly\">{{bindingText || bindingValue}}</span></span>")

$templateCache.put("templates/mcs.toast.html","<div id=\"toast-container\" class=\"toast-top-right\"><div class=\"toast toast-{{message.className}}\" ng-repeat=\"message in messages\"><div class=\"toast-progress\" ng-style=\"{ width: message.remaining }\"></div><button type=\"button\" class=\"toast-close-button\" ng-click=\"setRemainingTimeZero(message)\">×</button><div class=\"toast-title\">{{message.title}}</div><div class=\"toast-message\">{{message.content}}</div></div></div>")

$templateCache.put("templates/mcs.tree.html","<ul class=\"ztree\" style=\"background-color: #f8fafb;\"></ul>")

$templateCache.put("templates/mcs.tree.node.html","<li class=\"level{{item.level}}\"><span class=\"button level{{item.level}}\" ng-click=\"expand()\" ng-class=\"{ 'roots_open': item.open, 'roots_close': !item.open }\"></span> <a class=\"level{{item.level}}\" ng-class=\"{ 'curSelectedNode': item.focus }\"><span class=\"button level{{item.level}}\" ng-class=\"{ 'ico_open': item.open, 'ico_close': !item.open }\"></span> <span ng-click=\"focusNode()\">{{item.source.name}}</span> <span class=\"button add\" ng-if=\"item.allowAdd\"></span> <span class=\"button remove\" ng-if=\"item.allowDel\"></span> <span class=\"button edit\" ng-if=\"item.allowEdit\"></span></a><ul class=\"node-container level{{item.level}}\" ng-show=\"item.open && item.children && item.children.length > 0\"></ul></li>")
}]);
})();