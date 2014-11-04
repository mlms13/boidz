package boids.rules;

class MatchGroupVelocity implements IFlockRule {
    public var ratio : Float;
    public function new(ratio : Float = 1/8) {
      this.ratio = ratio;
    }
    public function modifyBoidVelocity(b:Boid, flock:Flock):Void {
        b.velocity.x += flock.avgVelocity.x * ratio;
        b.velocity.y += flock.avgVelocity.y * ratio;
    }
}
