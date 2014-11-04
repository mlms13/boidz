package boids.rules;

class MatchGroupVelocity extends BaseRule {
    public var flock : Flock;
    public var ratio : Float;
    public function new(flock : Flock, ratio : Float = 1/8) {
      this.flock = flock;
      this.ratio = ratio;
    }
    override public function modify(b:Boid):Void {
        b.velocity.x += flock.avgVelocity.x * ratio;
        b.velocity.y += flock.avgVelocity.y * ratio;
    }
}
