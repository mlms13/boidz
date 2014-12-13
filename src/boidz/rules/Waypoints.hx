package boidz.rules;

import boidz.IFlockRule;

class Waypoints implements IFlockRule {
  public var goals : Array<Array<Float>>;
  public var enabled : Bool = true;
  public var radius : Float;
  public var onStep : Array<Float> -> Void;
  public var flock : Flock;

  public var goalRule(default, null) : MoveTowardGoal;

  public function new(flock : Flock, ?radius : Float = 10) {
    this.flock = flock;
    this.radius = radius;
    this.goals = [];
    this.onStep = function(coords : Array<Float>) {};
  }

  public function before() {
    if(null != goalRule) {
      var dx = goalRule.goalx - flock.cx,
          dy = goalRule.goaly - flock.cy;

      if((dx * dx) + (dy * dy) <= radius * radius) {
        onStep([goalRule.goalx, goalRule.goaly]);
        goalRule = null;
      }
    }

    if(null == goalRule && goals.length > 0) {
      var p = goals.shift();
      goalRule = new MoveTowardGoal(p[0], p[1]);
    }

    return null != goalRule;
  }

  public function modify(b : Boid):Void {
    goalRule.modify(b);
  }
}