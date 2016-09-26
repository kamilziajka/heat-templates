'use strict';

import Component from './component';

const Port = function (properties) {
  if (!(this instanceof Port)) {
    return new Port(properties);
  }

  Component.call(this, {
    securityGroups: [],
    ...properties
  });
};

Port.prototype = Object.create(Component.prototype);
Port.prototype.constructor = Port;

Port.prototype.getSchema = function () {
  return {
    networkId: {
      type: String,
      required: true
    },
    subnetId: {
      type: String,
      required: true
    },
    securityGroups: {
      type: Array,
      items: {
        type: String
      }
    }
  };
};

Port.prototype.getResources = function () {
  const {
    name, networkId,
    subnetId, securityGroups
  } = this.properties;

  const resource = {
    type: 'OS::Neutron::Port',
    properties: {
      network_id: networkId,
      fixed_ips: [{subnet_id: subnetId}],
      security_groups: securityGroups
    }
  };

  return {[name]: resource};
};

export default Port;
