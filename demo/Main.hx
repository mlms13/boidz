import boids.Boid;
import boids.Flock;
import boids.rules.*;
import boids.render.CanvasRender;

import js.Browser;

class Main {
  static var width = 800;
  static var height = 600;

  public static function main() {
    var flock = new Flock();

    var goalRule = new MoveTowardGoal(width * Math.random(), height * Math.random());

    flock.addRule(new MoveTowardCenter(flock));
    flock.addRule(new AvoidCollisions(flock));
    flock.addRule(new MatchGroupVelocity(flock));
    flock.addRule(new RespectBoundaries(10, width - 10, 10, height - 10));
    flock.addRule(goalRule);
    flock.addRule(new LimitSpeed());

    var canvas = getCanvas();
    flock.addRule(new CanvasRender(canvas));

    addBoids(flock, 1000);

    thx.core.Timer.frame(function() {
      flock.positionBoids();
    });

    canvas.addEventListener("click", function(e) {
      goalRule.goalx = e.clientX;
      goalRule.goaly = e.clientY;
    }, false);
  }

  static function getCanvas() {
    var canvas = Browser.document.createCanvasElement();
    canvas.width = width;
    canvas.height = height;
    Browser.document.body.appendChild(canvas);
    return canvas;
  }

  static function addBoids(flock : Flock, howMany : Int) {
    var w = Math.min(width, height);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var a = Math.random() * 2 * Math.PI,
        d = w * Math.random(),
        b = new Boid(width / 2 + Math.cos(a) * d, height / 2 + Math.sin(a) * d);
      flock.boids.push(b);
    }
  }
}



/*

import js.Browserclass Main extends Sprite {

  public var container:Sprite = new Sprite();
  public var flock:Flock;

  public static var stageWidth : Int;
  public static var stageHeight : Int;

  public function new() {
    super();
    stageWidth = Lib.current.stage.stageWidth;
    stageHeight = Lib.current.stage.stageHeight;

    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, stageWidth, stageHeight);
    graphics.endFill();

    addChild(container);
    addChild(new FPS());

    flock = new Flock();
    var goalRule = new boids.rules.MoveTowardGoal(new Point(stageWidth * Math.random(), stageHeight * Math.random()));

    flock.addRule(new boids.rules.MoveTowardCenter(flock));
    flock.addRule(new boids.rules.AvoidCollisions(flock));
    flock.addRule(new boids.rules.MatchGroupVelocity(flock));
    flock.addRule(new boids.rules.RespectBoundaries(10, stageWidth - 10, 10, stageHeight - 10));
    flock.addRule(goalRule);
    flock.addRule(new boids.rules.LimitSpeed());
    flock.addRule(new boids.rules.GraphicsRender(container.graphics));

    addBoids(flock, 400);

    this.addEventListener(Event.ENTER_FRAME, function (_) {
      flock.positionBoids();
    });

    container.addEventListener(MouseEvent.MOUSE_DOWN, function (e:MouseEvent) {
      goalRule.goal.x = e.localX;
      goalRule.goal.y = e.localY;
    });
  }
}
*/