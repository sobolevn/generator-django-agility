/* global describe, it, require */

'use strict';

var assert = require('assert');

describe('django generator', function(){
  it('can be imported', function(){
    assert(require('../app') !== undefined);
  });
});
