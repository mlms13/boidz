package boids.rules;

import openfl.geom.Point;

class AvoidCollisions extends BaseRule {
    public var radius(get, set) : Int;
    public var flock : Flock;
    var squareRadius : Int;
    public function new(flock : Flock, ?radius : Int = 5) {
        this.flock = flock;
        set_radius(radius);
    }
    override public function modify(b:Boid):Void {
        for (n in flock.boids) {
            if(n == b || squareDistance(b.position, n.position) > squareRadius)
              continue;
            b.velocity.x -= (n.position.x - b.position.x);
            b.velocity.y -= (n.position.y - b.position.y);
        }
    }

    function set_radius(radius : Int) {
        squareRadius = radius * radius;
        return radius;
    }
    function get_radius()
        return Std.int(Math.sqrt(squareRadius));
    static function squareDistance(p1 : Point, p2 : Point) {
      var x = p1.x - p2.x,
          y = p1.y - p2.y;
      return x * x + y * y;
    }
}
