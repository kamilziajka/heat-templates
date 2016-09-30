'use strict';

import Component from './component';

const Network = function (properties) {
  if (!(this instanceof Network)) {
    return new Network(properties);
  }

  Component.call(this, properties);
};

Network.prototype = Object.create(Component.prototype);
Network.prototype.constructor = Network;

Network.prototype.getSchema = function () {
  return {
    name: String
  };
};

Network.prototype.getResources = function () {
  const {id, name} = this.properties;

  const resource = {
    type: 'OS::Neutron::Net'
  };

  Object.assign(resource, name ? {properties: {name}} : {});

  return {[id]: resource};
};

export default Network;
