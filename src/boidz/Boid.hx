package boidz;

import thx.unit.angle.Degree;

class Boid {
  public var x : Float;
  public var y : Float;
  public var v : Float;
  public var d : Degree;

  public function new (x : Float, y : Float, ?v = 0.0, ?d : Degree = 0.0) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.d = d;
  }
}