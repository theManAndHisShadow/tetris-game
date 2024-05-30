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
     * Internal helper function to get matrix of some particular shape.
     * @param {string} shape shape of figure, might be i, l, j, o, t, s, z
     * @returns {object}
     */
    function __getShapeMatrix(shape){
        shape = shape || 'i';

        // Each shape has 2 important props:
        // center of shape (for correct position, moving, rotating)
        // shape parts configuration array (n-dimensional matrix), 
        // where 0 - empty part, 1 - part
        const shapes = {
            i: {
                center:[2, 1],
                matrix: [
                            [1, 1, 1, 1],
                        ]
            },

            o: {
                center: [1, 1],
                matrix: [
                    [1, 1],
                    [1, 1],
                ]
            }, 

            j: {
                center: [1, 2],
                matrix: [
                    [0, 1],
                    [0, 1],
                    [1, 1],
                ],
            },

            l: {
                center: [1, 2],
                matrix: [
                    [1, 0],
                    [1, 0],
                    [1, 1],
                ],
            },

            t: {
                center: [2, 1],
                matrix: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
            },

            z: {
                center: [2, 1],
                matrix: [
                    [1, 1, 0],
                    [0, 1, 1],
                ],
            },

            s: {
                center: [2, 1],
                matrix: [
                    [0, 1, 1],
                    [1, 1, 0],
                ],
            },
        }
        
       return shapes[shape];
    }

    /**
     * Internal helper function to generate parts for shape using shape-matrix.
     * @param {string} shapeLetter letter of shape
     * @returns {Array}
     */
    function __generateFromMatrix(shapeLetter){
        // Get shape matrix using shapeLetter
        let shape = __getShapeMatrix(shapeLetter);
        
        // create empty array
        let parts = [];

        // loop through matrix 'slices' (rows)
        shape.matrix.forEach((slice, i) => {
            // now loop through each value of slice
            slice.forEach((value, j) => {
                // if part is not empty
                if(value > 0) {
                    // generate new part
                    parts.push({
                        // Generating process uses offsets to generate correct pos of part
                        x: cx + (size*j) - (size * shape.center[0]),
                        y: cy + (size*i) - (size * shape.center[1]),
                    });
                }
            });
        });

        return parts;
    }

    /**
     * Internal helper function to set figure spawn point.
     * @param {string} shape shape letter of figure
     * @returns {object}
     */
    function __setSpawnPoint(shape, size){
        // horizontal center
        let spawPointX = ((renderer.context.canvas.width / size) / 2) * size;

        // verical pos
        let spawPointY = __getShapeMatrix(shape).center[1] * size;

        return { x: spawPointX, y: spawPointY }
    }

    
    shape = shape || 'i';

    // if cx and cy is empty - spawn at figure default spawn point (get using special function)
    cx = cx || __setSpawnPoint(shape, size).x;
    cy = cy || __setSpawnPoint(shape, size).y;

    return {
        // TODO: make cx and cy correct calculating
        id: id,
        cx: cx,
        cy: cy,
        angle: 0,

        // default spawn point of figure
        spawnPoint: __setSpawnPoint(shape, size),

        isFreezed: false,
        isFalling: true,

        siblings: siblings,

        size: size,
        color: color,
        shape: shape,
        parts: __generateFromMatrix(shape),
        renderer: renderer,

        /**
         * Method detect this.parts collision from particular side
         * @param {Array} targets an array of target objects with which collisions are expected from a given side
         * @param {string} direction the side from which the collision is expected
         * @returns 
         */
        checkCollisionWith: function(targets, direction){
            /**
            * Internal helper function that can detect of object colliding from side
            * @param {object} firstObject first target object
            * @param {object} secondObject second target object
            * @param {number} size size of object.part
            * @param {string} direction the side from which the collision is expected
            * @returns 
            */
            function __detectCollisionOnSide(first, second, size, direction) {
                // Checking that the first object touches the second in a downward direction.
                if (direction === 'down') {
                    return (first.y + size === second.y && 
                            first.x < second.x + size &&
                            first.x + size > second.x);
                }
                // Checking that the first object touches the second in a upward direction.
                else if (direction === 'top') {
                    return (second.y + size === first.y && 
                            first.x < second.x + size &&
                            first.x + size > second.x);
                }
                // Checking that the first object touches the second in a left-to-RIGHT direction
                else if (direction === 'right') {
                    return (first.x + size === second.x && 
                            first.y < second.y + size &&
                            first.y + size > second.y);
                }
                // Checking that the first object touches the second in a right-to-LEFT direction
                else if (direction === 'left') {
                    return (second.x + size === first.x && 
                            first.y < second.y + size &&
                            first.y + size > second.y);
                }

                else {
                    throw new Error('__detectCollisionOnSide side argument is incorrect!');
                }
            }

            let result = false;
            let otherFigures = targets;
            let otherParts = [];

            // gather all target parts at one dimension array
            otherFigures.forEach(figure => {
                otherParts = otherParts.concat(figure.parts);
            });
            
            // using two loops compare all coord using internal helper function
            this.parts.forEach(part =>{
                otherParts.forEach(otherPart => {
                    // store result of collision detecting from paricular side
                    let collision = __detectCollisionOnSide(part, otherPart, this.size, direction);

                    // is detected
                    if(collision) {
                        // store result
                        result = collision;
                    }
                });
            })

            return result;
        },


        /**
        * Checks for collisions based on the direction of movement.
        * @param {string} direction The direction of movement.
        * @returns {Object} An object containing collisionDetected and collideWith information.
        */
        checkCollision: function(direction) {
            let collisionDetected = false;
            let collideWith = null;

            // Saving info about collision of all parts
            let collisionBuffer = [];


            // checking when part of figure collides with field borders
            this.parts.forEach(singlePart => {
                // check if part collide with left side of field border
                if (direction === 'left' && singlePart.x - this.size < 0) {
                    collisionBuffer.push(true);
                    collideWith = 'fieldBorder';
                // check if part collide with right side of field border
                } else if (direction === 'right' && singlePart.x > (this.renderer.context.canvas.width - this.size * 2)) {
                    collisionBuffer.push(true);
                    collideWith = 'fieldBorder';
                 // check if part collide with bottom side of field border
                } else if (direction === 'down') {
                    if (singlePart.y > (this.renderer.context.canvas.height - this.size*2)) {
                        collisionBuffer.push(true);
                        collideWith = 'fieldBorder';
                    }
                }
            });

            // if some part collides with field border (watch at buffer length)
            if (collisionBuffer.length > 0) {
                collisionDetected = true;
                collideWith = 'fieldBorder';
            }

            // checking when part of figure collides with other fiqure part
            if (this.checkCollisionWith(this.siblings, direction)) {
                collisionDetected = true;
                collideWith = 'figure';

                // Additional check for bottom collidoing
                if (direction === 'left' || direction === 'right') {
                    if (!this.checkCollisionWith(this.siblings, 'down')) {
                        collideWith = 'side';
                    }
                }
            }

            return { collisionDetected, collideWith };
        },



        /**
        * Moves figure to direction
        * @param {string} direction direction of movement
        * @param {number} speed speed of movement (by one step)
        * @param {Function} onCollide callback function for collision events
        */
        move: function({direction, speed, onCollide}) {
            // Callback function for collide event
            let onCollideCB = typeof onCollide == 'function' ? onCollide : function(){};

            // Checking that figure is not freezed
            if(this.isFreezed === false) {
                let delta = speed || this.size;

                // Collision checking
                let { collisionDetected, collideWith } = this.checkCollision(direction);

                // Handle collisions (with fieldBorder or figure)
                if (collisionDetected) {
                    delta = 0;
                    onCollideCB(this, collideWith);
                }

                // Moving figure parts coords
                this.parts.forEach(singlePart => {
                    if (direction === 'left') {
                        singlePart.x -= delta;
                    } else if (direction === 'right') {
                        singlePart.x += delta;
                    } else if (direction === 'down') {
                        singlePart.y += delta;
                    }
                });

                // Move figure center coord
                if (direction === 'left') {
                    this.cx -= delta;
                } else if (direction === 'right') {
                    this.cx += delta;
                } else if (direction === 'down') {
                    this.cy += delta;
                }
            }
        },
        

        /**
         * Rotates an object by counterclockwise at game field
         */
        rotate: function(){
            // Save to object values between 0 and -360 by each time when its rotates
            this.angle = (this.angle - 90) < -360 ? 0 : (this.angle - 90);

            // Rotate each part of figure
            this.parts.forEach(part => {
                // Rotate x and y coords
                let {x, y} = rotatePoint(this.cx, this.cy, part.x, part.y, -90);
                
                part.x = x - this.size;
                part.y = y;
            });
        },


        updateStyle: function(styleProperty, newValue){
            let objectAllowedProprties = ['color', 'size'];

            if(objectAllowedProprties.indexOf(styleProperty) > -1){
                this[styleProperty] = newValue;
            } else {
                throw new Error(`Figure 'updateStyle' function has bad argument. styleProperty = ${styleProperty}`);
            }
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

                this.renderer.drawCircle({
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



const Game = function({renderOn, fieldSize, gridSize}){    
    gridSize = gridSize || 20;
    fieldSize = fieldSize || [10, 16];

    if(renderOn){
        renderOn.width = fieldSize[0] * gridSize;
        renderOn.height = fieldSize[1] * gridSize;

        // start point counting figure IDs
        let basicID = -1;

        // private value ?
        const renderer = new Renderer({
            context: renderOn.getContext("2d"),
        });

        const settings = new Settings();

        /**
         * Internal helper function to generate new ID
         * @returns 
         */
        function __generateID(){
            basicID++;

            return basicID;
        }

        /**
         *  Internal helper function to draw game field grid
         * @param {number} gridSize size of grid cell
         * @param {string} linesColor color of grid line
         */
        function __drawFieldGrid(gridSize, linesColor){
            linesColor = linesColor || '#FFA500';
            
            const height = renderer.context.canvas.height;
            const width = renderer.context.canvas.width;
            const horizontal_amount = width / gridSize;
            const verical_amount = height / gridSize;

            for(let h = 0; h <= horizontal_amount; h++){
                for(let v = 0; v <= verical_amount; v++){
                    renderer.drawLine({
                        x1: gridSize * h, y1: 0,
                        x2: gridSize * h, y2: height,
                        c: linesColor, w: 2,
                    });

                    renderer.drawLine({
                        x1: 0, y1: gridSize * v,
                        x2: width, y2: gridSize * v,
                        c: linesColor, w: 2,
                    });
                }
            }
        }

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
                    size: gridSize,
                    shape: shape, 
                    renderer: renderer,
                });

                console.log('Added new figure: ', figure);
                this.field.push(figure);

                return figure;
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

                if(settings.dev.__drawFieldGrid.state === true) {
                    __drawFieldGrid(gridSize);
                }

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
                        onCollide: (figure, collideWith) => {
                            if(collideWith == 'fieldBorder') {
                                // make it static
                                figure.isFalling = false;
                                figure.isFreezed = true;
                                figure.updateStyle('color', 'blue');
    
                                this.player = this.spawnFigure();
                            }

                            if(collideWith == 'figure') {
                                figure.updateStyle('color', 'red');
                                this.player = this.spawnFigure();
                            }
                        },
                    });
                }
            },


            /**
             * Spawn a new block and add it to game field
             * @returns {object}
             */
            spawnFigure: function(){
                let startPointIsFull = false;
                let shapesLetters = ['i', 'j', 'l', 'o', 't', 's', 'z'];

                this.field.forEach(figure => {
                    if(figure.cy == this.startingPoint.y) startPointIsFull = true;
                })

                if(startPointIsFull === false){
                    let figure = this.addFigureToField({
                        color: "black",

                        // generate each time random figure
                        shape: shapesLetters[getRandomNumber(0, 6)],
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

                    // Rotating figure by pressing w/UpArrow
                    this.player.rotate();
                });

                controls.on('left', () => {
                    let direction = 'left';
                    
                    // Moving figure to left by pressing a/LeftArrow
                    this.player.move({
                        direction: direction,
                        onCollide: (figure, collideWith) => {
                            if(collideWith == 'fieldBorder') {
                                console.log('Figure collide with '+ direction +' border of game field');
                            }

                            if(collideWith == 'figure') {
                                figure.updateStyle('color', 'yellow');
                                this.player = this.spawnFigure();
                            }
                        } 
                    });
                });

                controls.on('right', () => {
                    let direction = 'right';

                    // Moving figure to left by pressing d/RightArrow
                    this.player.move({
                        direction: direction,
                        onCollide: (figure, collideWith) => {
                            if(collideWith == 'fieldBorder') {
                                console.log('Figure collide with '+ direction +' border of game field');
                            }

                            if(collideWith == 'figure') {
                                figure.updateStyle('color', 'magenta');
                            this.player = this.spawnFigure();
                            }
                        },
                    });
                });

                controls.on('down', () => {
                    let direction = 'down';

                    // Moving figure to down by pressing s/DownArrow
                    this.player.move({
                        direction: direction,
                        onCollide: (figure, collideWith) => {
                            if(collideWith == 'fieldBorder') {
                                // make it static
                                figure.isFalling = false;
                                figure.isFreezed = true;
                                figure.updateStyle('color', 'blue');
    
                                this.player = this.spawnFigure();
                            }

                            if(collideWith == 'figure') {
                                figure.updateStyle('color', 'green');
                                this.player = this.spawnFigure();
                            }
                        },
                    });
                });
            }
        }

    } else {
        throw new Error("Game class param 'renderOn' has bad value");
    }
}