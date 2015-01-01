package boidz;

import thx.unit.angle.Degree;

class Flock {
  public var boids(default, null) : Array<Boid<{}>>;
  public var rules(default, null) : Array<IFlockRule<{}>>;
  public var x : Float;
  public var y : Float;
  public var v : Float;
  public var d : Degree;

  public var step : Float = 0.05;

  public function new() {
    x  = y  = 0;
    v = 0;
    d = 0;
    boids = [];
    rules = [];
  }

  public function addRule(rule:IFlockRule<{}>) {
      // for now, just push the rule to the array, but in the future
      // we could use weighting to determine precedence and have a key
      // to look up and replace a single rule
      rules.push(rule);
  }

  public function update() {
    // checking each boid, calculate the center of the flock
    setFlockAverages();

    // I benchmarked this and incredibly enough it is faster than
    // inverting the loops
    // execute each rule to find the new boid velocity
    for (rule in rules) {
      if(!rule.enabled) continue;
      if(!rule.before()) continue;
      for (boid in boids) {
        rule.modify(boid);
      }
    }

    for (boid in boids) {
      // update boid position given new velocity
      boid.x += boid.v * boid.d.cos();
      boid.y += boid.v * boid.d.sin();
    }
  }

  function setFlockAverages() {
    // init
    x  = y  = 0;
    v = 0;
    d = 0;

    // update
    for (boid in boids) {
      x += boid.x;
      y += boid.y;
      v += boid.v;
      d += boid.d;
    }

    var l = boids.length;

    x = x / l;
    y = y / l;
    v = v / l;
    d = d / l;
  }
}