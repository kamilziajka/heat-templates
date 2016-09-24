'use strict';

import Component from './component';
import Volume from './volume';
import Server from './server';

const VolumeAttachment = function (properties) {
  if (!(this instanceof VolumeAttachment)) {
    return new VolumeAttachment(properties);
  }

  Component.call(this, properties);
};

VolumeAttachment.prototype = Object.create(Component.prototype);
VolumeAttachment.prototype.constructor = VolumeAttachment;

VolumeAttachment.prototype.getDependencies = function () {
  return [
    ...this.dependencies,
    this.properties.volume,
    this.properties.server
  ];
};

VolumeAttachment.prototype.getSchema = function () {
  return {
    mountPoint: {
      type: String,
      required: true
    },
    volume: {
      type: Volume,
      required: true
    },
    server: {
      type: Server,
      required: true
    }
  };
};

VolumeAttachment.prototype.getResources = function () {
  const {name, volume, server, mountPoint} = this.properties;

  const resource = {
    type: 'OS::Cinder::VolumeAttachment',
    properties: {
      volume_id: volume.getId(),
      instance_uuid: server.getId(),
      mountpoint: mountPoint
    }
  };

  return {[name]: resource};
};

export default VolumeAttachment;
