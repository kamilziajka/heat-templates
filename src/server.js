'use strict';

import Component from './component';
import VolumeAttachment from './volume-attachment';
import Port from './port';
import {isString} from './util';

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
    id: `${isString(volume) ? volume : volume.properties.id}-attachment`,
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
    name: {
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
    keyPair: {
      type: String
    },
    ports: {
      type: Array,
      items: [String, Port]
    }
  };
};

Server.prototype.getResources = function () {
  const {
    id, zone, name, flavor,
    keyPair, image, ports
  } = this.properties;

  const networks = ports.map(port => ({
    port: Component.resolve(port)
  }));

  const properties = {
    flavor,
    image
  };

  Object.assign(
    properties,
    name ? {name} : {},
    zone ? {zone} : {},
    keyPair ? {key_name: keyPair} : {},
    networks.length ? {networks} : {}
  );

  return {
    [id]: {
      type: 'OS::Nova::Server',
      properties
    }
  };
};

export default Server;
