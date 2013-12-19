AngularGeoFire
==============

Angular service wrapping the GeoFire geospatial lib for Firebase.

Usage
-----
Be sure to include firebase and geoFire libraries.

Include angularGeoFire.js and then include it in your app dependency. The API matches that of geoFire @ https://github.com/firebase/geoFire, just prefix the method calls with a $ (ex: $geoFire.$getPointsNearLoc)

````javascript
angular.module('yourApp', ['angularGeoFire']);
````

Then you can reference the dependency in your services or controllers

````javascript

angular.module('yourApp')
  .controller('SomeCtrl', function($scope, $geoFire, $log) {
    var geo = $geofire(new Firebase('https://<<your-firebase>>.firebaseio.com/'));
    var someObj = { id: "some-key", make: "Tesla" };
    // Trivial example of inserting some data and then immediately querying it
    geo.$insertByLocWithId([37.771393,-122.447104], someObj.id, someObj)
      .then(function() {
        // Now that the data is inserted - go ahead and query it
        geo.$getPointsNearLoc([37.771393,-122.447104],5)
          .then(function(array) {
            $scope.myPoints = array;
          });
      })
      .catch(function(err) { $log.error(err); });
  });
  
````
