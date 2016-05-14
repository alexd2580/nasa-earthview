'use strict';

/* App Module */

var nasa_earthview_app = angular.module('nasa_earthview_app',
    ['ngRoute', 'nasa_earthview_controllers']);

nasa_earthview_app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/coords', {
                redirectTo: '/coords/30.316778/59.949737/2014-02-01'
            })
            .when('/coords/:pre_longi/:pre_lati/:pre_date', {
                templateUrl: 'partials/coord_input.html',
                controller: 'InputCoordinates'
            })
            .when('/earth_view/:longitude/:latitude/:date', {
                templateUrl: 'partials/earth_view.html',
                controller: 'DisplayImage'
            })
            .when('/future_features', {
                templateUrl: 'partials/future_features.html',
                controller: 'FutureFeatures'
            })
            .when('/nasa_earthview', {
                templateUrl: 'partials/nasa_earthview.html',
                controller: 'NasaEarthview'
            })
            .otherwise({
                redirectTo: '/nasa_earthview'
            });
}]);
