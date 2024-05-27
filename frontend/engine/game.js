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
 * @param {string} color color of figure
 * @param {number} size size of figure
 * @param {string} shape shape of figure, might be i, l, j, o, t, s, z
 * @param {CanvasRenderingContext2D} renderer 
 * @returns {object}
 */
const Figure = function({id, siblings, cx, cy, color, size, shape, renderer} = {}){
    /**
     * 
     * @param {string} shape shape of figure, might be i, l, j, o, t, s, z
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
                    x: cx - ((h_count / 2) - 1) * size,
                    y: cy - (size / 2),
                });

                parts.push({
                    x: cx,
                    y: cy - (size / 2),
                });

                parts.push({
                    x: cx + size,
                    y: cy - (size / 2),
                });
            }

            return parts;
        } else {
            throw new Error("Figure generating internal function '__generate' has bad shape arg");
        }
    }

    // TODO: replace temp solution
    shape = 'i';

    return {
        // TODO: make cx and cy correct calculating
        id: id,
        cx: cx,
        cy: cy,

        isFreezed: false,
        isFalling: true,

        siblings: siblings,

        size: size,
        color: color,
        shape: shape,
        parts: __generate(shape),
        renderer: renderer,

        checkForTouches: function(targets, direction){
            let result = false;
   
            let otherFigures = targets;

            let otherParts = [];

            otherFigures.forEach(figure => {
                otherParts = otherParts.concat(figure.parts);
            });

            let hBuffer = [];
            
            // console.log(this.parts[0].x);

            this.parts.forEach(part =>{
                // console.log('---')
                otherParts.forEach(otherPart => {
                    let a = isTouchingTo(part, otherPart, this.size, direction)
                    if(a) {
                        // console.log(a, part, otherPart);
                        result = a;
                    }

                    // if(part) {
                    //     // && (part.x + this.size > otherPart.x && part.x + this.size < otherPart.x + this.size);
                    //     let xTouch = (part.x > otherPart.x && part.x < otherPart.x + this.size)
                    //     let yTouch = part.y + this.size >= otherPart.y - this.size;

                    //     if(part.x < otherPart.x + this.size) hBuffer.push(true);
                    //     // console.log(hBuffer.length > 0);
                    //     console.log(hBuffer.length > 0, 'x1: ', part.x, 'x2: ', (otherPart.x + this.size));

                    //     // console.log(part.y + this.size, otherPart.y - this.size);
                    //     if(xTouch) {
                    //         result = true;
                    //     }
                    // }
                });
            })

            return result;
        },


        /**
         * Moves figure to direction
         * @param {string} direction direction of movement
         * @param {number} speed speed of movement (by one step)
         * @param {Function} onFieldBorderTouch what happens when figure touches the border. Currently available ONLY for 'down' direction
         * @param {Function} onFieldBorderCollide what happens when figure collides with the border
         * 
         */
        move: function({direction, speed, onFieldBorderTouch, onOtherFigureTouch, onFieldBorderCollide}){
            // storing info when part touch border
            let touchBuffer = [];

            // sotring info when part collide border
            let collisionBuffer = [];

            // callback function for touch event
            let onTouchCB = typeof onFieldBorderTouch == 'function' ? onFieldBorderTouch : function(){};

            let onOtherTouchCB = typeof onOtherFigureTouch == 'function' ? onOtherFigureTouch : function(){};

            // callback function for collide event 
            let onCollideCB = typeof onFieldBorderCollide == 'function' ? onFieldBorderCollide : function(){};

            // Checking that figure on freezed
            if(this.isFreezed === false){
                let delta = speed || this.size;


                // TODO: maybe refactor this part?
                if(direction == 'left') {
                    // Collision checking
                    // Check collision for every part of figure
                    this.parts.forEach(singlePart => {
                        // if figure part is to the left than the field edge
                        // that means part is collides with field edge
                        if(singlePart.x - this.size < 0) {
                            // save that info to buffer
                            collisionBuffer.push(true);
                        }
                    });

                    // if buffer length > 0 - detected collision of any part
                    // if detected - stop moving speed (delta) and invoke collide callback function;
                    if(collisionBuffer.length > 0) {
                        delta = 0;
                        onCollideCB(this);
                    }

                    // TODO: refactor this
                    if(this.checkForTouches(this.siblings, 'right')){
                        delta = 0;
                        
                        if(this.checkForTouches(this.siblings, 'down')){
                            console.log('colliding', delta, direction);
                            onOtherTouchCB(this);
                        }
                    };

                    // Moving
                    this.parts.forEach(singlePart => {
                        singlePart.x = singlePart.x - delta;
                    });

                    this.cx = this.cx - delta;
                }

                if(direction == 'right') {
                    // Collision checking
                    // Check collision for every part of figure
                    this.parts.forEach(singlePart => {
                        // if figure part is to the right than the field edge
                        // that means part is collides with field edge
                        if(singlePart.x > (this.renderer.context.canvas.width - this.size * 2)) {
                            // save that info to buffer
                            collisionBuffer.push(true);
                        }               
                    });

                    // if buffer length > 0 - detected collision of any part
                    // if detected - stop moving speed (delta) and invoke collide callback function;
                    if(collisionBuffer.length > 0) {
                        delta = 0;  
                        onCollideCB(this);
                    }

                    if(this.checkForTouches(this.siblings, 'left')){
                        delta = 0;

                        if(this.checkForTouches(this.siblings, 'down')){
                            console.log('colliding left down', delta, direction);
                            onOtherTouchCB(this);
                        };
                    };

                    // Moving
                    this.parts.forEach(singlePart => {
                        singlePart.x = singlePart.x + delta;
                        
                    });

                    this.cx = this.cx + delta;
                }

                if(direction == 'down') {
                    // Collision checking
                    // Check collision for every part of figure
                    this.parts.forEach(singlePart => {
                        // if figure part is close to the bottom of the field edge
                        // that means part is touches field edge
                        // DEV
                        if(singlePart.y > (this.renderer.context.canvas.height - this.size)) {
                            // save that info to buffer
                           touchBuffer.push(true);
                        }

                        // if figure part is to the bottom than the field edge
                        // that means part is collides with field edge
                        if(singlePart.y > (this.renderer.context.canvas.height - this.size)) {
                             // save that info to buffer
                            collisionBuffer.push(true);
                        }         
                    });

                    // if buffer length > 0 - detected touching 
                    // if detected - invoke touch callback function
                    if(touchBuffer.length > 0) {
                        onTouchCB(this);
                    }

                    if(this.checkForTouches(this.siblings, 'down')){
                        delta = 0;
                        console.log('colliding', delta);
                        onOtherTouchCB(this);
                    };

                    // if buffer length > 0 - detected collision of any part
                    // if detected - stop moving speed (delta) and invoke collide callback function;
                    if(collisionBuffer.length > 0) {
                        delta = 0;
                        onCollideCB(this);
                    }

                    // Moving
                    this.parts.forEach(singlePart => {
                        singlePart.y = singlePart.y + delta;
                    });

                    this.cy = this.cy + delta;
                }

                if(direction == 'up') {
                    // at this place in future we can add figure rotating feature
                }
            }
        },

        updateStyle: function(styleProperty, newValue){
            let objectAllowedProprties = ['color', 'size'];

            if(objectAllowedProprties.indexOf(styleProperty) > -1){
                this[styleProperty] = newValue;
            } else {
                throw new Error(`Figure 'updateStyle' function has bad argument. styleProperty = ${styleProperty}`);
            }
        },

        fall: function(){
            this.isFalling = false;
        },

        /**
         * Renders single figure
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

            if(SETTINGS.dev.__renderFigureCenter.state === true){
                let r = 4;

                this.renderer.drawPoint({
                    x: this.cx + (r/2), 
                    y: this.cy, 
                    r: r, 
                    c: 'red',
                });
            }

            if(SETTINGS.dev.__rendeFieldFreeSpaceBoundingRect.state === true){
                
            }
        },
    }
};



const Game = function({renderOn}){    
    if(renderOn){
        // start point counting figure IDs
        let basicID = -1;

        /**
         * Internal helper function to generate new ID
         * @returns 
         */
        function __generateID(){
            basicID++;

            return basicID;
        }

        // private value ?
        const renderer = new Renderer({
            context: renderOn.getContext("2d"),
        });

        const settings = new Settings();

        const dev_ui = new DevUI(settings.dev);

        const controls = new Controls({target: renderOn});

        const fps = (1000 / 25);

        return {
            player: null,
            startingPoint: {
                x: (renderer.context.canvas.width/2),
                y: 13,
            },
            field: [],
            
            /**
             * Create figure object and adds to game field
             * @param {number} cx figure center x coordinate
             * @param {number} cy figure center y coordinate
             * @param {number} shape type of figure
             * @param {string} color color of figure
             */
            addFigureToField: function({cx, cy, shape, color} = {}){
               if((cx && cy) && (typeof cx == 'number' && typeof cy == 'number')){
                    color = color || 'black';
                    shape = shape || 0;

                    const size = 25;
                    const figure = new Figure({
                        // update Game stored figure ID
                        id: __generateID(),

                        siblings: this.field.filter(figure => {
                            if(figure.id !== this.id) {
                                return figure;
                            }
                        }),
                        
                        cx: cx, 
                        cy: cy,
                        color: color, 
                        size: size,
                        shape: shape, 
                        renderer: renderer,
                    });

                    console.log('Added new figure: ', figure);
                    this.field.push(figure);

                    return figure;
               } else {
                    throw new Error("Game class method 'addFigureToField' has bad cx cy args");
               }
            },

            
            /**
             * Renders all filed figures 
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
             * Implements the gravitational effect of the player figure
             * @param {object} target target of gravity impact
             */
            gravitize: function(){
                // If gravity turn on
                if(SETTINGS.dev.__disableGravity.state === false){
                    let direction = 'down';

                    this.player.move({
                        direction: direction,

                        onOtherFigureTouch: figure => {
                            console.log('test');
                            figure.updateStyle('color', 'red');
                            this.player = this.spawnFigure();
                        },

                        onFieldBorderTouch: figure => {
                            console.log('border touch event');

                            // make it static
                            figure.isFalling = false;
                            figure.isFreezed = true;
                            figure.updateStyle('color', 'blue');

                            this.player = this.spawnFigure();
                        }
                    });
                }
            },


            /**
             * Spawn a new block and add it to game field
             * @returns {object}
             */
            spawnFigure: function(){
                let startPointIsFull = false;
                this.field.forEach(figure => {
                    if(figure.cy == this.startingPoint.y) startPointIsFull = true;
                })

                if(startPointIsFull === false){
                    let figure = this.addFigureToField({
                        cx: this.startingPoint.x, 
                        cy: this.startingPoint.y, 
                        color: "black"
                    });

                    figure.isFalling = true;
                    figure.isFreezed = false;

                    return figure;
                } else {
                    // TODO: make game over more correct way
                    // Now it thrown an error
                    console.log('Start point is full! GAME OVER!');
                    return false;
                }
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

                dev_ui.init();

                // binding a settings object to a global variable
                SETTINGS = settings;

                // init controls module
                controls.init();

                // create and add player figure
                let player = this.spawnFigure();
                this.player = player;

                // render all game figures include movements
                setInterval(self.render.bind(self), fps);

                // update gravity impact at target figure
                setInterval(self.gravitize.bind(self), 90 / SETTINGS.gravity);

                // Movement managment
                controls.on('up', () => {
                    let direction = 'up';
                    this.player.move({
                        direction: direction,
                    });
                });

                controls.on('left', () => {
                    let direction = 'left';

                    this.player.move({
                        direction: direction,

                        onOtherFigureTouch: figure => {
                            figure.updateStyle('color', 'yellow');
                            this.player = this.spawnFigure();
                        },
                        
                        // demo code
                        onFieldBorderCollide: function(figure){
                            console.log('Figure collide with '+ direction +' border of game field');
                        }
                    });
                });

                controls.on('right', () => {
                    let direction = 'right';

                    this.player.move({
                        direction: direction,

                        onOtherFigureTouch: figure => {
                            figure.updateStyle('color', 'magenta');
                            this.player = this.spawnFigure();
                        },

                         // demo code
                        onFieldBorderCollide: function(figure){
                            console.log('Figure collide with '+ direction +' border of game field');
                        }
                    });
                });

                controls.on('down', () => {
                    let direction = 'down';

                    this.player.move({
                        direction: direction,

                        onOtherFigureTouch: figure => {
                            figure.updateStyle('color', 'green');
                            this.player = this.spawnFigure();
                        },

                        onFieldBorderTouch: figure => {
                            console.log('border touch event');

                            // make it static
                            figure.isFalling = false;
                            figure.isFreezed = true;
                            figure.updateStyle('color', 'blue');

                            this.player = this.spawnFigure();
                        }
                    });
                });
            }
        }

    } else {
        throw new Error("Game class param 'renderOn' has bad value");
    }
}