package boidz;

interface IFlockRule {
  public var enabled : Bool;
  public function modify(b : Boid) : Void;
}
