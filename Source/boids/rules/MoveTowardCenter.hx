package boids.rules;

class MoveTowardCenter implements IFlockRule {
    public var percent : Float;
    // move 1% toward the perceived center of all other boids
    public function new(percent : Float = 1/100) {
      this.percent = percent;
    }
    public function modifyBoidVelocity(b:Boid, flock:Flock):Void {
        b.velocity.x += (flock.center.x - b.position.x) * percent;
        b.velocity.y += (flock.center.y - b.position.y) * percent;
    }
}
