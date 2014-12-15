package boidz.rules;

import thx.unit.angle.Degree;
import boidz.IFlockRule;

class Waypoints implements IFlockRule {
  public var goals : Array<Point>;
  public var enabled : Bool = true;
  public var radius : Float;
  public var onStep : Float -> Float -> Void;
  public var flock : Flock;
  public var goalRule(default, null) : SteerTowardGoal;
  @:isVar public var maxSteer(get, set) : Float;

  public function new(flock : Flock, ?radius : Float = 10, ?maxSteer : Degree = 10) {
    this.flock = flock;
    this.radius = radius;
    this.goals = [];
    this.onStep = function(x : Float, y : Float) {};
    this.maxSteer = maxSteer;
  }

  public function before() {
    if(null != goalRule) {
      var dx = goalRule.x - flock.x,
          dy = goalRule.y - flock.y;

      if((dx * dx) + (dy * dy) <= radius * radius) {
        onStep(goalRule.x, goalRule.y);
        goalRule = null;
      }
    }

    if(null == goalRule && goals.length > 0) {
      var p = goals.shift();
      goalRule = new SteerTowardGoal(p.x, p.y, maxSteer);
    }

    return null != goalRule;
  }

  public function modify(b : Boid) : Void
    goalRule.modify(b);

  function get_maxSteer() return maxSteer;

  function set_maxSteer(v : Float) {
    if(null != goalRule)
      goalRule.maxSteer = v;
    return maxSteer = v;
  }
}