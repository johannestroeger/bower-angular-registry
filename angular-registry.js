'use strict';

/**
 * Angular Registry - A Registry Module for Angular
 *
 */

angular.module('ngRegistry', [])

.provider('$registry', function () {

  var register = {};
  var defaults = {};

  var setObject = function (name, value, context) {

    var parts = name.split('.');
    var prop = parts.pop();

    var obj = getObject(parts, true, context);

    if(angular.isObject(obj)) {
      obj[prop] = value;
      return obj[prop];
    }

    return false;
  };

  var getObject = function (parts, create, context) {

    if(angular.isString(parts)) {
      parts = parts.split('.');
    }

    if(angular.isObject(create)) {
      context = create;
    }

    context = context || {};

    // return complete register
    if(!angular.isDefined(parts)) {
      return context;
    }

    // otherwise loop through context
    for(var i=0; i<parts.length;i++) {
      if(!context.hasOwnProperty(parts[i])) {
        context[parts[i]] = {};
      }
      context = context[parts[i]];
    }

    return context;
  };

  this.defaults = function (obj) {
    defaults = obj;
    register = angular.copy(defaults);
  };

  this.$get = function () {
    return {
      set: function (key, value) {
        return setObject(key, value, register);
      },
      get: function (key) {
        return getObject(key, register);
      },
      del: function (key) {
        return setObject(key, undefined, register);
      },
      reset: function (key) {
        if(!angular.isString(key)) {
          register = angular.copy(defaults);
        } else {
          setObject(key, getObject(key, defaults), register);
        }
        return register;
      }
    };
  };

});
