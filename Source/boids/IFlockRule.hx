package boids;

interface IFlockRule {
    public function modifyBoidVelocity(b:Boid, flock:Flock, neighbor:Array<Boid>):Void;
}
