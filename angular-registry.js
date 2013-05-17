'use strict';
angular.module('johannestroeger.registry', []).provider('$registry', function () {
  var register = {};
  var defaults = {};
  var cacheLimit = 100;
  this.defaults = function (obj) {
    angular.extend(defaults, obj);
    angular.extend(register, angular.copy(defaults));
  };
  this.cacheLimit = function (limit) {
    cacheLimit = limit;
  };
  this.$get = [
    '$parse',
    '$cacheFactory',
    function ($parse, $cacheFactory) {
      var cache = $cacheFactory('johannestroeger.registry', { capacity: cacheLimit });
      var fnCache = function (exp) {
        if (!cache.get(exp)) {
          cache.put(exp, $parse(exp));
        }
        return cache.get(exp);
      };
      var registry = function (root, exp, value, del) {
        if (!exp) {
          return root;
        }
        var getter = fnCache(exp);
        if (value || del) {
          return getter.assign(root, value);
        }
        return getter(root);
      };
      return {
        set: function (exp, value) {
          return registry(register, exp, value);
        },
        get: function (exp) {
          return registry(register, exp);
        },
        del: function (exp) {
          return registry(register, exp, undefined, true);
        },
        reset: function (exp) {
          if (exp) {
            return registry(register, exp, registry(defaults, exp));
          }
          register = {};
          return angular.extend(register, defaults);
        }
      };
    }
  ];
});