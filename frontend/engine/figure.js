console.log('[Log]: Starting figure.js');

const Block = function({id, x, y, color, size, lineGroup, parentFigureID} = {}){
    return {
        id: id,
        x: x,
        y: y,
        color: color,
        size: size,
        lineGroup: lineGroup,
        parentFigureID: parentFigureID,

        deleteFrom: function(from){
            from.forEach(figure => {
                if(figure.id == this.parentFigureID) {
                    figure.blocks = figure.blocks.filter(block => {
                        return block.id !== this.id;
                    });
                }
            });
        }
    }
};


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
const Figure = function({id, parent, siblings, cx, cy, color, size, shape, renderer} = {}){
    /**
     * Internal helper function to get matrix of some blockicular shape.
     * @param {string} shape shape of figure, might be i, l, j, o, t, s, z
     * @returns {object}
     */
    function __getShapeMatrix(shape){
        shape = shape || 'i';

        // Each shape has 2 important props:
        // center of shape (for correct position, moving, rotating)
        // shape blocks configuration array (n-dimensional matrix), 
        // where 0 - empty block, 1 - block
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
     * Internal helper function to generate blocks for shape using shape-matrix.
     * @param {string} shapeLetter letter of shape
     * @returns {Array}
     */
    function __generateFromMatrix(shapeLetter){
        // Get shape matrix using shapeLetter
        let shape = __getShapeMatrix(shapeLetter);
        
        // create empty array
        let blocks = [];

        // loop through matrix 'slices' (rows)
        shape.matrix.forEach((slice, i) => {
            // now loop through each value of slice
            slice.forEach((value, j) => {
                // if block is not empty
                if(value > 0) {
                    // generate new block
                    let newBlock = new Block({
                        id: blocks.length + 1,
                        x: cx + (size*j) - (size * shape.center[0]),
                        y: cy + (size*i) - (size * shape.center[1]),
                        color: color,
                        size: size,

                        parentFigureID: id,
                    });

                    blocks.push(newBlock);
                }
            });
        });

        return blocks;
    }

    /**
     * Internal helper function to set figure spawn point.
     * @param {string} shape shape letter of figure
     * @returns {object}
     */
    function __setSpawnPoint(shape, size){
        // horizontal center
        let spawPointX = ((parent.width / size) / 2) * size;

        // verical pos
        let spawPointY = __getShapeMatrix(shape).center[1] * size * 2;

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
        rotations: 0,

        // default spawn point of figure
        spawnPoint: __setSpawnPoint(shape, size),

        // this prop is true when figure already touches the ground
        isFreezed: false,

        // this property is true when a figure trembles if it is pushed against a wall
        isTrembling: false,

        // this property is true when figure spawned and falling down
        isFalling: true,

        parent: parent,
        siblings: siblings,

        size: size,
        color: color,
        shape: shape,
        shapeMatrix: __getShapeMatrix(shape),
        blocks: __generateFromMatrix(shape),
        renderer: renderer,

        /**
         * Method detect this.blocks collision from blockicular side
         * @param {Array} targets an array of target objects with which collisions are expected from a given side
         * @param {string} direction the side from which the collision is expected
         * @returns 
         */
        checkCollisionWith: function(targets, direction){
            /**
            * Internal helper function that can detect of object colliding from side
            * @param {object} firstObject first target object
            * @param {object} secondObject second target object
            * @param {number} size size of object.block
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
            let otherblocks = [];

            // gather all target blocks at one dimension array
            otherFigures.forEach(figure => {
                otherblocks = otherblocks.concat(figure.blocks);
            });
            
            // using two loops compare all coord using internal helper function
            this.blocks.forEach(block =>{
                otherblocks.forEach(otherblock => {
                    // store result of collision detecting from paricular side
                    let collision = __detectCollisionOnSide(block, otherblock, this.size, direction);

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
            let collisionType = null;
            let collideWith = null;

            // Saving info about collision of all blocks
            let collisionBuffer = [];


            // checking when block of figure collides with field borders
            this.blocks.forEach(singleBlock => {
                // console.log(singleBlock.x, singleBlock.y, singleBlock.x < 0);
                // check if block collide with left side of field border
                if (direction === 'left' && singleBlock.x == 0) {
                    collisionBuffer.push('touching');
                    collideWith = 'fieldBorder';
                } else if (direction === 'left' && singleBlock.x < 0) {
                    collisionBuffer.push('overlapping');
                    collideWith = 'fieldBorder';

                // check if block collide with right side of field border
                } else if (direction === 'right' && singleBlock.x == (this.parent.width - this.size)) {
                    collisionBuffer.push('touching');
                    collideWith = 'fieldBorder';
                 // check if block collide with bottom side of field border
                } else if (direction === 'right' && singleBlock.x > (this.parent.width - this.size)) {
                    collisionBuffer.push('overlapping');
                    collideWith = 'fieldBorder';

                 // check if block collide with bottom side of field border
                } else if (direction === 'down') {
                    if (singleBlock.y > (this.parent.height - this.size*2)) {
                        collisionBuffer.push('touching');
                        collideWith = 'fieldBorder';
                    }
                }
            });

            // if some block collides with field border (watch at buffer length)
            if (collisionBuffer.length > 0) {
                if(collisionBuffer.indexOf('overlapping') > -1) {
                    collisionType = 'overlapping';
                } else {
                    collisionType = 'touching';
                }

                collisionDetected = true;
                collideWith = 'fieldBorder';
            }

            // checking when block of figure collides with other fiqure block
            if (this.checkCollisionWith(this.siblings, direction)) {
                collisionDetected = true;
                collideWith = 'figure';

                // Additional check for bottom colliding
                if (direction === 'left' || direction === 'right') {
                    if (!this.checkCollisionWith(this.siblings, 'down')) {
                        collideWith = 'fieldBorder';
                    }
                }
            }

            return { collisionDetected, collisionType, collideWith };
        },



        /**
        * Moves figure to direction
        * @param {string} direction direction of movement
        * @param {number} speed speed of movement (by one step)
        * @param {Function} onCollide callback function for collision events
        */
        move: function({direction, speed, onCollide, force}) {
            // Callback function for collide event
            let onCollideCB = typeof onCollide == 'function' ? onCollide : function(){};

            // Checking that figure is not freezed
            if(force === true || this.isFreezed === false) {
                let delta = speed || this.size;

                // Collision checking
                let { collisionDetected, collisionType, collideWith } = this.checkCollision(direction);


                // Handle collisions (with fieldBorder or figure)
                if (collisionDetected) {
                    delta = 0;
                    onCollideCB(this, collideWith);
                } 

                // Moving figure blocks coords
                this.blocks.forEach(singleBlock => {
                    if (direction === 'left') {
                        singleBlock.x -= delta;
                    } else if (direction === 'right') {
                        singleBlock.x += delta;
                    } else if (direction === 'down') {
                        singleBlock.y += delta;
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
         * Moves figure to down until it collides with other figure/field border
         * @param {Function} onCollide callback function that invokes when colliding detected
         */
        moveDownUntilCollide: function({onCollide} = {}){
            // creating main variable
            let collideDetected = false;

            // setting cb function
            let onCollideCB = typeof onCollide == 'function' ? onCollide : function() {};

            // loop action until colliding is not detected
            while(!collideDetected) {
                // move down
                this.move({
                    direction: 'down',

                    // when colliding detected
                    onCollide: figure => {
                        // breake loop
                        collideDetected = true;
                        
                        onCollideCB(figure);
                    }
                });
            }
        },
        

        /**
         * Rotates an object by counterclockwise at game field
         * @param {Function} onFullRotate action at figure full rotate
         */
        rotate: function({onFullRotate} = {}) {
            // callback function for figure full rotate event
            const onFullRotateCB = typeof onFullRotate == 'function' ? onFullRotate : function() {};
        
            // saving original state and configuration of fugire
            const originalblocks = this.blocks.map(block => ({ ...block }));
            const originalAngle = this.angle;
        
            // trying to rotate (clone figure)
            this.angle = (this.angle - 90) % 360;
            const newblocks = this.blocks.map(block => {
                const { x, y } = rotatePoint(this.cx, this.cy, block.x, block.y, -90);
                block.x = x - this.size;
                block.y = y;

                return block;
            });
        
            // preparing some variables
            let collisionDetected = false;
            let collisionWithBorder = false;
            
            // Internal function to check collisions at figure rotating
            const __checkRotateCollision = () => {
                // inside loop checking collisions for single block
                for (const block of newblocks) {
                    // if block getting over game field
                    if (block.x < 0 || block.x >= this.parent.width || block.y >= this.parent.height) {

                        // set collision true
                        collisionWithBorder = true;
                        collisionDetected = true;
                        // break loop
                        break;
                    }
        
                    // if block collides with other figure`s block
                    for (const sibling of this.siblings) {
                        for (const siblingblock of sibling.blocks) {
                            if (block.x === siblingblock.x && block.y === siblingblock.y) {
                                // set collision true
                                collisionDetected = true;

                                // break loop
                                break;
                            }
                        }
                        if (collisionDetected) break;
                    }
                    if (collisionDetected) break;
                }
            };
            
            // checking collision
            __checkRotateCollision();
            
            // if collisin detected
            if (collisionDetected) {
                if (collisionWithBorder) {
                    // Trying to fix it using 'position compensation'
                    const directions = ['right', 'left'];

                    // for two directions left and right
                    for (const direction of directions) {
                        this.blocks = newblocks.map(block => {
                            const newblock = { ...block };
                            if (direction === 'right') newblock.x += this.size;
                            if (direction === 'left') newblock.x -= this.size;
                            return newblock;
                        });

                        // if we finally fix collision 
                        // setting collision false
                        collisionDetected = false;

                        // after one compensation checking collision again
                        __checkRotateCollision();

                        // if collision fixed - break the loop
                        if (!collisionDetected) break;
                    }
                }
                
                // if we cant fix problem
                // restore original state from backup
                if (collisionDetected) {
                    this.angle = originalAngle;
                    this.blocks = originalblocks;
                }
            } else {
                // if collisin not detected, just save rotated state as new origin
                this.blocks = newblocks;
            }
        
            // actions on figure full rotate
            if (this.angle % 360 === 0) {
                // invoke callback on figure full rotate
                onFullRotateCB(this);
            }
        },


        updateStyle: function(styleProperty, newValue){
            let objectAllowedProprties = ['color', 'size'];

            if(objectAllowedProprties.indexOf(styleProperty) > -1){
                this[styleProperty] = newValue;

                this.blocks.forEach(block => {
                    block[styleProperty] = newValue;
                });
            } else {
                throw new Error(`Figure 'updateStyle' function has bad argument. styleProperty = ${styleProperty}`);
            }
        },

        freeze: function(){
            this.isFalling = false;
            this.isFreezed = true;

            // this.updateStyle('color', 'blue');
        },

        /**
         * Causes a figure to shake when it touches the edge of the playing field
         * @param {string} direction 
         */
        trembleOnCollide: function(direction){
            // In case the previous animation is not yet finished, 
            // ...we ignore the execution of the code below. 
            if(!this.isTrembling){
                let collision = this.checkCollision(direction);
                let overlapping = collision.collisionType == 'overlapping';
                let counterDirection;
                if(direction == 'left') counterDirection = 'right';
                if(direction == 'right') counterDirection = 'left';
                // amount of tremble
                let delta = 2;

                // I'm concerned that on other computers, 
                // ...due to differences in processor speeds and the speed of information transmission 
                //...between pressing and processing, the code using this delay may not work.
                let delay = 75;
                
                // only when figure not overlapping with game field
                if(!overlapping) {
                    this.isFreezed = false;
                    this.isTrembling = true;
                    this.move({direction: counterDirection, speed: delta});
        
                    setTimeout(() => {
                        this.isFreezed = false;
                        this.isTrembling = false;
    
                        this.move({
                            direction: direction, 
                            speed: delta,
                        });
                    }, delay);
                } 
            }
        },

        /**
         * Renders single figure
         */
        render: function(){
            this.blocks.forEach(singleBlock => {
                this.renderer.drawSquare({
                    x: singleBlock.x,
                    y: singleBlock.y,
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
        },
    }
};

const FigureProjection = function(projectionOf){
    return {
        figure: {
            // Here we completely mimic the player’s figure, 
            //...so that the sync() and moveDownUntilCollide() method works correctly
            projection: new Figure({
                color: '#c0c0c04f',
                shape: projectionOf.shape,
                size: projectionOf.size,
                renderer: projectionOf.renderer,
                parent: projectionOf.parent,
                siblings: projectionOf.siblings,
            }),
        },

        // reference to target figure
        projectionOf: projectionOf,

        /**
         * Renders projection if figure
         */
        render: function(){
            this.figure.projection.render();
        },


        /**
         * Synchronizes part of the states of the target figure
         */
        syncPosition: function(){
            if(this.projectionOf.isTrembling == false){
                this.figure.projection.cx = this.projectionOf.cx;
            
                this.figure.projection.blocks.forEach((singleBlock, i) => {
                    singleBlock.x = this.projectionOf.blocks[i].x;
                    singleBlock.y = this.projectionOf.blocks[i].y;
                });

                // console.log(this.projectionOf);
                this.figure.projection.moveDownUntilCollide();
            }
        }
    }
};