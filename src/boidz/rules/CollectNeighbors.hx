package boidz.rules;

import boidz.IFlockRule;
import boidz.Point;
import boidz.util.Steer;
import thx.unit.angle.Degree;

class CollectNeighbors implements IFlockRule<NeighborData> {
  @:isVar public var radius(get, set) : Float;
  public var flock : Flock;
  public var enabled : Bool = true;
  var squareRadius : Float;

  public function new(flock : Flock, ?radius : Float = 5) {
    this.flock = flock;
    this.radius = radius;
  }

  public function before() return true;

  public function modify(b : Boid<NeighborData>):Void {
    var dx = 0.0,
        dy = 0.0,
        boids = [];
    for (n in flock.boids) {
      if(n == b) continue;
      dx = b.x - n.x;
      dy = b.y - n.y;
      if((dx * dx + dy * dy) > squareRadius) continue;

      boids.push(n);
    }
    b.data.neighbors = cast boids;
  }

  function get_radius() return radius;

  function set_radius(r : Float) {
    radius = r;
    squareRadius = r * r;
    return r;
  }
}
