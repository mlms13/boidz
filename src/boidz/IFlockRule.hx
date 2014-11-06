package boidz;

interface IFlockRule {
    public function pre() : Void;
    public function post() : Void;
    public function modify(b:Boid):Void;
}
