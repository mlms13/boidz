package boids.rules;

class MatchGroupVelocity implements IFlockRule {
    public function new() {}
    public function modifyBoidVelocity(b:Boid, flock:Flock, neighbors:Array<Boid>):Void {
        b.velocity.x += flock.avgVelocity.x / 8;
        b.velocity.y += flock.avgVelocity.y / 8;
    }
}
