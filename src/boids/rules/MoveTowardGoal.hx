package boids.rules;

class MoveTowardGoal extends BaseRule {
  public var goalx : Float;
  public var goaly : Float;
  public var percent : Float;

  public function new(goalx : Float, goaly : Float, ?percent : Float = 1/100) {
    this.goalx = goalx;
    this.goaly = goaly;
    this.percent = percent;
  }

  override public function modify(b : Boid):Void {
    b.vx += (goalx - b.px) * percent;
    b.vy += (goaly - b.py) * percent;
  }
}
