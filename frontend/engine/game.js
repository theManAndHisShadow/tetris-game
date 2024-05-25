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
const Figure = function({cx, cy, color, size, shape, renderer} = {}){
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
            throw new Error("Figure generating internal function '__generate' has bad shape arg");
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
         * Moves figure to direction
         * @param {string} direction direction of movement
         * @param {number} speed speed of movement (by one step)
         * @param {Function} onFieldBorderTouch what happens when figure touches the border. Currently available ONLY for 'down' direction
         * @param {Function} onFieldBorderCollide what happens when figure collides with the border
         * 
         */
        move: function({direction, speed, onFieldBorderTouch, onFieldBorderCollide}){
            // storing info when part touch border
            let touchBuffer = [];

            // sotring info when part collide border
            let collisionBuffer = [];

            // callback function for touch event
            let onTouchCB = typeof onFieldBorderTouch == 'function' ? onFieldBorderTouch : function(){};

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

                        // if buffer length > 0 - detected collision of any part
                        // if detected - stop moving speed (delta) and invoke collide callback function;
                        if(collisionBuffer.length > 0) {
                            delta = 0;
                            onCollideCB(this);
                        }
                    });

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
                        if(singlePart.x > (this.renderer.context.canvas.width - this.size)) {
                            // save that info to buffer
                            collisionBuffer.push(true);
                        }               

                        // if buffer length > 0 - detected collision of any part
                        // if detected - stop moving speed (delta) and invoke collide callback function;
                        if(collisionBuffer.length > 0) {
                            delta = 0;  
                            onCollideCB(this);
                        }
                    });

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
                        if(singlePart.y > (this.renderer.context.canvas.height - this.size * 2)) {
                            // save that info to buffer
                           touchBuffer.push(true);
                        }

                        // if figure part is to the bottom than the field edge
                        // that means part is collides with field edge
                        if(singlePart.y > (this.renderer.context.canvas.height - this.size)) {
                             // save that info to buffer
                            collisionBuffer.push(true);
                        }         
                        
                        // if buffer length > 0 - detected touching 
                        // if detected - invoke touch callback function
                        if(touchBuffer.length > 0) {
                            onTouchCB(this);
                        }

                        // if buffer length > 0 - detected collision of any part
                        // if detected - stop moving speed (delta) and invoke collide callback function;
                        if(collisionBuffer.length > 0) {
                            delta = 0;
                            onCollideCB(this);
                        }
                    });

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
                this.parts.forEach(singlePart => {
                    singlePart[styleProperty] = newValue;
                });
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
                        cx: cx, cy: cy, color: color, size: size,
                        shape: shape, renderer: renderer
                    });

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
                    // if(fieldItem.isFalling === false){
                    //     fieldItem.move('down', 1);
                    //     console.log(fieldItem);
                    //     // this.parts.forEach(singlePart => {singlePart.x = singlePart.x - this.size});
                    // }

                    fieldItem.render();     
                });
            },


            gravitize: function(target){
                if(SETTINGS.dev.__disableGravity.state === false){
                    if(target.cy > renderer.context.canvas.height - target.size) {
                        target.isFalling = false;
                        target.isFreezed = true;
    
                        target.updateStyle('color', 'blue');
                        console.log('isFalling = false');
                    } else {
                        target.move('down');
                    }
                }

            },


            spawnBlocks: function(){
                let figure = this.addFigureToField({cx: renderer.context.canvas.width / 2 , cy: 15, color: "black"});

                if(figure.isFalling === false) {
                    figure = this.spawnBlocks();
                    console.log(figure)
                }

                // figure.fall();

                return figure;
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
                let player = this.spawnBlocks();
                this.player = player;

                // render all game figures include movements
                setInterval(self.render.bind(self), fps);

                // update gravity impact at target figure
                setInterval(self.gravitize.bind(self, player), 90 / SETTINGS.gravity);

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
                        onFieldBorderTouch: function(figure){
                            console.log('Figure touches'+ direction +' border of game field and freezed now');

                            figure.isFreezed = true;
                            figure.updateStyle('color', 'blue');
                        }
                    });
                });
            }
        }

    } else {
        throw new Error("Game class param 'renderOn' has bad value");
    }
}