console.log('[Log]: Starting game.js');

/**
 * global SETTINGS var ref to settings object.
 * This value is global for easy acces to settings from any place in game logic
 * Nota bene! Before settings object inits this var is null!
 */
let SETTINGS = null;


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
            spawnFigure: function(shape){
                let startPointIsFull = false;
                let shapesLetters = ['i', 'j', 'l', 'o', 't', 's', 'z'];
                shape = shape || shapesLetters[getRandomNumber(0, 6)];

                this.field.forEach(figure => {
                    if(figure.cy == this.startingPoint.y) startPointIsFull = true;
                })

                if(startPointIsFull === false){
                    let figure = this.addFigureToField({
                        color: "black",

                        // generate each time random figure
                        shape: shape,
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

                dev_ui.devSettings.__spawnFigure.execute = (data) => {
                    this.field = [];
                    this.player = null;
                    this.player = this.spawnFigure(data);
                };

                // Movement managment
                controls.on('up', () => {
                    let direction = 'up';

                    // Rotating figure by pressing w/UpArrow
                    this.player.rotate({
                        // if fugure done full rotation
                        onFullRotate: (figure) => {
                            // iterate coounter
                            figure.rotations += 1;

                            console.log('Full rotations: ' + figure.rotations)
                        }
                    });
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