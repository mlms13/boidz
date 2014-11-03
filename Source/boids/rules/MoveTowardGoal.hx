package boids.rules;

import openfl.geom.Point;

class MoveTowardGoal implements IFlockRule {
    public var goal:Point;
    public function new(goal:Point) {
      this.goal = goal;
    }
    public function modifyBoidVelocity(b:Boid, flock:Flock, neighbors:Array<Boid>):Void {
          b.velocity.x += (goal.x - b.position.x) / 100;
          b.velocity.y += (goal.y - b.position.y) / 100;
    }
}
