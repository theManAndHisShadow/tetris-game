console.log('[Log]: Starting game.js');


/**
 * 
 * @param {number} cx center x
 * @param {number} cy center y
 * @param {string} color color of brick
 * @param {number} size size of brick
 * @param {string} shape shape of brick, might be i, l, j, o, t, s, z
 * @param {boolen} isFall: state block to field
 * @param {CanvasRenderingContext2D} renderer 
 * @returns {object}
 */
const Brick = function({cx, cy, color, size, shape, renderer, isFall } = {}){
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
                    x: cx - (size / 2),
                    y: cy - (size / 2),
                });

                parts.push({
                    x: cx - (size / 2),
                    y: cy + (size / 2) + 1
                });

                parts.push({
                    x: cx - (size / 2),
                    y: cy + (size * 1.5) + 2
                });

                parts.push({
                    x: cx - (size / 2),
                    y: cy + (size * 2.5) + 3
                    
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
        isFall: isFall,

        /**
         * Moves brick to direction
         * @param {string} direction direction of movement
         */
        move: function(direction){
            console.log('moved to ' + direction);

            if(!this.isFall){
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
                    this.cy = this.cy - this.size;
                    this.parts.forEach(singlePart => {singlePart.y = singlePart.y - this.size});
                }
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

/**
 * 
 * @param {boolean} pausedGame status game / true - game stopped / false - continues
 * @returns 
 */

const Game = function({renderOn}){
    let pausedGame = false;


    if(renderOn){
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
             * @param {boolean} isFall state block to field
             */
            addBrickToField: function({cx, cy, shape, color} = {}){
               if((cx && cy) && (typeof cx == 'number' && typeof cy == 'number')){
                    color = color || 'black';
                    shape = shape || 0;

                    const size = 25;
                    const brick = new Brick({
                        cx: cx,
                        cy: cy,
                        size: size,
                        color: color,
                        shape: shape,
                        renderer: renderer, 
                        isFall: false,
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

            fallBrickHandler: function(){
                if(pausedGame){
                    return;
                } else {
                    this.addBrickToField({cx: renderer.context.canvas.width / 2, cy: 15, color: "black"});

                    this.field.forEach(fieldItem => {
                        setInterval(() => {
                        if(!fieldItem.isFall){
                            fieldItem.move('down');

                            if(fieldItem.parts.at(-1).y > renderer.context.canvas.height - fieldItem.size){
                                fieldItem.isFall = true;
                                return this.fallBrickHandler();
                            }
                        }
                    }, 1000);
                    })
                }
            },

            // landedBricksHandler: function(){

            // },

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
                this.fallBrickHandler();

                // render all game bricks include movements
                setInterval(self.render.bind(self), (1000 / 25));

                // Movement managment
                // controls.on('up', () => {
                //     this.field.forEach(fieldItem => {
                //         fieldItem.move('up');
                //     });
                // });

                controls.on('left', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('left');
                    });
                });

                controls.on('right', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('right');
                    });
                });

                controls.on('down', () => {
                    this.field.forEach(fieldItem => {
                        fieldItem.move('down');
                    });
                });
            }
        }

    } else {
        throw new Error("Game class param 'renderOn' has bad value");
    }
}