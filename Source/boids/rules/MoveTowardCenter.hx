package boids.rules;

class MoveTowardCenter extends BaseRule {
    public var flock : Flock;
    public var percent : Float;
    // move 1% toward the perceived center of all other boids
    public function new(flock : Flock, percent : Float = 1/100) {
      this.flock = flock;
      this.percent = percent;
    }
    override public function modify(b:Boid):Void {
        b.velocity.x += (flock.center.x - b.position.x) * percent;
        b.velocity.y += (flock.center.y - b.position.y) * percent;
    }
}
