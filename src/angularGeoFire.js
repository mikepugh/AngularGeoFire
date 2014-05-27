/**
 * Created by Mike Pugh on 05/27/2014. MIT License.

 */

(function () {
  'use strict';

  var AngularGeoFire;

  angular.module('angularGeoFire', [])
    .factory('$geofire', function ($q, $timeout, $rootScope, $log) {
      return function (geoRef) {
        $log.info('Constructing $geofire');
        var gf = new AngularGeoFire($q, $timeout, $rootScope, geoRef);
        return gf.construct();
      };
    }
  );

  AngularGeoFire = function ($q, $timeout, $rootScope, geoRef) {
    this._q = $q;
    this._rootScope = $rootScope;
    this._timeout = $timeout;
    if (typeof geoRef === 'string') {
      throw new Error('Please provide a Firebase reference instead of a URL');
    }
    this._geoRef = geoRef;
    this._geoFire = new geoFire(this._geoRef);
    this._onPointsNearLocCallbacks = [];
    this._onPointsNearId = [];
  };

  AngularGeoFire.prototype = {
    construct: function () {
      var self = this;
      var object = {};

	    object.$set = function(key, location) {
		    var deferred = self._q.defer();
		    self._timeout(function () {
			    self._geoFire.set(key, location)
				    .then(function() {
				      deferred.resolve(null);
			      })
				    .catch(function (error) {
					    deferred.reject(error);
				    });
		    });
		    return deferred.promise;
	    };



      object.$remove = function (key) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.remove(key)
	          .then(function() {
		          deferred.resolve(null);
	          })
	          .catch(function(error) {
		          deferred.reject(error);
	          });
        });
        return deferred.promise;
      };

      object.$get = function (key) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.get(key)
	          .then(function(location) {
		          deferred.resolve(location);
	          })
	          .catch(function(error) {
		          deferred.reject(error);
	          });
        });
        return deferred.promise;
      };

	    object.$query = function(queryCriteria) {
		    var _geoQuery = self._geoFire.query(queryCriteria);
		    return {
			    getCenter: function() {
				    return _geoQuery.getCenter();
			    },
			    getRadius: function() {
				    return _geoQuery.getRadius();
			    },
			    updateQueryCriteria: function(newQueryCriteria) {
				    _geoQuery.updateQueryCriteria(newQueryCriteria);
			    },
			    getResults: function() {
				    var deferred = self._q.defer();
				    _geoQuery.getResults()
					    .then(function(results) {
						    deferred.resolve(results);
					    })
					    .catch(function(error) {
						    deferred.reject(error);
					    });
				    return deferred.promise;
			    },
			    on: function(eventType, broadcastName) {
				    return _geoQuery.on(eventType, function(key, location) {
					    self._rootScope.$broadcast(broadcastName, key, location);
				    })
			    },
			    cancel: function() {
				    _geoQuery.cancel();
			    }
		    }

	    };

	    /**
	     * Calculate the distance between two points on a globe, via Haversine
	     * formula, in kilometers. This is approximate due to the nature of the
	     * Earth's radius varying between 6356.752 km through 6378.137 km.
	     */
	    object.$dist = function(loc1, loc2) {
		    var lat1 = loc1[0],
			    lon1 = loc1[1],
			    lat2 = loc2[0],
			    lon2 = loc2[1];

		    var radius = 6371, // km
			    dlat = deg2rad(lat2 - lat1),
			    dlon = deg2rad(lon2 - lon1),
			    a, c;

		    a = Math.sin(dlat / 2) * Math.sin(dlat / 2) +
			    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			    Math.sin(dlon / 2) * Math.sin(dlon / 2);

		    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		    return radius * c;
	    }


      self._object = object;
      return self._object;

    }
  };


}).call(this);
