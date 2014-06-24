AngularGeoFire
==============

Angular service wrapping the [GeoFire](https://www.firebase.com/blog/2013-09-25-location-queries-geofire.html) geospatial lib for [Firebase](https://www.firebase.com/).

[![Build Status](https://travis-ci.org/mikepugh/AngularGeoFire.svg?branch=v2)](https://travis-ci.org/mikepugh/AngularGeoFire) [![Coverage Status](https://coveralls.io/repos/mikepugh/AngularGeoFire/badge.png)](https://coveralls.io/r/mikepugh/AngularGeoFire) [![Bower version](https://badge.fury.io/bo/angularGeoFire.svg)](http://badge.fury.io/bo/angularGeoFire)

Usage
-----
````
bower install angularGeoFire
````

In your app, include the Firebase and GeoFire libraries (technically AngularGeoFire doesn't depend on AngularFire but you'll probably want to use it).

````
<script src="//cdn.firebase.com/js/client/1.0.17/firebase.js"></script>
<script src="bower_components/rsvp/rsvp.min.js"></script>
<script src="bower_components/angularfire/angularfire.js"></script>
<script src="bower_components/geofire/dist/geofire.min.js"></script>
<script src="bower_components/AngularGeoFire/dist/angularGeoFire.js"></script>
````

Include angularGeoFire.min.js and then include it in your app dependency. The API matches that of geoFire @ https://github.com/firebase/geoFire, just prefix the method calls with a $ (ex: $geoFire.$set). AngularGeoFire translates GeoFire's RSVP promises into Angular $q service promises. The GeoFire "on" events are translated into Angular broadcasts to be consumed anywhere in your app.


````javascript
angular.module('yourApp', ['angularGeoFire']);
````

Then you can reference the dependency in your services or controllers

````javascript

angular.module('yourApp')
  .controller('SomeCtrl', function($scope, $geofire, $log) {
    $scope.searchResults = [];

    var $geo = $geofire(new Firebase('https://<<your-firebase>>.firebaseio.com/'));

    // Trivial example of inserting some data and querying data
    $geo.$set("some_key", [37.771393,-122.447104])
        .catch(function(err) {
            $log.error(err);
        });

    // Get some_key's location, place it on $scope
    $geo.$get("some_key")
        .then(function (location) {
            $scope.objLocation = location;
        });

    // Remove "some_key" location from forge
    $geo.$remove("some_key")
        .catch(function (err) {
            $log.error(err);
        });


    // Setup a GeoQuery
    var query = $geo.$query({
        center: [37.77, -122.447],
        radius: 20
    });

    // Setup Angular Broadcast event for when an object enters our query
    var geoQueryCallback = query.on("key_entered", "SEARCH:KEY_ENTERED");

    // Listen for Angular Broadcast
    $rootScope.$on("SEARCH:KEY_ENTERED", function (event, key, location, distance) {
        // Do something interesting with object
        $scope.searchResults.push({key: key, location: location, distance: distance});

        // Cancel the query if the distance is > 5 km
        if(distance > 5) {
            geoQueryCallback.cancel();
        }
    });

    // See geofire documentation for other on("..") events available







  });

````

Contribute
----------
[![Hack mikepugh/angularGeoFire on Nitrous.IO](https://d3o0mnbgv6k92a.cloudfront.net/assets/hack-l-v1-3cc067e71372f6045e1949af9d96095b.png)](https://www.nitrous.io/hack_button?source=embed&runtime=nodejs&repo=mikepugh%2FangularGeoFire)

License
-------
MIT
