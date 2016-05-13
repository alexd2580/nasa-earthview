'use strict';

/* App Module */

var nasa_earthview_app = angular.module('nasa_earthview_app',
    ['ngRoute', 'nasa_earthview_controllers']);

nasa_earthview_app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/coords/:pre_longi/:pre_lati/:pre_date', {
                templateUrl: 'partials/coord_input.html',
                controller: 'InputCoordinates'
            })
            .when('/earth_view/:longitude/:latitude/:date', {
                templateUrl: 'partials/earth_view.html',
                controller: 'DisplayImage'
            })
            .otherwise({
                redirectTo: '/coords/30.316778/59.949737'
            });
}]);
