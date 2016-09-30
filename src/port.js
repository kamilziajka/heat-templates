'use strict';

import Component from './component';
import FloatingIP from './floating-ip';

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

Port.prototype.attachFloatingIP = function (floatingIP) {
  if (floatingIP instanceof FloatingIP) {
    floatingIP.properties.port = this;
    this.dependencies.push(floatingIP);
  }
  return this;
};

Port.prototype.getSchema = function () {
  return {
    network: {
      type: String,
      required: true
    },
    subnetwork: {
      type: String,
      required: true
    },
    securityGroups: [String]
  };
};

Port.prototype.getResources = function () {
  const {id, network, subnetwork, securityGroups} = this.properties;

  const properties = {
    network,
    fixed_ips: [{subnet: subnetwork}]
  };

  Object.assign(
    properties,
    securityGroups.length ? {security_groups: securityGroups} : {}
  );

  return {
    [id]: {
      type: 'OS::Neutron::Port',
      properties
    }
  };
};

export default Port;
