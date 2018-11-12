//HEAD 
(function(app) {
try { app = angular.module("mcs.controls.templates"); }
catch(err) { app = angular.module("mcs.controls.templates", []); }
app.run(["$templateCache", function($templateCache) {
"use strict";

$templateCache.put("templates/mcs.checkbox.list.html","<div><label ng-repeat=\"option in internalOptions\"><input type=\"checkbox\" ng-checked=\"option.selected\" ng-click=\"toggle(option)\" ng-disabled=\"readonly\">{{option.text}}</label></div>")

$templateCache.put("templates/mcs.input.checkbox.html","<input type=\"checkbox\" ng-model=\"bindingValue\" ng-disabled=\"readonly\">")

$templateCache.put("templates/mcs.input.text.html","<span><input type=\"text\" ng-if=\"!readonly\" class=\"form-control\" ng-model=\"$parent.bindingValue\"> <span ng-if=\"readonly\">{{bindingValue}}</span></span>")

$templateCache.put("templates/mcs.radio.list.html","<div><label ng-repeat=\"option in internalOptions\"><input type=\"radio\" ng-model=\"$parent.bindingValue\" ng-value=\"option.value\" ng-disabled=\"readonly\">{{option.text}}</label></div>")

$templateCache.put("templates/mcs.select.html","<span><select class=\"form-control\" ng-if=\"!readonly\" ng-model=\"$parent.bindingValue\" ng-options=\"option.value as option.text for option in $parent.internalOptions\"></select> <span ng-if=\"readonly\">{{bindingText || bindingValue}}</span></span>")
}]);
})();