package boidz.rules;

import boidz.IFlockRule;

class LimitSpeed implements IFlockRule {
  public var speedLimit : Float; // measured in units per event loop cycle (Flock.step)
  public function new(speedLimit = 10.0) {
    this.speedLimit = speedLimit;
  }

  public function modify(b : Boid) : Void {
    // TODO, each boid could have a different speed based on its location
    var currentSpeed = Math.sqrt(Math.pow(b.vx, 2) + Math.pow(b.vy, 2)),
        speedDifference = speedLimit / currentSpeed;

    if (speedDifference < 1) {
      b.vx *= speedDifference;
      b.vy *= speedDifference;
    }
  }
}
