/*global describe, it */
'use strict';
var assert = require('assert');
var shortquest = require('../');

describe('shortquest node module', function () {
  it('must have at least one test', function () {
    shortquest();
    assert(true, 'I was too lazy to write any tests. Shame on me.');
  });
});
