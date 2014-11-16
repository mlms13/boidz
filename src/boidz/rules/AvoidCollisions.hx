package boidz.rules;

import boidz.IFlockRule;

class AvoidCollisions implements IFlockRule {
  public var radius : Int;
  public var flock : Flock;
  var squareRadius : Int;

  public function new(flock : Flock, ?radius : Int = 5) {
    this.flock = flock;
    this.radius  = radius;
  }

  public function modify(b : Boid):Void {
    for (n in flock.boids) {
      // this simplifies the calculation a little making it a little faster
      if(n == b || Math.abs(b.px - n.px) > radius || Math.abs(b.py - n.py) > radius)
        continue;
      // TODO this needs to be addressed
      b.vx -= n.px - b.px;
      b.vy -= n.py - b.py;
    }
  }
}
