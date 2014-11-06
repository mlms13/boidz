package boids.rules;

class LimitSpeed extends BaseRule {
  public var speedLimit : Int; // measured in pixels per event loop cycle
  public function new(speedLimit = 10) {
    this.speedLimit = speedLimit;
  }

  override public function modify(b : Boid) : Void {
    // TODO, each boid could have a different speed based on its location
    var currentSpeed = Math.sqrt(Math.pow(b.vx, 2) + Math.pow(b.vy, 2)),
        speedDifference = speedLimit / currentSpeed;

    if (speedDifference < 1) {
      b.vx *= speedDifference;
      b.vy *= speedDifference;
    }
  }
}
