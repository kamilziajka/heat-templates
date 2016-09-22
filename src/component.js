'use strict';

import Schema from 'validate';
import {toPairs, mapValues, pick, pickBy} from 'lodash';

const Component = function (name = '', properties = {}) {
  Object.assign(this, {dependencies: [], name, properties});
};

Component.prototype.getResources = function () {
  const templates = [].concat(this.templates);
  return templates.map(template => this.parseTemplate(template));
};

Component.prototype.parseTemplate = function (template) {
  const {properties} = template;

  const schema = Component.getSchema(properties);
  const values = Component.getValues(properties, this);
  const errors = schema.validate(values);

  if (errors.length) {
    throw this.createError(`Incorrect param: ${errors[0].message}`);
  }

  const {type} = template;
  const name = template.name(this);

  return {[name]: {type, properties: values}};
};

Component.prototype.flattenTree = function () {
  return [this, ...this.dependencies];
};

Component.prototype.createError = (message) => {
  return new Error(`component ${this} error: ${message}`);
};

Component.parseProperties = (reducer) => (properties) => {
  const pairs = toPairs(properties);
  return pairs.reduce(reducer, {});
};

Component.getSchema = (properties) => {
  const keys = ['type', 'required', 'message', 'match'];

  const reducer = (schema, [key, value]) => {
    const params = pick(value, keys);
    return {...schema, [key]: params};
  };

  return Schema(Component.parseProperties(reducer)(properties));
};

Component.getValues = (properties, component) => {
  const reducer = (properties, [name, property]) => {
    const {value} = property;
    return {...properties, [name]: value};
  };

  const resolvers = Component.parseProperties(reducer)(properties);
  const values = mapValues(resolvers, resolver => resolver(component));
  return pickBy(values, value => !!value);
};

export default Component;
