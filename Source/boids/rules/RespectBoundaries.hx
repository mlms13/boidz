package boids.rules;

class RespectBoundaries implements IFlockRule {
    public function new() {}
    public function modifyBoidVelocity(b:Boid, flock:Flock, neighbors:Array<Boid>):Void {
        // TODO, this feels a bit brute-force... why not use the same approach
        // that we use to keep boids from colliding with other boids?
        if (b.position.x < 0) {
            b.velocity.x = 10;
        } else if (b.position.x > flock.stageWidth) {
            b.velocity.x = -10;
        }

        if (b.position.y < 0) {
            b.velocity.y = 10;
        } else if (b.position.y > flock.stageHeight) {
            b.velocity.y = -10;
        }
    }
}
