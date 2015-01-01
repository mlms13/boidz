package boidz.rules;

import boidz.IFlockRule;
import boidz.Point;
import boidz.util.Steer;
import thx.unit.angle.Degree;

class AvoidCollisions implements IFlockRule {
  @:isVar public var radius(get, set) : Float;
  var flock : Flock;
  public var enabled : Bool = true;
  public var proportional : Bool = false;
  public var maxSteer : Float;
  var squareRadius : Float;
  var a : Point;

  public function new(flock : Flock, ?radius : Float = 5, ?maxSteer : Degree) {
    if(null == maxSteer)
      maxSteer = 10.0;
    this.flock = flock;
    this.radius = radius;
    this.maxSteer = maxSteer;
    this.a = { x : 0.0 , y : 0.0 };
  }

  public function before() return true;

  public function modify(b : Boid):Void {
    var dx = 0.0,
        dy = 0.0,
        count = 0;
    a.x = a.y = 0.0;
    b.data.neighbors = 0.0;
    for (n in flock.boids) {
      if(n == b) continue;
      dx = b.x - n.x;
      dy = b.y - n.y;
      if((dx * dx + dy * dy) > squareRadius) continue;

      a.x += n.x;
      a.y += n.y;

      count++;
      b.data.neighbors++;
    }
    if(count == 0) return;

    a.x /= count;
    a.y /= count;

    if(proportional) {
      var dist = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
      b.d += Steer.away(b, a, maxSteer) * (radius - dist) / radius;
    } else {
      b.d += Steer.away(b, a, maxSteer);
    }
  }

  function get_radius() return radius;

  function set_radius(r : Float) {
    radius = r;
    squareRadius = r * r;
    return r;
  }
}
