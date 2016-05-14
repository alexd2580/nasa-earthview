'use strict';

/**
 * The base URL to get images from space
 */
var nasa_url = "https://api.nasa.gov/planetary/earth/imagery";

/**
 * The api key to be supplied with each request, registered to
 * dmitrieva12@freenet.de
 */
var api_key = "NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";

/* Controllers */

/**
 * The controllers for the views
 */
var nasa_earthview_controllers =
    angular.module('nasa_earthview_controllers', []);

/**
 * @param $scope {injected dependency} The scope where to insert the image.
 */
function set_next_image($scope) {
    $scope.image_found = true;
    $scope.better_image_found = false;

    var image_info = $scope.next_image;
    $scope.searched_date = image_info.searched_date;
    $scope.date = image_info.got_date;
    $scope.image_url = image_info.url;
    $scope.cloudiness = image_info.cloud_score;
}

function format_date(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day;
}

function parse_date(str) {
    if (str) {
        var arr = str.split("-");
        if (arr.size < 3)
            return new Date();
        var d = new Date(arr[0], arr[1] - 1, arr[2]);
        return d ? d : new Date();
    }
    return new Date();
}

var cloud_tresh = 0.3;

/**
 * Performs an http request to nasa.gov to get the image at longitude, latitude at date.
 * if cloudiness is above cloud_tresh, advance one day and retry.
 *
 * @param deps {injected dependencies}
 * @param longitude {float}
 * @param latitude {float}
 * @param date {Date}
 */
function get_image_url(deps, longitude, latitude, date) {
    var params = {
        lon: longitude,
        lat: latitude,
        date: format_date(date),
        cloud_score: "TRUE",
        api_key: api_key,
    }

    deps.http({
            url: nasa_url,
            method: 'GET',
            params: params
        })
        .success(function(data) {
            var image_info = {};
            image_info.cloud_score = data["cloud_score"];
            image_info.searched_date = date;
            image_info.got_date = data["date"];
            image_info.url = data["url"];
            deps.scope.next_image = image_info;

            if (image_info.cloud_score < deps.scope.cloudiness) {
                if (!deps.scope.image_found)
                    set_next_image(deps.scope);
                else {
                    deps.scope.better_image_found = true;
                }
            }

            if (image_info.cloud_score > cloud_tresh) {
                var days = date.getDate();
                // Images taken approx. every 16 days
                date.setDate(days + 16);
                get_image_url(deps, longitude, latitude, date);
            }
        })
        .error(function(err, err2) {
            alert("" + err + " " + err2);
        });
}

/**
 * Controller for the display image view
 */
nasa_earthview_controllers.controller('DisplayImage', ['$scope', '$http', '$routeParams', '$location',
    function($scope, $http, $routeParams, $location) {
        $scope.data = $routeParams;
        $scope.date = "the day before nasa took images from space";
        $scope.cloudiness = 1.0 / 0.0;
        $scope.image_found = false;

        $scope.better_image_found = false;

        var longitude = $routeParams.longitude;
        var latitude = $routeParams.latitude;
        var date = $routeParams.date;

        $scope.redirect_back = function() {
            $location.url('/coords/' + longitude + '/' + latitude + '/' + date);
        };

        $scope.update_image = function() {
            set_next_image($scope);
        }

        get_image_url({
                http: $http,
                loc: $location,
                scope: $scope
            },
            longitude, latitude, parse_date(date));
    }
]);

/**
 * Controller for the display image view
 */
nasa_earthview_controllers.controller('InputCoordinates', ['$scope', '$location', '$routeParams',
    function($scope, $location, $routeParams) {
        TinyDatePicker(document.querySelector('.date_picker'), {
            format: format_date,
            parse: parse_date
        });
        $scope.longitude = $routeParams.pre_longi;
        $scope.latitude = $routeParams.pre_lati;
        $scope.date = $routeParams.pre_date;
        $scope.show_earth_at = function(longi, lati) {
            $location.url('/earth_view/' + longi + '/' + lati + '/' +
                $scope.date);
        };
    }
]);

/**
 * Controller for the "optional future features" view.
 * not much to do though
 */
nasa_earthview_controllers.controller('FutureFeatures', ['$location',
    function($location) {
        // not much to do
    }
]);
