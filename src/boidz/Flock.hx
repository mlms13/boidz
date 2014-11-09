package boidz;

class Flock {
  public var boids(default, null):Array<Boid>;
  public var rules(default, null):Array<IFlockRule>;
  public var cx : Float;
  public var cy : Float;
  public var avx : Float;
  public var avy : Float;

  public var step : Float = 0.05;

  public function new() {
    cx  = cy  = 0;
    avx = avy = 0;
    boids = [];
    rules = [];
  }

  public function addRule(rule:IFlockRule) {
      // for now, just push the rule to the array, but in the future
      // we could use weighting to determine precedence and have a key
      // to look up and replace a single rule
      rules.push(rule);
  }

  public function update() {
    // checking each boid, calculate the center of the flock
    setFlockAverages();

    for (boid in boids) {
      // execute each rule to find the new boid velocity
      for (rule in rules) {
        rule.modify(boid);
      }

      // update boid position given new velocity
      boid.px += boid.vx;
      boid.py += boid.vy;
    }
  }

  function setFlockAverages() {
    // init
    cx  = cy  = 0;
    avx = avy = 0;

    // update
    for (boid in boids) {
      cx += boid.px;
      cy += boid.py;
      avx += boid.vx;
      avy += boid.vy;
    }

    cx = cx / boids.length;
    cy = cy / boids.length;
    avx = avx / boids.length;
    avy = avy / boids.length;
  }
}