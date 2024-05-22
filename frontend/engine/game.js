console.log('[Log]: Starting game.js');


/**
 * 
 * @param {number} cx center x
 * @param {number} cy center y
 * @param {string} color color of brick
 * @param {number} size size of brick
 * @param {string} shape shape of brick, might be i, l, j, o, t, s, z
 * @param {CanvasRenderingContext2D} renderer 
 * @returns {object}
 */
const Brick = function({cx, cy, color, size, shape, renderer} = {}){
    /**
     * 
     * @param {string} shape shape of brick, might be i, l, j, o, t, s, z
     * @returns 
     */
    function __generate(shape){
        if(typeof shape == "string"){
            let parts = [];

            if(shape == "i") {
                parts.push({
                    x: cx - (size/2),
                    y: cy - (size/2),
                });

                parts.push({
                    x: cx + (size/2) + 1,
                    y: cy - (size/2),
                });

                parts.push({
                    x: cx + (size * 1.5) + 2,
                    y: cy - (size/2),
                });

                parts.push({
                    x: cx + (size * 2.5) + 3,
                    y: cy - (size/2),
                });
            }

            return parts;
        } else {
            throw new Error("Brick generating internal function '__generate' has bad shape arg");
        }
    }

    // TODO: replace temp solution
    shape = 'i';

    return {
        cx: cx,
        cy: cy,
        size: size,
        color: color,
        shape: shape,
        parts: __generate(shape),
        renderer: renderer,

        /**
         * Moves brick to direction
         * @param {string} direction direction of movement
         */
        move: function(direction){
            console.log('moved to ' + direction);

            //TODO: maybe refactor this part?
            if(direction == 'left') {
                this.cx = this.cx - this.size;
                this.parts.forEach(singlePart => {singlePart.x = singlePart.x - this.size});
            }

            if(direction == 'right') {
                this.cx = this.cx + this.size;
                this.parts.forEach(singlePart => {singlePart.x = singlePart.x + this.size});
            }

            if(direction == 'down') {
                this.cy = this.cy + this.size;
                this.parts.forEach(singlePart => {singlePart.y = singlePart.y + this.size});
            }

            if(direction == 'up') {
                // at this place in future we can add brick rotating feature
            }
        },

        /**
         * Renders single brick
         */
        render: function(){
            this.parts.forEach(singlePart => {
                this.renderer.drawSquare({
                    x: singlePart.x,
                    y: singlePart.y,
                    w: size,
                    c: color,
                });
            });
        },
    }
};



const Game = function({renderOn}){
    if(renderOn){
        // private value ?
        const renderer = new Renderer({
            context: renderOn.getContext("2d"),
        });

        const controls = new Controls({target: renderOn});

        return {
            field: [],
            
            /**
             * Create brick object and adds in field
             * @param {number} cx brick center x coordinate
             * @param {number} cy brick center y coordinate
             * @param {number} shape type of brick
             * @param {string} color color of brick
             */
            addBrickToField: function({cx, cy, shape, color} = {}){
               if((cx && cy) && (typeof cx == 'number' && typeof cy == 'number')){
                    color = color || 'black';
                    shape = shape || 0;

                    const size = 25;
                    const brick = new Brick({
                        cx: cx, cy: cy, color: color, size: size,
                        shape: shape, renderer: renderer
                    });

                    this.field.push(brick);
               } else {
                    throw new Error("Game class method 'addBrickToField' has bad cx cy args");
               }
            },

            
            /**
             * Renders all filed bricks 
             */
            render: function(){
                /**
                 * Internal helper function, clears entire render zone
                 */
                function __clearRenderZone(){
                    renderer.context.clearRect(
                        0, 0, 
                        renderer.context.canvas.width, 
                        renderer.context.canvas.height
                    );
                }

                // clear render zone manually
                __clearRenderZone();

                // re-render
                this.field.forEach(fieldItem => {
                    fieldItem.render();     
                });
            },


            /**
             * Init game
             */
            init: function(){
                console.log('[Log]: initializing Game');

                // fix for setInterval block
                let self = this;

                // init controls module
                controls.init();

                // add some test brick
                this.addBrickToField({cx: 15, cy: 15, color: "black"});

                // render all game bricks include movements
                setInterval(self.render.bind(self), (1000/25));

                // Movement managment
                controls.on('up', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('up');
                    });
                });

                controls.on('left', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('left');
                    });
                });

                controls.on('right', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('right');
                        console.log('right', fieldItem);
                    });
                });

                controls.on('down', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('down');
                        console.log('down', fieldItem);
                    });
                });
            }
        }

    } else {
        throw new Error("Game class param 'renderOn' has bad value");
    }
}