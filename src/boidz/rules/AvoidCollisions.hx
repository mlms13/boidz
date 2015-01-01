package boidz.rules;

import boidz.IFlockRule;
import boidz.Point;
import boidz.util.Steer;
import thx.unit.angle.Degree;

class AvoidCollisions implements IFlockRule<NeighborData> {
  public var enabled : Bool = true;
  public var maxSteer : Float;
  var a : Point;

  public function new(?maxSteer : Degree) {
    if(null == maxSteer)
      maxSteer = 10.0;
    this.maxSteer = maxSteer;
    this.a = { x : 0.0 , y : 0.0 };
  }

  public function before() return true;

  public function modify(b : Boid<NeighborData>):Void {
    var len = b.data.neighbors.length;
    if(len == 0)
      return;
    a.x = a.y = 0.0;
    for (n in b.data.neighbors) {
      a.x += n.x;
      a.y += n.y;
    }

    a.x /= len;
    a.y /= len;

    b.d += Steer.away(b, a, maxSteer);
  }
}
