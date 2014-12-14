package boidz.render.canvas;

import boidz.rules.RespectBoundaries;
import boidz.IRenderable;

class CanvasBoundaries implements IRenderable<CanvasRender> {
  var boundaries : RespectBoundaries;
  public var enabled : Bool = true;
  public var color : String = "#BBBBBB";
  public function new(boundaries : RespectBoundaries) {
    this.boundaries = boundaries;
  }

  public function render(render : CanvasRender) {
    var ctx = render.ctx;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.setLineDash([2, 2]);
    ctx.moveTo(Math.round(boundaries.minx + boundaries.offset) + 0.5, Math.round(boundaries.miny + boundaries.offset) + 0.5);
    ctx.lineTo(Math.round(boundaries.maxx - boundaries.offset) + 0.5, Math.round(boundaries.miny + boundaries.offset) + 0.5);
    ctx.lineTo(Math.round(boundaries.maxx - boundaries.offset) + 0.5, Math.round(boundaries.maxy - boundaries.offset) + 0.5);
    ctx.lineTo(Math.round(boundaries.minx + boundaries.offset) + 0.5, Math.round(boundaries.maxy - boundaries.offset) + 0.5);
    ctx.lineTo(Math.round(boundaries.minx + boundaries.offset) + 0.5, Math.round(boundaries.miny + boundaries.offset) + 0.5);
    ctx.stroke();
  }
}