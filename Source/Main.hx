import openfl.display.Sprite;
import openfl.events.Event;
import openfl.events.MouseEvent;
import openfl.geom.Point;
import openfl.Lib;
import boids.Flock;
import boids.Boid;

class Main extends Sprite {

    public var container:Sprite = new Sprite();
    public var myFlock:Flock;

    public static var stageWidth : Int;
    public static var stageHeight : Int;

    public function new() {
        super();
        stageWidth = Lib.current.stage.stageWidth;
        stageHeight = Lib.current.stage.stageHeight;

        myFlock = new Flock();
        var goalRule = new boids.rules.MoveTowardGoal(new Point(stageWidth * Math.random(), stageHeight * Math.random()));

        myFlock.addRule(new boids.rules.MoveTowardCenter());
        myFlock.addRule(new boids.rules.AvoidCollisions());
        myFlock.addRule(new boids.rules.MatchGroupVelocity());
        myFlock.addRule(new boids.rules.RespectBoundaries());
        myFlock.addRule(goalRule);
        myFlock.addRule(new boids.rules.LimitSpeed());

        addBoids(myFlock, 200);

        addChild(container);
        this.addEventListener(Event.ENTER_FRAME, function (_) {
            myFlock.positionBoids();
            render();
        });

        this.addEventListener(MouseEvent.MOUSE_DOWN, function (e:MouseEvent) {
            goalRule.goal.x = e.localX;
            goalRule.goal.y = e.localY;
        });
    }

    function addBoids(flock : Flock, howMany : Int) {
        var w = Math.min(stageWidth, stageHeight);
        for (i in 0...howMany) {
            // create a new boid and add it to the stage
            var a = Math.random() * 2 * Math.PI,
                d = w * Math.random();
            //var b = new Boid(Math.floor(Math.random() * stageWidth), Math.floor(Math.random() * stageHeight));
            var b = new Boid(stageWidth / 2 + Math.cos(a) * d, stageHeight / 2 + Math.sin(a) * d);
            flock.boids.push(b);
        }
    }

    function render() {
        var g = container.graphics;
        g.clear();
        g.beginFill(0xffffff);
        g.drawRect(0, 0, stageWidth, stageHeight);
        g.endFill();
        g.lineStyle(1, 0x0);
        for (b in myFlock.boids) {
            g.moveTo(b.position.x, b.position.y);
            g.lineTo(b.position.x - b.velocity.x, b.position.y - b.velocity.y);
        }
    }
}