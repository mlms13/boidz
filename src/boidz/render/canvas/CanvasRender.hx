package boidz.render.canvas;

import boidz.IRender;
import js.html.CanvasRenderingContext2D;
import js.html.CanvasElement;

class CanvasRender implements IRender {
  public var canvas(default, null) : CanvasElement;
  public var ctx(default, null) : CanvasRenderingContext2D;

  public function new(canvas : CanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext2d();
  }

  public function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}