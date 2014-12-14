package boidz.rules;

import thx.unit.angle.Degree;
import boidz.IFlockRule;
using boidz.util.Steer;

using thx.core.Floats;

class RespectBoundaries implements IFlockRule {
  public var minx : Float;
  public var maxx : Float;
  public var miny : Float;
  public var maxy : Float;
  public var offset : Float;
  public var enabled : Bool = true;
  public var maxSteer : Float;
  public function new(minx : Float, maxx : Float, miny : Float, maxy : Float, ?offset : Float = 0.0, ?maxSteer : Degree = 10) {
    this.minx = minx;
    this.maxx = maxx;
    this.miny = miny;
    this.maxy = maxy;
    this.offset = offset;
    this.maxSteer = maxSteer;
  }

  public function before() return true;

  public function modify(b:Boid):Void {
    if (
      (b.x < minx + offset && b.d.facingLeft()) ||
      (b.x > maxx - offset && b.d.facingRight())
    ) {
      b.d += maxSteer * b.d.sign();
    }
    if (
      (b.y < miny + offset && b.d.facingUp()) ||
      (b.y > maxy - offset && b.d.facingDown())
    ) {
      b.d += maxSteer * b.d.sign();
    }
  }
}
