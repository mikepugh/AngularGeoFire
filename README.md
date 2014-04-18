AngularGeoFire
==============

Angular service wrapping the [GeoFire](https://www.firebase.com/blog/2013-09-25-location-queries-geofire.html) geospatial lib for [Firebase](https://www.firebase.com/).

[![Build Status](https://travis-ci.org/mikepugh/AngularGeoFire.svg?branch=master)](https://travis-ci.org/mikepugh/AngularGeoFire) [![Coverage Status](https://coveralls.io/repos/mikepugh/AngularGeoFire/badge.png)](https://coveralls.io/r/mikepugh/AngularGeoFire) [![Bower version](https://badge.fury.io/bo/angularGeoFire.svg)](http://badge.fury.io/bo/angularGeoFire)

Usage
-----
````
bower install angularGeoFire
````

In your app, include the Firebase and GeoFire libraries (technically AngularGeoFire doesn't depend on AngularFire but you'll probably want to use it). GeoFire stores data redundantly so you'll want to keep the objects you store with it (via $insertByLocWithId method) down to a minimum, preferrably just the id and then you'd use AngularFire to perform a look-up of the object's data using the id queried with GeoFire.

````
<script src="//cdn.firebase.com/v0/firebase.js"></script>
<script src="bower_components/angularfire/angularfire.js"></script>
<script src="bower_components/geoFire/geoFire.js"></script>
<script src="bower_components/AngularGeoFire/dist/angularGeoFire.js"></script>
````

Include angularGeoFire.min.js and then include it in your app dependency. The API matches that of geoFire @ https://github.com/firebase/geoFire, just prefix the method calls with a $ (ex: $geoFire.$getPointsNearLoc). AngularGeoFire returns promises vs geoFire's passing of callbacks, with the exception of the $onPointsNearXX and $offPointsNearXX methods which accept a broadcast name and will broadcast the data from geoFire using the broadcast name passed in.

````javascript
angular.module('yourApp', ['angularGeoFire']);
````

Then you can reference the dependency in your services or controllers

````javascript

angular.module('yourApp')
  .controller('SomeCtrl', function($scope, $geofire, $log) {
    $scope.myPoints = [];
    
    var geo = $geofire(new Firebase('https://<<your-firebase>>.firebaseio.com/'));
    var someObj = { id: "some-key", make: "Tesla" };
    // Trivial example of inserting some data and querying data
    geo.$insertByLocWithId([37.771393,-122.447104], someObj.id, someObj).catch(function(err) { $log.error(err); });
    // Query for data
    geo.$getPointsNearLoc([37.771393,-122.447104],5)
          .then(function(array) {
            $scope.myPoints = array;
          });
  });
  
````

Contribute
----------
[![Hack mikepugh/angularGeoFire on Nitrous.IO](https://d3o0mnbgv6k92a.cloudfront.net/assets/hack-l-v1-3cc067e71372f6045e1949af9d96095b.png)](https://www.nitrous.io/hack_button?source=embed&runtime=nodejs&repo=mikepugh%2FangularGeoFire)

License
-------
MIT
