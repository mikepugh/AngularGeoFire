/**
 * Created by Mike Pugh on 05/27/2014. MIT License.

 */
(function () {
  'use strict';
  var AngularGeoFire;
  angular.module('angularGeoFire', []).factory('$geofire', [
    '$q',
    '$timeout',
    '$rootScope',
    '$log',
    function ($q, $timeout, $rootScope, $log) {
      return function (geoRef) {
        $log.info('Constructing $geofire');
        var gf = new AngularGeoFire($q, $timeout, $rootScope, geoRef);
        return gf.construct();
      };
    }
  ]);
  AngularGeoFire = function ($q, $timeout, $rootScope, geoRef) {
    this._q = $q;
    this._rootScope = $rootScope;
    this._timeout = $timeout;
    if (typeof geoRef === 'string') {
      throw new Error('Please provide a Firebase reference instead of a URL');
    }
    this._geoRef = geoRef;
    this._geoFire = new GeoFire(this._geoRef);
    this._onPointsNearLocCallbacks = [];
    this._onPointsNearId = [];
  };
  AngularGeoFire.prototype = {
    construct: function () {
      var self = this;
      var object = {};
      object.$set = function (key, location) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.set(key, location).then(function () {
            deferred.resolve(null);
          }).catch(function (error) {
            deferred.reject(error);
          });
        });
        return deferred.promise;
      };
      object.$remove = function (key) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.remove(key).then(function () {
            deferred.resolve(null);
          }).catch(function (error) {
            deferred.reject(error);
          });
        });
        return deferred.promise;
      };
      object.$get = function (key) {
        var deferred = self._q.defer();
        self._timeout(function () {
          self._geoFire.get(key).then(function (location) {
            deferred.resolve(location);
          }).catch(function (error) {
            deferred.reject(error);
          });
        });
        return deferred.promise;
      };
      object.$query = function (queryCriteria) {
        var _geoQuery = self._geoFire.query(queryCriteria);
        return {
          center: function () {
            return _geoQuery.center();
          },
          radius: function () {
            return _geoQuery.radius();
          },
          updateCriteria: function (newQueryCriteria) {
            _geoQuery.updateCriteria(newQueryCriteria);
          },
          on: function (eventType, broadcastName) {
            return _geoQuery.on(eventType, function (key, location, distance) {
              self._rootScope.$broadcast(broadcastName, key, location, distance);
            });
          },
          cancel: function () {
            _geoQuery.cancel();
          }
        };
      };

      object.$distance = function (location1, location2) {
        return self._geoFire.distance(location1, location2);
      };

      self._object = object;
      return self._object;
    }
  };
}.call(this));