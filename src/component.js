'use strict';

import Schema from 'validate';

const Component = function (name = '', properties = {}) {
  Object.assign(this, {
    dependencies: [],
    name,
    properties
  });
};

Component.prototype.getResources = function () {
  const {templates} = this;

  return [].concat(templates).map((template) => {
    const schema = {};
    const properties = {};

    Object
      .keys(template.properties)
      .forEach((key) => {
        const {type, required, value: resolveValue} = template.properties[key];

        schema[key] = {type, required};
        properties[key] = resolveValue(this);
      });

    const {name: resolveName, type} = template;
    const name = resolveName(this);
    const errors = Schema(schema).validate(properties);

    if (errors.length) {
      throw new Error(
        `Incorrect parameter value for component ${name}: ` +
        `${errors[0].message}.`
      );
    }

    return {
      [name]: {type, properties}
    }
  });
};

Component.prototype.flattenTree = function () {
  return [this, ...this.dependencies];
};

export default Component;
