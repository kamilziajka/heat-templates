'use strict';

import Component from './component';

const Port = function (properties) {
  if (!(this instanceof Port)) {
    return new Port(properties);
  }

  Component.call(this, properties);
};

Port.prototype = Object.create(Component.prototype);
Port.prototype.constructor = Port;

Port.prototype.getTemplates = () => ({
  name: ({name}) => name,
  type: 'OS::Neutron::Port',
  properties: {
    name: {
      type: 'string',
      required: true,
      value: ({name}) => name
    },
    network_id: {
      value: (obj) => ({get_param: obj.properties.network.id})
    },
    fixed_ips: {
      value: (obj) => obj.properties.subnets.map((subnet) => ({
        subnet_id: {get_param: subnet}
      }))
    }
  }
});

Port.prototype.getSchema = function () {
  return {
    networkId: {
      type: String,
      required: true
    },
    subnetId: {
      type: String,
      required: true
    }
  };
};

Port.prototype.getResources = function () {
  const {name, networkId, subnetId} = this.properties;

  const resource = {
    type: 'OS::Neutron::Port',
    properties: {
      network_id: networkId,
      fixed_ips: [{subnet_id: subnetId}]
    }
  };

  return {[name]: resource};
};

export default Port;
