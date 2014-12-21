package boidz.rules;

import thx.unit.angle.Degree;
import boidz.IFlockRule;
import boidz.util.Steer;

class SteerTowardGoal implements IFlockRule {
  public var x : Float;
  public var y : Float;
  public var maxSteer : Float;
  public var enabled : Bool = true;

  public function new(x : Float, y : Float, ?maxSteer : Degree) {
    if(null == maxSteer)
      maxSteer = 5.0;
    this.x = x;
    this.y = y;
    this.maxSteer = maxSteer;
  }

  public function before() return true;

  public function modify(b : Boid):Void {
    b.d += Steer.toward(b, this, maxSteer);
  }
}