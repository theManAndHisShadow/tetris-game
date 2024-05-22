console.log('[Log]: Starting render.js');

const Renderer = function({context}) {
    if(context && context instanceof CanvasRenderingContext2D) {
        return {
            context: context,

            drawSquare: function({x, y, w, c} = {}){
                this.context.fillStyle = c;
                this.context.fillRect(x, y, w, w);
            },
        }
    } else {
        throw new Error("Render class param context has bad value");
    }
}