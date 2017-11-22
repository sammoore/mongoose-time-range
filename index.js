'use strict';

const { assign } = Object;

const mongoose = require('mongoose');
const Time = require('mongoose-time');

class TimeRange extends mongoose.Schema.Types.Array {
  constructor(key, options) {
    super(key, Time, options);

    this.validate({
      validator,
      message: 'Path `{PATH}` must be an ascending range of Dates'
    });
  }
}
TimeRange.schemaName = 'TimeRange';
mongoose.Schema.Types.TimeRange = TimeRange;

module.exports = TimeRange;

function validator(arr) {
  // not a required validator
  if (!arr) return true;

  try {
    return arr[0].getTime() <= arr[1].getTime();
  } catch (err) {
    return false;
  }
}
