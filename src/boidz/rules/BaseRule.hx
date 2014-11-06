package boidz.rules;

import boidz.IFlockRule;

class BaseRule implements IFlockRule {
  public function pre() : Void {}
  public function post() : Void {}
  public function modify(b : Boid) : Void {}
}
