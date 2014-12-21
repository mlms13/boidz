package boidz.rules;

import thx.unit.angle.Degree;
import boidz.IFlockRule;

class IndividualWaypoints implements IFlockRule {
  public var goals(default, null) : Array<{ x : Float, y : Float }>;
  public var enabled : Bool = true;
  public var radius : Float;
  public var onStep : { x : Float, y : Float } -> Void;
  public var onBoidStep : Boid -> { x : Float, y : Float } -> Void;
  public var flock : Flock;
  @:isVar public var maxSteer(get, set) : Float;
  var goalRule : SteerTowardGoal;
  var map : Map<Boid, Int>;
  public var current(default, null) : Int = 0;

  public function new(flock : Flock, ?radius : Float = 10, ?maxSteer : Degree) {
    if(null == maxSteer)
      maxSteer = 15.0;
    this.flock = flock;
    this.radius = radius;
    this.goals = [];
    this.onStep = function(coords : { x : Float, y : Float }) {};
    this.onBoidStep = function(b : Boid, coords : { x : Float, y : Float }) {};
    this.maxSteer = maxSteer;
    this.goalRule = new SteerTowardGoal(0, 0, maxSteer);
    this.map = new Map();
  }

  public function addGoal(x : Float, y : Float) {
    goals.push({ x : x, y : y });
  }

  public function before() {
    if(goals.length == 0)
      return false;
    var counter = 0;
    for(boid in flock.boids) {
      var pos = map.get(boid);
      if(null == pos) {
        pos = current;
        map.set(boid, pos);
        counter++;
      } else if(pos == current){
        counter++;
      }
      var p = goals[pos];

      if(null == p) continue;

      var dx = p.x - boid.x,
          dy = p.y - boid.y;


      if((dx * dx) + (dy * dy) <= radius * radius) {
        onBoidStep(boid, p);
        if(pos == current) {
          counter--;
        }
        pos += 1;
        map.set(boid, pos);
      }
    }

    if(counter == 0) {
      current++;
    }
    // TODO
    /*
    if(null != goalRule) {
      var dx = goalRule.x - flock.x,
          dy = goalRule.y - flock.y;

      if((dx * dx) + (dy * dy) <= radius * radius) {
        onStep([goalRule.x, goalRule.y]);
        goalRule = null;
      }
    }

    if(null == goalRule && goals.length > 0) {
      var p = goals.shift();
      goalRule = new SteerTowardGoal(p[0], p[1], maxSteer);
    }

    return null != goalRule;
    */
    return goals.length > 0;
  }

  public function modify(b : Boid) : Void {
    var pos = map.get(b);
    if(pos < goals.length) {
      var p = goals[pos];
      goalRule.x = p.x;
      goalRule.y = p.y;
      goalRule.modify(b);
    }
  }

  function updateGoalRuleForBoid(b : Boid) {
    // TODO
    goalRule.x = 100;
    goalRule.y = 200;
  }

  function get_maxSteer() return maxSteer;

  function set_maxSteer(v : Float) {
    if(null != goalRule)
      goalRule.maxSteer = v;
    return maxSteer = v;
  }
}