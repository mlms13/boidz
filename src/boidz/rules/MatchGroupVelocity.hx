package boidz.rules;

import boidz.IFlockRule;

class MatchGroupVelocity implements IFlockRule {
  public var flock : Flock;
  public var ratio : Float;
  public var enabled : Bool = true;

  public function new(flock : Flock, ratio : Float = 1/20) {
    this.flock = flock;
    this.ratio = ratio;
  }

  public function before() return true;

  public function modify(b:Boid):Void {
    // suggested by @sponticelli
    b.vx = (1-ratio) * b.vx + flock.avx * ratio;
    b.vy = (1-ratio) * b.vy + flock.avy * ratio;
  }
}
