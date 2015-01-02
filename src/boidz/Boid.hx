package boidz;

import thx.unit.angle.Degree;

class Boid<T : {}> {
  public var x : Float;
  public var y : Float;
  public var v : Float;
  public var d : Degree;
  public var data : T;

  public function new (x : Float, y : Float, ?v = 0.0, ?d : Degree) {
    if(null == d)
      d = 0.0;
    this.x = x;
    this.y = y;
    this.v = v;
    this.d = d;
  }
}