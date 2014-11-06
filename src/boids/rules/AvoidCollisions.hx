package boids.rules;

class AvoidCollisions extends BaseRule {
  public var radius(get, set) : Int;
  public var flock : Flock;
  var squareRadius : Int;

  public function new(flock : Flock, ?radius : Int = 5) {
    this.flock = flock;
    set_radius(radius);
  }

  override public function modify(b : Boid):Void {
    for (n in flock.boids) {
      if(n == b || squareDistance(b.px, b.py, n.px, n.py) > squareRadius)
        continue;
      b.vx -= (n.px - b.px);
      b.vy -= (n.py - b.py);
    }
  }

  function set_radius(radius : Int) {
    squareRadius = radius * radius;
    return radius;
  }

  function get_radius()
      return Std.int(Math.sqrt(squareRadius));

  static function squareDistance(x1 : Float, y1 : Float, x2 : Float, y2 : Float) {
    var x = x1 - x2,
        y = y1 - y2;
    return x * x + y * y;
  }
}
