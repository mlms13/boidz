package boidz.render.canvas;

import boidz.rules.IndividualWaypoints;
import boidz.IRenderable;

class CanvasIndividualWaypoints implements IRenderable<CanvasRender> {
  var waypoints : IndividualWaypoints;
  public var enabled : Bool = true;
  public function new(waypoints : IndividualWaypoints) {
    this.waypoints = waypoints;
  }

  public function render(render : CanvasRender) {
    var x = waypoints.flock.x,
        y = waypoints.flock.y,
        ctx = render.ctx;
    ctx.lineWidth = 1;
    ctx.setLineDash([2]);

    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.moveTo(x, y);

    for(i in waypoints.current...waypoints.goals.length) {
      var goal = waypoints.goals[i];
      ctx.strokeStyle = "#CCCCCC";
      ctx.lineTo(goal.x, goal.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "";
      ctx.arc(goal.x, goal.y, waypoints.radius, 0, 2 * Math.PI, false);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(goal.x, goal.y);
    }
  }
}