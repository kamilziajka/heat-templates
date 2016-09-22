'use strict';

import Component from './component';

const VolumeAttachment = function (...args) {
  if (!(this instanceof VolumeAttachment)) {
    return new VolumeAttachment(...args);
  }

  Component.call(this, ...args);
};

VolumeAttachment.prototype = Object.create(Component.prototype);
VolumeAttachment.prototype.constructor = VolumeAttachment;

VolumeAttachment.prototype.getTemplates = () => ({
  name: ({name}) => name,
  type: 'OS::Cinder::VolumeAttachment',
  properties: {
    availability_zone: {
      type: 'string',
      required: false,
      value: ({properties: {zone}}) => zone
    },
    volume_id: {
      value: (obj) => ({get_resource: obj.properties.volume.name})
    },
    instance_id: {
      value: (obj) => ({get_resource: obj.properties.server.name})
    },
    mountpoint: {
      type: 'string',
      required: 'true',
      value: ({properties: {mountPoint}}) => mountPoint
    }
  }
});

export default VolumeAttachment;
