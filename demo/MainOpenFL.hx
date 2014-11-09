import boidz.Boid;
import boidz.Flock;
import boidz.rules.*;
import boidz.render.*;

import openfl.Lib;
import openfl.geom.*;
import openfl.display.*;
import openfl.events.*;

class MainOpenFL extends Sprite {

  public var container:Sprite = new Sprite();
  public var flock:Flock;

  public static var stageWidth : Int;
  public static var stageHeight : Int;

  public function new() {
    super();
    stageWidth  = Lib.current.stage.stageWidth;
    stageHeight = Lib.current.stage.stageHeight;

    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, stageWidth, stageHeight);
    graphics.endFill();

    var render = new boidz.render.OpenFLGraphicsRender(container.graphics);

    addChild(container);
    addChild(new FPS());

    flock = new Flock();
    var goalRule = new MoveTowardGoal(stageWidth * Math.random(), stageHeight * Math.random());

    flock.addRule(new MoveTowardCenter(flock));
    flock.addRule(new AvoidCollisions(flock));
    flock.addRule(new MatchGroupVelocity(flock));
    flock.addRule(new RespectBoundaries(10, stageWidth - 10, 10, stageHeight - 10));
    flock.addRule(goalRule);
    flock.addRule(new LimitSpeed());

    addBoids(flock, 200);

    var residue = 0.0,
        step    = flock.step * 1000;
    thx.core.Timer.frame(function(delta) {
      delta += residue;
      while(delta - step >= 0) {
        flock.update();
        delta -= step;
      }
      residue = delta;
      render.render(flock);
    });

    addEventListener(MouseEvent.MOUSE_DOWN, function (e:MouseEvent) {
      goalRule.goalx = e.localX;
      goalRule.goaly = e.localY;
    });
  }

  static function addBoids(flock : Flock, howMany : Int) {
    var w = Math.min(stageWidth, stageHeight);
    for (i in 0...howMany) {
      // create a new boid and add it to the stage
      var a = Math.random() * 2 * Math.PI,
          d = w * Math.random(),
          b = new Boid(stageWidth / 2 + Math.cos(a) * d, stageHeight / 2 + Math.sin(a) * d);
      flock.boids.push(b);
    }
  }
}