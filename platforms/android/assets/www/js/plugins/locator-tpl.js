(function(module) {
try { app = angular.module("locator"); }
catch(err) { app = angular.module("locator", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("location-lookup/location-lookup.html",
    "<div class=\"search-box\">\n" +
    "  <location-predictions results=\"results\"></location-predictions>\n" +
    "</div>\n" +
    "\n" +
    "<ul>\n" +
    "\n" +
    "  <!-- Results -->\n" +
    "  <li ng-repeat=\"option in results | limitTo:limitTo\"\n" +
    "    item=\"option\">{{option.description}}<span ng-click=\"pickLocation(option)\">Select</span></li>\n" +
    "  <li ng-if=\"results.length > 0\"\n" +
    "    ng-click=\"clear();\"\n" +
    "    item=\"option\">None of these options</li>\n" +
    "\n" +
    "</ul>");
}]);
})();

(function(module) {
try { app = angular.module("locator"); }
catch(err) { app = angular.module("locator", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("location-picker/location-picker.html",
    "<ul>\n" +
    "\n" +
    "  <!-- Reverse Geocode Results -->\n" +
    "  <li ng-repeat=\"option in options | limitTo:limitTo\"\n" +
    "    item=\"option\">{{option.formatted_address}}<span ng-click=\"pickLocation(option)\">Select</span></li>\n" +
    "\n" +
    "  <!-- Loading -->\n" +
    "  <li ng-if=\"!options\">Loading &hellip;</li>\n" +
    "\n" +
    "</ul>");
}]);
})();
