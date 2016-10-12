'use strict';

import Yaml from 'js-yaml';
import Component from './component';

const Template = function (...args) {
  if (!(this instanceof Template)) {
    return new Template(...args);
  }

  Object.assign(this, {
    components: [],
    version: args[0] || '2015-04-30',
    description: args[1]
  });
};

Template.prototype.add = function (...args) {
  const getValues = (obj) => Object.keys(obj).map(key => obj[key]);

  const flatten = (obj) => {
    const components = Array.isArray(obj) ? obj : getValues(obj);

    return components
      .map(component => (component instanceof Component) ? component : flatten(component))
      .reduce((current, next) => [...current, ...[].concat(next)], [])
      .filter(component => (component instanceof Component));
  };

  this.components.push(...flatten(args));

  return this;
};

Template.prototype.toHeat = function () {
  const {version, description, components} = this;

  const heat = {
    heat_template_version: version
  };

  if (description && description.length) {
    heat.description = description;
  }

  heat.resources = components
    .map(component => component.compose())
    .reduce((current, next) => Object.assign(current, next));

  return heat;
};

Template.prototype.toJSON = function () {
  return JSON.stringify(this.toHeat(), null, 2);
};

Template.prototype.printJSON = function () {
  console.log(this.toJSON());
  return this;
};

Template.prototype.toYAML = function (options = {}) {
  return Yaml.dump(this.toHeat(), options);
};

Template.prototype.printYAML = function (options = {}) {
  console.log(this.toYAML(options));
  return this;
};

export default Template;
