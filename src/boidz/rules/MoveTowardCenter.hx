package boidz.rules;

import boidz.IFlockRule;

class MoveTowardCenter implements IFlockRule {
  public var flock : Flock;
  public var percent : Float;
  public var enabled : Bool = true;

  // move 1% toward the perceived center of all other boids
  public function new(flock : Flock, percent : Float = 1/100) {
    this.flock = flock;
    this.percent = percent;
  }

  public function before() return true;

  public function modify(b:Boid):Void {
    b.vx += (flock.cx - b.px) * percent;
    b.vy += (flock.cy - b.py) * percent;
  }
}
