console.log('[Log]: Starting render.js');

const Renderer = function({context}) {
    if(context && context instanceof CanvasRenderingContext2D) {
        return {
            context: context,

            /**
             * Draws a circle at given coords
             * @param {number} x position at x axis
             * @param {number} y position at y axis
             * @param {number} r radius of circle
             * @param {string} c color of circle (fillment)
             */
            drawCircle: function({x, y, r, c} = {}){
                this.context.fillStyle = c;
                this.context.beginPath();
                this.context.arc(x, y, r, 0, Math.PI * 2, true);
                this.context.fill();
                this.context.closePath();
            },


            /**
             * Draws a lint form point A (x1, y1) to point B (x2, y2)
             * @param {number} x1 position at x axis of start point (A)
             * @param {number} y1 position at y axis of start point (A)
             * @param {number} x2 position at x axis of start point (B)
             * @param {number} y2 position at y axis of start point (B)
             * @param {number} w thickoness of line
             * @param {string} c color of line
             */
            drawLine: function({x1, y1, x2, y2, w, c} = {}){
                this.context.fillStyle = c;
                this.context.strokeStyle = c;
                this.context.lineWidth = w;

                this.context.beginPath();
                this.context.moveTo(x1, y1);
                this.context.lineTo(x2, y2);
                this.context.closePath();
                
                this.context.stroke();
                this.context.fill();
            },


            /**
             * Draws a square
             * @param {number} x
             * @param {number} y
             * @param {number} w
             * @param {string} c
             */
            drawSquare: function({x, y, w, c} = {}){
                this.context.fillStyle = c;
                this.context.fillRect(x, y, w, w);
            },
        }
    } else {
        throw new Error("Render class param context has bad value");
    }
}