package boids;

import openfl.geom.Point;

class Boid {
    public var velocity(default, null):Point;
    public var position(default, null):Point;

    public function new (x:Float, y:Float) {
        velocity = new Point(0, 0);
        position = new Point(x, y);
    }
}