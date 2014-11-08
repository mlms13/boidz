package boidz.rules;

import boidz.IFlockRule;

class MatchGroupVelocity implements IFlockRule {
  public var flock : Flock;
  public var ratio : Float;

  public function new(flock : Flock, ratio : Float = 1/8) {
    this.flock = flock;
    this.ratio = ratio;
  }

  public function modify(b:Boid):Void {
    b.vx += flock.avx * ratio;
    b.vy += flock.avy * ratio;
  }
}
