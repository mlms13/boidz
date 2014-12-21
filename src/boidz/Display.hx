package boidz;

class Display<TRender : IRender> {
  var renderables : Map<IRenderable<TRender>, Bool>;
  var renderEngine : TRender;
  public function new(render : TRender) {
    this.renderEngine = render;
    renderables = new Map();
  }

  public function addRenderable(renderable : IRenderable<TRender>) {
    renderables.set(renderable, true);
  }

  public function removeRenderable(renderable : IRenderable<TRender>) {
    renderables.remove(renderable);
  }

  public function render() {
    renderEngine.clear();
    for(renderable in renderables.keys()) {
      if(renderable.enabled) {
        renderEngine.beforeEach();
        renderable.render(renderEngine);
        renderEngine.afterEach();
      }
    }
  }
}