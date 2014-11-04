package boids.rules;

class LimitSpeed implements IFlockRule {
    public var speedLimit:Int; // measured in pixels per event loop cycle
    public function new(speedLimit = 10) {
        this.speedLimit = speedLimit;
    }
    public function modifyBoidVelocity(b:Boid, flock:Flock):Void {
        // TODO, each boid could have a different speed based on its location
        var currentSpeed = Math.sqrt(Math.pow(b.velocity.x, 2) + Math.pow(b.velocity.y, 2));
        var speedDifference = speedLimit / currentSpeed;

        if (speedDifference < 1) {
            b.velocity.x *= speedDifference;
            b.velocity.y *= speedDifference;
        }
    }
}
