package boids.rules;

import boids.IFlockRule;

class BaseRule implements IFlockRule {
  public function pre() : Void {}
  public function post() : Void {}
  public function modify(b : Boid) : Void {}
}
