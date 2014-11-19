package boidz.rules;

import boidz.IFlockRule;

class AvoidCollisions implements IFlockRule {
  @:isVar public var radius(get, set) : Float;
  public var flock : Flock;
  public var enabled : Bool = true;
  var squareRadius : Float;

  public function new(flock : Flock, ?radius : Float = 5) {
    this.flock = flock;
    this.radius  = radius;
  }

  public function modify(b : Boid):Void {
    var ax = 0.0,
        ay = 0.0,
        dx = 0.0,
        dy = 0.0,
        count = 0;
    for (n in flock.boids) {
      if(n == b) continue;
      dx = b.px - n.px;
      dy = b.py - n.py;
      if((dx * dx + dy * dy) > squareRadius) continue;

      ax += n.px;
      ay += n.py;

      count++;
    }
    if(count == 0) return;

    ax /= count;
    ay /= count;

    b.vx -= (ax - b.px) / radius;
    b.vy -= (ay - b.py) / radius;
  }

  function get_radius() return radius;

  function set_radius(r : Float) {
    radius = r;
    squareRadius = r * r;
    return r;
  }
}
