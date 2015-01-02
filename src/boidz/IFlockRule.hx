package boidz;

interface IFlockRule<T:{}> {
  public var enabled : Bool;
  public function before() : Bool;
  public function modify(b : Boid<T>) : Void;
}
