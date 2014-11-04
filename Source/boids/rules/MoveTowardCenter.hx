package boids.rules;

class MoveTowardCenter implements IFlockRule {
    public function new() {}
    public function modifyBoidVelocity(b:Boid, flock:Flock):Void {
        // move 1% toward the perceived center of all other boids
        b.velocity.x += (flock.center.x - b.position.x) / 100;
        b.velocity.y += (flock.center.y - b.position.y) / 100;
    }
}
