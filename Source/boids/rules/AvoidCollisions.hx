package boids.rules;

class AvoidCollisions implements IFlockRule {
    public function new() {}
    public function modifyBoidVelocity(b:Boid, flock:Flock, neighbors:Array<Boid>):Void {
        for (n in neighbors) {
            b.velocity.x -= (n.position.x - b.position.x);
            b.velocity.y -= (n.position.y - b.position.y);
        }
    }
}
