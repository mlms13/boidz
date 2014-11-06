package boidz.render;

import boidz.rules.BaseRule;
import openfl.display.Graphics;

class OpenFLGraphicsRender extends BaseRule {
    var g : Graphics;
    public function new(graphics : Graphics) {
        g = graphics;
    }
    override public function pre() {
        g.clear();
        g.lineStyle(1, 0x0);
    }
    override public function modify(b:Boid):Void {
        g.moveTo(b.position.x, b.position.y);
        g.lineTo(b.position.x - b.velocity.x, b.position.y - b.velocity.y);
    }
}
