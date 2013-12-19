/**
 * Created by Mike on 12/19/13.
 */

(function() {
    "use strict";

    var AngularGeoFire;

    angular.module('angularGeoFire', [])
        .factory("$geofire", ["$q", "$timeout",
            , function($q, $timeout) {
                return function(geoRef) {
                    var gf = new AngularGeoFire($q, $timeout, geoRef);
                    return gf.construct();
                };
            }
        ]);

    AngularGeoFire = function($q, $timeout, geoRef) {
        this._q = $q;
        this._timeout = $timeout;
        if(typeof geoRef == "string") {
            throw new Error("Please provide a Firebase reference instead of a URL");
        }
        this._geoRef = geoRef;
        this._geoFire = new geoFire(this._geoRef);
    };

    AngularGeoFire.prototype = {
        construct: function() {
            var self = this;
            var object = {};

            object.$insertByLoc = function(latLon, obj) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.insertByLoc(latLon, obj, function(error) {
                       if(!error) {
                           deferred.resolve();
                       } else {
                           deferred.reject(error);
                       }
                    });
                });
                return deferred.promise;
            };

            object.$insertByLocWithId = function(latLon, id, data) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.insertByLocWithId(latLon, obj, id, function(error) {
                        if(!error) {
                            deferred.resolve();
                        } else {
                            deferred.reject(error);
                        }
                    });
                });
                return deferred.promise;
            };

            object.$removeById = function(id) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.removeById(id, function(error) {
                        if(!error) {
                            deferred.resolve();
                        } else {
                            deferred.reject(error);
                        }
                    });
                });
                return deferred.promise;
            };

            object.$getLocById = function(id) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.getLocById(id, function(latLon) {
                        if(latLon) {
                            deferred.resolve(latLon);
                        } else {
                            deferred.reject();
                        }
                    });
                });
                return deferred.promise;
            };

            object.$updateLocForId = function(latLon, id) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.updateLocForId(latLon, id, function(error) {
                        if(!error) {
                            deferred.resolve();
                        } else {
                            deferred.reject(error);
                        }
                    });
                });
                return deferred.promise;
            };

            object.$getPointsNearLoc = function(latLon, radius) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.getPointsNearLoc(latLon, radius, function(array) {
                        if(!error) {
                            deferred.resolve();
                        } else {
                            deferred.reject(error);
                        }
                    });
                });
                return deferred.promise;
            };
        }
    }


}).call(this);
