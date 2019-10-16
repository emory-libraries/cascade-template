// Load dependencies.
const _ = require('lodash');

// Export helpers.
module.exports = {

  concat( base, ...values ) {

    // Remove options from the list of values.
    values = _.initial(values);

    // Handle string concatenations.
    if( _.isString(base) ) return base + _.reduce(values, (result, value) => result += value, '');

    // Otherwise, handle array concatenations.
    if( _.isArray(base) ) return _.concat(base, ...values);

    // Otherwise, return the base value without concatenating.
    return base;

  }

};
