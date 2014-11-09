package boidz.rules;

import boidz.IFlockRule;

class RespectBoundaries implements IFlockRule {
  public var minx : Float;
  public var maxx : Float;
  public var miny : Float;
  public var maxy : Float;
  public function new(minx : Float, maxx : Float, miny : Float, maxy : Float) {
    this.minx = minx;
    this.maxx = maxx;
    this.miny = miny;
    this.maxy = maxy;
  }

  public function modify(b:Boid):Void {
    if (b.px < minx) {
      b.vx = Math.abs(b.vx);
    } else if (b.px > maxx) {
      b.vx = -Math.abs(b.vx);
    }

    if (b.py < miny) {
      b.vy = Math.abs(b.vy);
    } else if (b.py > maxy) {
      b.vy = -Math.abs(b.vy);
    }
  }
}
