/**
 * Created by Mike on 12/19/13. MIT License.

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

      object.$insertByLoc = function (latLon, data) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.insertByLoc(latLon, data, function (error) {
            if (!error) {
              deferred.resolve(null);
            } else {
              deferred.reject(error);
            }
          });
        });
        return deferred.promise;
      };

      object.$insertByLocWithId = function (latLon, id, data) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.insertByLocWithId(latLon, id, data, function (error) {
            if (!error) {
              deferred.resolve(null);
            } else {
              deferred.reject(error);
            }
          });
        });
        return deferred.promise;
      };

      object.$removeById = function (id) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.removeById(id, function (error) {
            if (!error) {
              deferred.resolve(null);
            } else {
              deferred.reject(error);
            }
          });
        });
        return deferred.promise;
      };

      object.$getLocById = function (id) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.getLocById(id, function (latLon) {
            if (latLon) {
              deferred.resolve(latLon);
            } else {
              deferred.reject(null);
            }
          });
        });
        return deferred.promise;
      };

      object.$updateLocForId = function (latLon, id) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.updateLocForId(latLon, id, function (error) {
            if (!error) {
              deferred.resolve(null);
            } else {
              deferred.reject(error);
            }
          });
        });
        return deferred.promise;
      };

      object.$getPointsNearLoc = function (latLon, radius) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.getPointsNearLoc(latLon, radius, function (array) {
            deferred.resolve(array);
          });
        });
        return deferred.promise;
      };


      object.$onPointsNearLoc = function (latLon, radius, broadcastName) {
        self._onPointsNearLocCallbacks[broadcastName] = function(array) {
          self._rootScope.$broadcast(broadcastName, latLon, radius, array);
        };

        self._timeout(function () {
          self._geoFire.onPointsNearLoc(latLon, radius, self._onPointsNearLocCallbacks[broadcastName]);
        });
      };

      object.$offPointsNearLoc = function (latLon, radius, broadcastName) {
        if(self._onPointsNearLocCallbacks[broadcastName]) {
          self._geoFire.offPointsNearLoc(latLon, radius, self._onPointsNearLocCallbacks[broadcastName]);
          delete self._onPointsNearLocCallbacks[broadcastName];
        }
      };

      object.$getPointsNearId = function (id, radius) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.getPointsNearId(id, radius, function (array) {
            deferred.resolve(array);
          });
        });
        return deferred.promise;
      };


      object.$onPointsNearId = function (id, radius, broadcastName) {
        self._onPointsNearId[broadcastName] = function(array) {
          self._rootScope.$broadcast(broadcastName, id, radius, array);
        };
        self._timeout(function () {
          self._geoFire.onPointsNearId(id, radius, self._onPointsNearId[broadcastName]);
        });
      };

      object.$offPointsNearId = function (id, radius, broadcastName) {
        if(self._onPointsNearId[broadcastName]) {
          self._geoFire.offPointsNearId(id, radius, self._onPointsNearId[broadcastName]);
          delete self._onPointsNearId[broadcastName];
        }
      };

      object.$encode = function (latLon, precision) {
        return self._geoFire.encode(latLon, precision);
      };
      object.$decode = function (geohash) {
        return self._geoFire.decode(geohash);
      };
      object.$miles2km = function (miles) {
        return self._geoFire.miles2km(miles);
      };
      object.$km2miles = function (km) {
        return self._geoFire.km2miles(km);
      };

      self._object = object;
      return self._object;

    }
  };


}).call(this);
