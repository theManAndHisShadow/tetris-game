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
             * Draws a line from point A (x1, y1) to point B (x2, y2)
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
             * Draws a gradient line from point A (x1, y1) to point B (x2, y2) using gradient color stops
             * @param {number} x1 position at x axis of start point (A)
             * @param {number} y1 position at y axis of start point (A)
             * @param {number} x2 position at x axis of start point (B)
             * @param {number} y2 position at y axis of start point (B)
             * @param {number} w thickoness of line
             * @param {object} gradientCoords coordinate of gradient starting, endong points
             * @param {string} colorStop1 first color stop for gradient
             * @param {string} colorStop2 second color stop for gradient
             */
            drawGradientLine: function({x1, y1, x2, y2, w, gradientCoords, colorStop1, colorStop2} = {}){
                gradientCoords = gradientCoords || {x1: 0, y1: 0, x2: 0, y2: 100}
                colorStop1 = colorStop1 || 'red';
                colorStop2 = colorStop2 || 'blue';

                const gradient = this.context.createLinearGradient(
                    gradientCoords.x1, 
                    gradientCoords.y1, 
                    gradientCoords.x2, 
                    gradientCoords.y2,
                );

                gradient.addColorStop(0, colorStop1);
                gradient.addColorStop(1, colorStop2);

                this.context.strokeStyle = gradient;
                this.context.fillStyle = gradient;
                this.context.lineWidth = w;

                this.context.beginPath();
                this.context.moveTo(x1, y1);
                this.context.lineTo(x2, y2);
                this.context.closePath();
                
                this.context.stroke();
                this.context.fill(); 
            },


            
            /**
             * Draws a rectangle
             * @param {number} x position at x axis
             * @param {number} y position at y axis
             * @param {number} w width of rect
             * @param {number} h height of rect
             * @param {string} c color of rect
             */
            drawRect: function({x, y, w, h, c} = {}){
                this.context.fillStyle = c;
                this.context.fillRect(x, y, w, h);
            },


            /**
             * Draws a square
             * @param {number} x position at x axis
             * @param {number} y position at y axis
             * @param {number} w width of square
             * @param {string} c color of square
             */
            drawSquare: function({x, y, w, c} = {}){
                this.drawRect({x: x, y: y, w: w, h: w, c: c});
            },
        }
    } else {
        throw new Error("Render class param context has bad value");
    }
}

export { Renderer };