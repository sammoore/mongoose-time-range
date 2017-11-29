'use strict';

const assert = require('assert');
const mongoose = require('mongoose');
const TimeRange = require('../');

mongoose.Promise = Promise;

const DATABASE = 'mongoose-time-range-test';

function model(name, schema = new mongoose.Schema()) {
  return mongoose.model(name, schema);
}

var db = null;

before(function () {
  mongoose.connect(`mongodb:\/\/localhost:27017\/${DATABASE}`);
  db = model('__db').db;
});

beforeEach(function (done) {
  db.dropDatabase(done);
});

describe('module', function () {
  it('exports a function', function () {
    assert.ok(typeof TimeRange == 'function');
  });
});

describe('schema type', function () {
  var Model;

  before(function () {
    const schema = new mongoose.Schema({
      val: {
        type: TimeRange,
        default: null
      }
    });

    Model = model('Plugin', schema);
  });

  describe('causes a validation error for', function () {
    it('undefined', function () {
      const doc = new Model({ val: undefined });

      return doc.validate()
      .then(() => assert.fail(`TimeRange did not invalidate ${doc.val}`))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.val.path, 'val');
      });
    });

    it('empty array', function () {
      const doc = new Model({ value: [] });

      return doc.validate()
      .then(() => assert.fail(`TimeRange did not invalidate ${doc.val}`))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.val.path, 'val');
      });
    });

    it('less than two Dates', function () {
      const doc = new Model({ value: [new Date(1000)] });

      return doc.validate()
      .then(() => assert.fail(`TimeRange did not invalidate ${doc.val}`))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.val.path, 'val');
      });
    });

    it('more than two Dates', function () {
      const doc = new Model({ value: Array(3).fill(new Date(1000)) });

      return doc.validate()
      .then(() => assert.fail(`TimeRange did not invalidate ${doc.val}`))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.val.path, 'val');
      });
    });

    it('non-date objects', function () {
      const doc = new Model({ value: [1000] });

      return doc.validate()
      .then(() => assert.fail(`TimeRange did not invalidate ${doc.val}`))
      .catch((err) => {
        if (err.name == 'AssertionError') throw err;
        assert.equal(err.name, 'ValidationError')
        assert.equal(err.errors.val.path, 'val');
      });
    });
  });

  it('validates two Dates', function () {
    const doc = new Model({ val: [new Date(1000), new Date(1200)] });
    return doc.validate();
  });
});

describe('ascendingRange', function () {
  it('causes a validation error for descending dates', function () {
    throw new Error('unimplemented');
  });

  it('validates ascending Dates', function () {
    throw new Error('unimplemented');
  });
});

after(function () {
  db.close();
});
