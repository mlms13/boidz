package boids.rules;

class RespectBoundaries implements IFlockRule {
    public var minx : Float;
    public var maxx : Float;
    public var miny : Float;
    public var maxy : Float;
    public function new(minx : Float, maxx : Float, miny : Float, maxy : Float) {
        this.minx = minx;
        this.maxx = maxx;
        this.miny = miny;
        this.maxy = maxy;
    }
    public function modifyBoidVelocity(b:Boid, flock:Flock):Void {
        if (b.position.x < minx) {
            b.velocity.x = Math.abs(b.velocity.x);
        } else if (b.position.x > maxx) {
            b.velocity.x = -Math.abs(b.velocity.x);
        }

        if (b.position.y < miny) {
            b.velocity.y = Math.abs(b.velocity.y);
        } else if (b.position.y > maxy) {
            b.velocity.y = -Math.abs(b.velocity.y);
        }
    }
}
