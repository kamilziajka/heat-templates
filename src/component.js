'use strict';

import Schema from 'schema-js';
import {getPrototypeChain} from './util';

const Component = function (properties) {
  Object.assign(this, {
    dependencies: [],
    properties
  });
};

Component.prototype.getResources = function () {
  const {name} = this.properties;
  return {[name]: {}};
};

Component.prototype.getSchema = function () {
  return {
    name: {
      type: String,
      required: true
    }
  };
};

Component.prototype.getMergedSchema = function () {
  const prototypes = getPrototypeChain(this);

  const schema = prototypes
    .map(prototype => this::prototype.getSchema())
    .reduce((current, next) => Object.assign(current, next));

  return new Schema(schema);
};

Component.prototype.validateProperties = function () {
  const schema = this.getMergedSchema();
  schema.validate(this.properties);
};

Component.prototype.flattenTree = function () {
  const {dependencies} = this;

  const components = dependencies
    .map(component => component.flattenTree())
    .reduce((current, next) => [...current, ...next], []);

  return [this, ...components];
};

Component.prototype.compose = function () {
  const components = this.flattenTree();

  components.forEach((component) => {
    component.validateProperties();
  });

  const resources = components
    .map(component => component.getResources())
    .reduce((current, next) => Object.assign(current, next), {});

  return resources;
};

Component.createResourceResolver = (component) => ({
  get_resource: component.properties.name
});

Component.createParameterResolver = (parameter) => ({
  get_param: parameter
});

export default Component;
