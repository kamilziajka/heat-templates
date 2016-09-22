'use strict';

import Yaml from 'js-yaml';

const Template = function (...args) {
  if (!(this instanceof Template)) {
    return new Template(...args);
  }

  const version = args[0] || '2015-04-30';
  const description = args[1];

  Object.assign(this, {version, description});
  this.components = [];
};

Template.prototype.add = function (component) {
  this.components.push(component);
  return this;
};

Template.prototype.toHeat = function () {
  const {version, description, components} = this;

  const heat = {version};

  if (description && description.length) {
    heat.description = description;
  }

  heat.resources = components
    .map(component => component.getResources())
    .reduce((current, next) => current.concat(next), [])
    .reduce((current, next) => ({...current, ...next}), {});

  return heat;
};

Template.prototype.toJSON = function () {
  return JSON.stringify(this.toHeat(), null, 2);
};

Template.prototype.printJSON = function () {
  console.log(this.toJSON());
  return this;
};

Template.prototype.toYAML = function () {
  return Yaml.dump(this.toHeat());
};

Template.prototype.printYAML = function () {
  console.log(this.toYAML());
  return this;
};

export default Template;
