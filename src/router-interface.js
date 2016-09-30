'use strict';

import Component from './component';
import Subnetwork from './subnetwork';
import Router from './router';

const RouterInterface = function (properties) {
  if (!(this instanceof RouterInterface)) {
    return new RouterInterface(properties);
  }

  Component.call(this, properties);
};

RouterInterface.prototype = Object.create(Component.prototype);
RouterInterface.prototype.constructor = RouterInterface;

RouterInterface.prototype.getDependencies = function () {
  return [
    ...this.dependencies,
    this.properties.subnetwork,
    this.properties.router
  ]
};

RouterInterface.prototype.getSchema = function () {
  return {
    subnetwork: {
      type: [String, Subnetwork],
      required: true
    },
    router: {
      type: [String, Router],
      required: true
    }
  };
};

RouterInterface.prototype.getResources = function () {
  const {id, subnetwork, router} = this.properties;

  const properties = {
    subnet: Component.resolve(subnetwork),
    router: Component.resolve(router)
  };

  return {
    [id]: {
      type: 'OS::Neutron::RouterInterface',
      properties
    }
  };
};

export default RouterInterface;
