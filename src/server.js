'use strict';

import Component from './component';
import VolumeAttachment from './volume-attachment';
import Port from './port';

const Server = function (properties) {
  if (!(this instanceof Server)) {
    return new Server(properties);
  }
  
  Component.call(this, {
    ports: [],
    ...properties
  });
};

Server.prototype = Object.create(Component.prototype);
Server.prototype.constructor = Server;

Server.prototype.getDependencies = function () {
  return [
    ...this.dependencies,
    ...this.properties.ports
  ]
};

Server.prototype.attachVolume = function (volume, mountPoint) {
  const attachment = new VolumeAttachment({
    name: `${volume.properties.name}-attachment`,
    server: this,
    volume,
    mountPoint
  });

  this.dependencies.push(attachment);
  return this;
};

Server.prototype.attachPort = function (port) {
  this.properties.ports.push(port);
  return this;
};

Server.prototype.getSchema = function () {
  return {
    zone: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    flavor: {
      type: String,
      required: true
    },
    ports: {
      type: Array,
      items: {
        type: Port
      }
    }
  };
};

Server.prototype.getResources = function () {
  const {name, zone, flavor, image, ports} = this.properties;

  const properties = {name, flavor, image};

  Object.assign(properties, zone ? {zone} : {});

  Object.assign(properties, !ports.length ? {} : {
    networks: ports.map((port) => ({port: port.getId()}))
  });

  return {
    [name]: {
      type: 'OS::Nova::Server',
      properties
    }
  };
};

export default Server;
