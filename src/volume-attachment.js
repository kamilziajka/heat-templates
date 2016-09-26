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
      type: [String, Volume],
      required: true
    },
    server: {
      type: [String, Server],
      required: true
    }
  };
};

VolumeAttachment.prototype.getResources = function () {
  const {
    id, volume,
    server, mountPoint
  } = this.properties;

  const resource = {
    type: 'OS::Cinder::VolumeAttachment',
    properties: {
      volume_id: Component.resolve(volume),
      instance_uuid: Component.resolve(server),
      mountpoint: mountPoint
    }
  };

  return {[id]: resource};
};

export default VolumeAttachment;
