package boids;

class Boid {
  public var vx : Float;
  public var vy : Float;
  public var px : Float;
  public var py : Float;

  public function new (x : Float, y : Float) {
    vx = vy = 0;
    px = x;
    py = y;
  }
}