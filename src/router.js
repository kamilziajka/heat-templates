'use strict';

import Component from './component';
import Network from './network';

const Router = function (properties) {
  if (!(this instanceof Router)) {
    return new Router(properties);
  }

  Component.call(this, properties);
};

Router.prototype = Object.create(Component.prototype);
Router.prototype.constructor = Router;

Router.prototype.getSchema = function () {
  return {
    network: {
      type: [String, Network],
      required: true
    },
    name: String
  };
};

Router.prototype.getDependencies = function () {
  return [
    ...this.dependencies,
    this.properties.network
  ]
};

Router.prototype.getResources = function () {
  const {id, network, name} = this.properties;

  const properties = {
    external_gateway_info: {
      network: Component.resolve(network)
    }
  };

  Object.assign(properties, name ? {name} : {});

  return {
    [id]: {
      type: 'OS::Neutron::Router',
      properties
    }
  };
};

export default Router;
