import openfl.display.Sprite;
import openfl.events.Event;
import openfl.Lib;
import boids.Flock;
import boids.Boid;

class Main extends Sprite {

    public var container:Sprite = new Sprite();
    public var myFlock:Flock;

    public function new() {
        super();
        myFlock = new Flock(200, Lib.current.stage.stageWidth, Lib.current.stage.stageHeight);

        myFlock.addRule(new boids.rules.MoveTowardCenter());
        myFlock.addRule(new boids.rules.AvoidCollisions());
        myFlock.addRule(new boids.rules.MatchGroupVelocity());
        myFlock.addRule(new boids.rules.RespectBoundaries());
        myFlock.addRule(new boids.rules.LimitSpeed());

        addChild(container);
        this.addEventListener(Event.ENTER_FRAME, function (_) {
            myFlock.positionBoids();
            render();
        });
    }

    function render() {
        var g = container.graphics;
        g.clear();
        g.lineStyle(1, 0x0);
        for (b in myFlock.boids) {
            g.moveTo(b.position.x, b.position.y);
            g.lineTo(b.position.x - b.velocity.x, b.position.y - b.velocity.y);
        }
    }
}