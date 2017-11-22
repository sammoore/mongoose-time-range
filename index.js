'use strict';

const { create, assign } = Object;

const mongoose = require('mongoose');
const Time = require('mongoose-time');
const arrayLengthValidators = require('mongoose-array-length-validators');
const { descriptors } = arrayLengthValidators;

class TimeRange extends mongoose.Schema.Types.Array {
  constructor(key, options) {
    super(key, Time, options);
    validate(key, this);

    // FIXME: would fit better in a generic Range/Tuple type.
    if (options.ascending) {
      this.validate({
        ascendingValidator,
        message: 'Path `{PATH}` must be an ascending range of Dates'
      });
    }
  }
}
TimeRange.schemaName = 'TimeRange';
mongoose.Schema.Types.TimeRange = TimeRange;

module.exports = TimeRange;

function validate(key, type) {
  let delegate = create(type);

  Object.defineProperties(delegate, {
    paths: { value: { [key]: delegate } },
    path: { value: () => delegate },
    options: { value: { minlength: 2, maxlength: 2 } }
  });

  return arrayLengthValidators(delegate);
}

function ascendingValidator(arr) { 
  // not a required validator
  if (!arr) return true;

  try {
    return arr[0].getTime() <= arr[1].getTime();
  } catch (err) {
    return false;
  }
}
