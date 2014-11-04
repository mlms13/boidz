package boids.rules;

import openfl.geom.Point;

class MoveTowardGoal implements IFlockRule {
    public var goal:Point;
    public var percent:Float;
    public function new(goal:Point, ?percent:Float = 1/100) {
      this.goal = goal;
      this.percent = percent;
    }
    public function modifyBoidVelocity(b:Boid, flock:Flock):Void {
          b.velocity.x += (goal.x - b.position.x) * percent;
          b.velocity.y += (goal.y - b.position.y) * percent;
    }
}
