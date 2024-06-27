console.log('[Log]: Starting render.js');

class Renderer {
    constructor({context}){
        if(context && context instanceof CanvasRenderingContext2D) {
            this.context = context;
        } else {
            throw new Error("Render class param context has bad value");
        }
    }

    /**
     * Draws a circle at given coords
     * @param {Object} options
     * @param {number} options.x - position at x axis
     * @param {number} options.y - position at y axis
     * @param {number} options.r - radius of circle
     * @param {string} options.c - color of circle (fillment)
     */
    drawCircle ({x, y, r, c} = {}){
        this.context.fillStyle = c;
        this.context.beginPath();
        this.context.arc(x, y, r, 0, Math.PI * 2, true);
        this.context.fill();
        this.context.closePath();
    }


    /**
     * Draws a line from point A (x1, y1) to point B (x2, y2)
     * @param {Object} options
     * @param {number} options.x1 - position at x axis of start point (A)
     * @param {number} options.y1 - position at y axis of start point (A)
     * @param {number} options.x2 - position at x axis of start point (B)
     * @param {number} options.y2 - position at y axis of start point (B)
     * @param {number} options.w  - thickness of line
     * @param {string} options.c  - color of line
     */
    drawLine ({x1, y1, x2, y2, w, c} = {}){
        this.context.fillStyle = c;
        this.context.strokeStyle = c;
        this.context.lineWidth = w;

        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.closePath();
        
        this.context.stroke();
        this.context.fill();
    }

    /**
     * Draws a gradient line from point A (x1, y1) to point B (x2, y2) using gradient color stops
     * @param {Object} options
     * @param {number} options.x1 - position at x axis of start point (A)
     * @param {number} options.y1 - position at y axis of start point (A)
     * @param {number} options.x2 - position at x axis of start point (B)
     * @param {number} options.y2 - position at y axis of start point (B)
     * @param {number} options.w  - thickness of line
     * @param {object} [options.gradientCoords={}] - coordinate of gradient starting, endong points
     * @param {string} [options.colorStop1='red'] - first color stop for gradient
     * @param {string} [options.colorStop2='blue'] - second color stop for gradient
     */
    drawGradientLine ({
        x1, y1, x2, y2, w, 
        gradientCoords = {x1: 0, y1: 0, x2: 0, y2: 100}, 
        colorStop1 = 'red', colorStop2 = 'blue'
    } = {}){

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
    }


    
    /**
     * Draws a rectangle
     * @param {Object} options
     * @param {number} options.x - position at x axis
     * @param {number} options.y - position at y axis
     * @param {number} options.w - width of rect
     * @param {number} options.h - height of rect
     * @param {string} options.c - color of rect
     */
    drawRect ({x, y, w, h, c} = {}){
        this.context.fillStyle = c;
        this.context.fillRect(x, y, w, h);
    }


    /**
     * Draws a square
     * @param {Object} options
     * @param {number} options.x - position at x axis
     * @param {number} options.y - position at y axis
     * @param {number} options.w - width of square
     * @param {string} options.c - color of square
     */
    drawSquare ({x, y, w, c} = {}){
        this.drawRect({x: x, y: y, w: w, h: w, c: c});
    }
}


export { Renderer };