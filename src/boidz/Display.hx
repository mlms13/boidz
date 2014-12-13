package boidz;

class Display<TRender : IRender> {
  var renderables : Array<IRenderable<TRender>>;
  var renderEngine : TRender;
  public function new(render : TRender) {
    this.renderEngine = render;
    renderables = [];
  }

  public function addRenderable(renderable : IRenderable<TRender>) {
    renderables.push(renderable);
  }

  public function render() {
    renderEngine.clear();
    for(renderable in renderables) {
      if(renderable.enabled)
        renderable.render(renderEngine);
    }
  }
}