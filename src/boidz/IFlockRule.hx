package boidz;

interface IFlockRule {
  public var enabled : Bool;
  public function before() : Bool;
  public function modify(b : Boid) : Void;
}
