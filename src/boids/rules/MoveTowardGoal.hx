package boids.rules;

import openfl.geom.Point;

class MoveTowardGoal extends BaseRule {
    public var goal:Point;
    public var percent:Float;
    public function new(goal:Point, ?percent:Float = 1/100) {
      this.goal = goal;
      this.percent = percent;
    }
    override public function modify(b:Boid):Void {
          b.velocity.x += (goal.x - b.position.x) * percent;
          b.velocity.y += (goal.y - b.position.y) * percent;
    }
}
