// requires Math.seedrandom

class Random {

  constructor(seed) {
    this.generator = new Math.seedrandom(seed);
  }

  shuffle(list) {
    var n_list = list.slice();
    for (var i = 0; i < n_list.length; i++) {
      var r = this.generator() * (n_list.length - i);
      var select = i + Math.floor(r);
      var old = n_list[i];
      n_list[i] = n_list[select];
      n_list[select] = old;
    }
    return n_list;
  }

  uniform() {
    return this.generator();
  }

}

try {
  module.exports = Random;
} catch {}
