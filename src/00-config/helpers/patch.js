// Load dependencies.
const _ = require('lodash');

// Register patch helpers.
module.exports = {

  eq: (a, b, options) => options.fn ? (a === b ? options.fn() : options.inverse()) : a === b,
  gte: (a, b, options) => options.fn ? (a >= b ? options.fn() : options.inverse()) : a >= b,
  gt: (a, b, options) => options.fn ? (a > b ? options.fn() : options.inverse()) : a > b,
  lte: (a, b, options) => options.fn ? (a <= b ? options.fn() : options.inverse()) : a <= b,
  lt: (a, b, options) => options.fn ? (a < b ? options.fn() : options.inverse()) : a < b,
  and( ...expressions ) {

    // Get options.
    const options = _.last(expressions);

    // Evaluate expressions for truthiness.
    const truthy = _.every(expressions, true);

    // Return truthy or falsey based on result.
    return options.fn ? truthy ? options.fn() : options.inverse() : truthy;

  },
  or( ...expressions ) {

    // Get options.
    const options = _.last(expressions);

    // Evaluate expressions for truthiness.
    const truthy = _.some(expressions, true);

    // Return truthy or falsey based on result.
    return options.fn ? truthy ? options.fn() : options.inverse() : truthy;

  },
  merge: ( base, ...objects ) => _.merge(base, ..._.initial(objects))

};
