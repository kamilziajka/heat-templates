'use strict';

import Schema from 'schema-js';
import {getPrototypeChain, isString} from './util';

const Component = function (properties) {
  const uid = `${Math.random().toString(36).substr(2, 5)}-${Date.now()}`;

  Object.assign(this, {
    dependencies: [],
    uid,
    properties
  });
};

Component.prototype.getResources = function () {
  return {};
};

Component.prototype.getSchema = function () {
  return new Schema({
    id: {
      type: String,
      required: true
    }
  });
};

Component.prototype.getMergedSchema = function () {
  const prototypes = getPrototypeChain(this);

  return prototypes
    .map(prototype => this::prototype.getSchema())
    .reverse()
    .reduce((current, next) => current.extend(next));
};

Component.prototype.validateProperties = function () {
  const schema = this.getMergedSchema();
  schema.validate(this.properties);
};

Component.prototype.getDependencies = function () {
  return this.dependencies;
};

Component.prototype.flattenTree = function (visited = new Set()) {
  const {uid} = this;

  if (visited.has(uid)) {
    return [];
  }

  visited.add(uid);
  this.validateProperties();

  const components = this.getDependencies()
    .filter(component => !isString(component))
    .map(component => component.flattenTree(visited))
    .reduce((current, next) => [...current, ...next], []);

  return [this, ...components];
};

Component.prototype.compose = function () {
  const components = this.flattenTree();

  const resources = components
    .map(component => component.getResources())
    .reduce((current, next) => Object.assign(current, next), {});

  return resources;
};

Component.resolve = function (component) {
  return isString(component) ? component : {
    get_resource: component.properties.id
  };
};

export default Component;
