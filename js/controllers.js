'use strict';

/* Controllers */

var nasa_url = "https://api.nasa.gov/planetary/earth/imagery";
var api_key = "NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo";

/*var url = ?
lon=100.75
lat=1.5
date=2014-02-01
cloud_score=True
api_key="DEMO_KEY"*/

var nasa_earthview_controllers =
    angular.module('nasa_earthview_controllers', []);

function set_image_url(deps, get_response) {
    deps.scope.date = get_response["date"];
    deps.scope.image_url = get_response["url"];
    deps.scope.cloudiness = get_response["cloud_score"];
}

function get_image_url(deps, longitude, latitude, date)
{
    var params = {
        lon: longitude,
        lat: latitude,
        date: date,
        cloud_score: "TRUE",
        api_key: api_key,
    }
    deps.http({
        url: nasa_url,
        method: 'GET',
        params: params
    })
    .success(function(data) {
        set_image_url(deps, data);
    })
    .error(function(err, err2) {
        alert("" + err + " " + err2);
    });
}


nasa_earthview_controllers.controller('DisplayImage',
    ['$scope', '$http', '$routeParams', '$location',
    function($scope, $http, $routeParams, $location) {
        $scope.data = $routeParams;
        var longitude = $routeParams.longitude;
        var latitude = $routeParams.latitude;
        var date = $routeParams.date;

        $scope.redirect_back = function() {
            $location.url('/coords/' + longitude + '/' + latitude + '/' + date);
        };

        get_image_url({http:$http, loc:$location, scope:$scope},
            longitude, latitude, date);
}]);

/**
 * Returns an array with the elements as strings from start to end in steps of 1
 * elements are filled with zeros if < 10
 */
function fromTo(start, end, padding) {
    var arr = [];
    var i = start;
    while(i<=end) {
        if(i < 10)
            arr[arr.length] = "0" + i;
        else
            arr[arr.length] = "" + i;
        i = i+1;
    }
    return arr;
}

nasa_earthview_controllers.controller('InputCoordinates',
    ['$scope', '$location', '$routeParams',
    function($scope, $location, $routeParams) {
        $scope.years = fromTo(2014,2016);
        $scope.months = fromTo(1,12);
        $scope.days = fromTo(1,31);

        $scope.year = "2014";
        $scope.month = "02";
        $scope.day = "01";

        $scope.longitude = $routeParams.pre_longi;
        $scope.latitude = $routeParams.pre_lati;
        console.log($routeParams.pre_date);

        $scope.show_earth_at = function(longi, lati) {
            $location.url('/earth_view/' + longi + '/' + lati + '/' +
                $scope.year + '-' + $scope.month + '-' + $scope.day);
        };
}]);
