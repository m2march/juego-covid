var assert = require('assert');
var seedrandom = require('seedrandom');

var Random = require('../js/Random.js');

describe('random', function() {
  Math.seedrandom = seedrandom;
  describe('shuffle', function() {
    it('have same elements, not always same order', function() {
      var r = new Random('115');
      var l = [1,2,3,4,5,6,7,8,9];
      var different = false;
      for (var i = 0; i < 10; i++) {
        var nl = r.shuffle(l);
        assert.equal(l.length, nl.length);
        different = different || (!l.every((v, i) => v == nl[i]));
        assert(l.every((v, i) => v == nl.sort()[i]));
      }
      assert.equal(different, true);
    })
  })
})
