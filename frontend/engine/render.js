console.log('[Log]: Starting render.js');

const Renderer = function({context}) {
    if(context && context instanceof CanvasRenderingContext2D) {
        return {
            context: context,

            drawSquare: function({x, y, w, c} = {}){
                this.context.fillStyle = c;
                this.context.fillRect(x, y, w, w);
            },

            drawPoint: function({x, y, r, c} = {}){
                this.context.fillStyle = c;
                this.context.beginPath();
                this.context.arc(x, y, r, 0, Math.PI * 2, true);
                this.context.fill();
                this.context.closePath();
            }
        }
    } else {
        throw new Error("Render class param context has bad value");
    }
}