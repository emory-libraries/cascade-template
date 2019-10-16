// Load dependencies.
const _ = require('lodash');
const kind = require('kind-of');

// Register utility helpers.
module.exports = {

  // Get the value's native type.
  kindOf: ( value ) => kind(value),

  // Save one or more values to an existing breadcrumb trail.
  breadcrumb( ...breadcrumbs ) {

    // Remove options from the list of breadcrumbs.
    breadcrumbs = _.initial(breadcrumbs);

    // Get the current set of breadcrumbs as an array.
    let nesting = _.get(this, 'nesting', '').split('/');

    // Save the breadcrumbs to the current context.
    nesting = _.concat(nesting, ...breadcrumbs);

    // Return the formatted breadcrumb trail.
    return nesting.join('/');

  },

  // Determine if some value includes a given value.
  includes( value, comp ) {

    // For strings, compare the two values.
    if( _.isString(comp) ) return value === comp;

    // For arrays, see if the value is included.
    if( _.isArray(comp) ) return comp.includes(value);

    // For objects, see if the value matches a key.
    if( _.isPlainObject(comp) ) return comp.hasOwnProperty(value);

    // Otherwise, assume it's not included.
    return false;

  },

  // Return the value of the given variable.
  valueOf: ( value ) => value

};
