console.log('[Log]: Starting game.js');

/**
 * global SETTINGS var ref to settings object.
 * This value is global for easy acces to settings from any place in game logic
 * Nota bene! Before settings object inits this var is null!
 */
let SETTINGS = null;

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


            // TODO: make this part using dynamical generation
            if(shape == "i") {
                // how much elements in horizontal line
                let h_count = 4;

                // how much elements in vertical line
                let v_count = 1;

                parts.push({
                    x: cx - (h_count / 2) * size,
                    y: cy - (size / 2),
                });

                parts.push({
                    x: cx - ((h_count / 2) - 1) * size + 1,
                    y: cy - (size / 2),
                });

                parts.push({
                    x: cx + 2,
                    y: cy - (size / 2),
                });

                parts.push({
                    x: cx + size + 3,
                    y: cy - (size / 2),
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
        // TODO: make cx and cy correct calculating
        cx: cx,
        cy: cy,

        isFreezed: false,
        isFalling: true,

        size: size,
        color: color,
        shape: shape,
        parts: __generate(shape),
        renderer: renderer,

        /**
         * Moves brick to direction
         * @param {string} direction direction of movement
         */
        move: function(direction, speed){
            if(this.isFreezed === false){
                // console.log('moved to ' + direction);
                let delta = speed || this.size;

                //TODO: maybe refactor this part?
                if(direction == 'left') {
                    this.cx = this.cx - delta;
                    this.parts.forEach(singlePart => {singlePart.x = singlePart.x - delta});
                }

                if(direction == 'right') {
                    this.cx = this.cx + delta;
                    this.parts.forEach(singlePart => {singlePart.x = singlePart.x + delta});
                }

                if(direction == 'down') {
                    this.cy = this.cy + delta;
                    this.parts.forEach(singlePart => {singlePart.y = singlePart.y + delta});
                }

                if(direction == 'up') {
                    // at this place in future we can add brick rotating feature
                }
            }
        },

        updateStye: function(styleProperty, newValue){
            let objectAllowedProprties = ['color', 'size'];

            if(objectAllowedProprties.indexOf(styleProperty) > -1){
                this[styleProperty] = newValue;
                this.parts.forEach(singlePart => {
                    singlePart[styleProperty] = newValue;
                });
            } else {
                throw new Error(`Brick 'updateStyle' function has bad argument. styleProperty = ${styleProperty}`);
            }
        },

        fall: function(){
            this.isFalling = false;
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
                    c: this.color,
                });
            });

            if(SETTINGS.dev.__showBrickCenter === true){
                // let centerX = ((this.parts.length / 2) * this.size);
                let r = 4;

                this.renderer.drawPoint({
                    x: this.cx + (r/2), 
                    y: this.cy, 
                    r: r, 
                    c: 'red',
                });

                // console.log(centerX);
            }
        },
    }
};



const Game = function({renderOn}){
    if(renderOn){
        // private value ?
        const renderer = new Renderer({
            context: renderOn.getContext("2d"),
        });

        const settings = new Settings();
        const controls = new Controls({target: renderOn});

        const fps = (1000 / 25);

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

                    return brick;
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
                    // if(fieldItem.isFalling === false){
                    //     fieldItem.move('down', 1);
                    //     console.log(fieldItem);
                    //     // this.parts.forEach(singlePart => {singlePart.x = singlePart.x - this.size});
                    // }

                    fieldItem.render();     
                });
            },


            gravitize: function(target){
                if(target.cy > renderer.context.canvas.height - target.size) {
                    target.isFalling = false;
                    target.isFreezed = true;

                    target.updateStye('color', 'blue');
                    console.log('isFalling = false');
                } else {
                    target.move('down');
                }
            },


            spawnBlocks: function(){
                let brick = this.addBrickToField({cx: renderer.context.canvas.width / 2 , cy: 15, color: "black"});

                if(brick.isFalling === false) {
                    brick = this.spawnBlocks();
                    console.log(brick)
                }

                // brick.fall();

                return brick;
            },


            /**
             * Init game
             */
            init: function(){
                console.log('[Log]: initializing Game');

                // fix for setInterval block
                let self = this;

                // init settings module
                settings.init();

                // binding a settings object to a global variable
                SETTINGS = settings;

                // init controls module
                controls.init();

                // create and add some test brick
                let player = this.spawnBlocks();

                // render all game bricks include movements
                setInterval(self.render.bind(self), fps);

                // update gravity impact at target brick
                setInterval(self.gravitize.bind(self, player), 90 / SETTINGS.gravity);

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