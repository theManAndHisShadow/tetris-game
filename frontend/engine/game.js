console.log('[Log]: Starting game.js');

/**
 * global SETTINGS var ref to settings object.
 * This value is global for easy acces to settings from any place in game logic
 * Nota bene! Before settings object inits this var is null!
 */
let SETTINGS = null;


const Game = function({screenElement, fieldSize, gridCellSize}){    
    gridCellSize = gridCellSize || 20;
    fieldSize = fieldSize || [10, 16];

    if(screenElement){
        // creating game canvas
        let nextFiguresWidth = 85;
        let nextFiguresHeight = 185;
        let fieldWidth = fieldSize[0] * gridCellSize;
        let fieldHeight = fieldSize[1] * gridCellSize;

        let canvas = document.createElement('canvas');
        screenElement.appendChild(canvas);

        const screen = new GameScreen({
            html: screenElement, 
            canvas: canvas,
        });

        // setting canvas based on fieldSize and gridCellSize (in pixels)
        canvas.width = fieldWidth + nextFiguresWidth;
        canvas.height = fieldHeight;

        // start point counting figure IDs
        let basicID = 0;

        const renderer = new Renderer({
            context: screen.canvas.getContext("2d"),
        });

        const settings = new Settings();

        const ui = new UI({parentScreen: screenElement});

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
         * @param {number} gridCellSize size of grid cell
         * @param {string} linesColor color of grid line
         */
        function __drawFieldGrid(field, linesColor){
            linesColor = linesColor || SETTINGS.themes.night.gridColor;
            
            const horizontal_amount = field.width / field.gridCellSize;
            const verical_amount = field.height / field.gridCellSize;

            for(let h = 0; h <= horizontal_amount; h++){
                for(let v = 0; v <= verical_amount; v++){
                    renderer.drawLine({
                        x1: gridCellSize * h, y1: 0,
                        x2: gridCellSize * h, y2: field.height,
                        c: linesColor, w: 2,
                    });

                    renderer.drawLine({
                        x1: 0, y1: gridCellSize * v,
                        x2: field.width, y2: gridCellSize * v,
                        c: linesColor, w: 1,
                    });
                }
            }
        }

        const dev_ui = new DevUI(settings.dev);

        const controls = new Controls({target: screen});

        const fps = 25;
        const fpsInterval = (1000 / fps);

        return {
            screen: screen,
            player: null,
            playerProjection: null,

            field: {
                gridCellSize: gridCellSize,
                size: fieldSize,
                width: fieldWidth,
                height: fieldHeight,
                figures: [],
                highestLine: 0,
            },

            nextFigures: {
                queue: [],
                width: nextFiguresWidth,
                height: nextFiguresHeight,
            },

            ui: ui,
            gameover: false,

             /**
             * Create figure object and adds to game field
             * @param {number} cx figure center x coordinate
             * @param {number} cy figure center y coordinate
             * @param {number} shape type of figure
             * @param {string} color color of figure
             * @return {object}
             */
            createFigure: function({id, cx, cy, shape, color, parent, size} = {}){
                id = id || null;
                color = color || 'black';
                shape = shape || 0;
                size = size || this.field.gridCellSize;

                const figure = new Figure({
                    parent: parent,
                    siblings: this.field.figures.filter(figure => {
                        if(figure.id !== this.id) {
                            return figure;
                        }
                    }),
                    
                    id: id,
                    cx: cx, 
                    cy: cy,
                    color: color, 
                    size: size,
                    shape: shape, 
                    renderer: renderer,
                });

                return figure;
            },

            createProjectionFor: function(figure){
                const projection = new FigureProjection(figure);

                return projection;
            },

            checkLineCompletitions: function () {
                /**
                 * Internal helper function, returns true if target line is complete (full)
                 * @param {number} lineNumber target line number
                 * @returns {boolean}
                 */
                const __lineChecker = (lineNumber) => {
                    // calculate taget line height
                    let lineHeight = renderer.context.canvas.height - (lineNumber * this.field.gridCellSize); 

                    // saving target blocks
                    let targets = [];

                    // check all field figures...
                    this.field.figures.forEach(figure => {
                       //...but only freezed figures...
                        if (figure.isFreezed === true) {
                             //... and their blocks, 
                            figure.blocks.forEach(block => { 
                                // saving block to targets array
                                if (block.y == lineHeight) targets.push(block); 
                            });
                        }
                    });

                    let state = targets.length == this.field.size[0];

                    return {isComplete: state, targets};
                };

                // check lines from 1 to current highest value
                for(let lineNum = 1; lineNum <= this.field.highestLine; lineNum++) {
                    // get result of checker
                    let line = __lineChecker(lineNum);

                    // if checker says that line is complete
                    if(line.isComplete === true) {
                        // log this
                        console.log('Line ' + lineNum + ' is complete now');

                        // delete all targets from checker
                        line.targets.forEach(targetBlock => {
                            targetBlock.deleteFrom(this.field.figures);
                        });

                        // decrease highest value (update value after all deletions)
                        this.field.highestLine = this.field.highestLine > 0 ? this.field.highestLine - 1 : 0;

                        // forcefully move downward all remaining frozen blocks after removal
                        this.field.figures.forEach(figure => {

                            figure.move({
                                // froce flag for ignoring 'isFreezed' state!
                                force: true,
                                
                                direction: 'down',
                            });
                        });
                        
                        // 10 point per deleted block
                        this.ui.scores.add(this.field.size[0] * 10);
                        this.ui.lines.update();

                        // additional checking after line is deleted
                        this.checkLineCompletitions();
                    }
                }
            },

            setHighestLine: function(figure){
                let line = (renderer.context.canvas.height - (figure.blocks.sort((a, b) => a.y - b.y)[0].y)) / this.field.gridCellSize;
                this.field.highestLine = line > this.field.highestLine ? line : this.field.highestLine;

                console.log('Hightest line: ' + this.field.highestLine);
            },


            /**
             * Returns random shape letter
             * @returns {string}
             */
            getRandomShape: function() {
                const shapesLetters = ['i', 'j', 'l', 'o', 't', 's', 'z'];
                const randomPos = getRandomNumber(0, shapesLetters.length - 1); // Generate a random index to select a shape from shapesLetters array

                return shapesLetters[randomPos];
            },



            /**
             * Return array of generated figures
             * @param {number} length length of shapes quque
             * @param {Array} shapeLettersQueue Optional param. If empty when generates new random queue
             * @returns {Array}
             */
            generateShapeQueue: function(length, shapeLettersQueue) {
                let queue = [];
                let miniDisplaySectionSize =  this.nextFigures.height / length;

                for (let i = 0; i < length; i++) {
                    // If empty when generates new random queue
                    const shape = (shapeLettersQueue && shapeLettersQueue[i]) ? shapeLettersQueue[i] : this.getRandomShape();

                    const nextFigure = this.createFigure({
                        cx: this.field.width + (this.nextFigures.width / 2),
                        // use equal portions of minidisplay
                        cy: (miniDisplaySectionSize * i + 1) + (miniDisplaySectionSize / 2),
                        color: SETTINGS.themes.night.figures[shape],
                        parent: this.field,
                        size: 10,
    
                        // generate each time figure from queue
                        shape: shape,
                    });

                    queue.push(nextFigure);
                }

                return queue;
            },
            

            
            /**
             * Generates new random queue of figures, sets 'this.nextFigures.queue'
             * @param {number} length length of queue
             */
            generateQueue: function(length){
                // set queue values from shapes array
                this.nextFigures.queue = this.generateShapeQueue(length);
            },



            /**
             * Re-generate quueue, resets 'this.nextFigures.queue'
             */
            regenerateQueue: function(){
                let shapeLettersQueue = [...this.nextFigures.queue].map(figure => {
                    return figure.shape;
                });

                shapeLettersQueue.push(this.getRandomShape());

                // set queue values from shapes array
                this.nextFigures.queue = this.generateShapeQueue(shapeLettersQueue.length, shapeLettersQueue);
            },



            /**
             * Render all items of next figures queue
             */
            renderQueue: function(){
                this.nextFigures.queue.forEach(nextFigure => {
                    nextFigure.render();
                });
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

                renderer.drawRect({
                    x: 0, y: 0,
                    w: renderer.context.canvas.width,
                    h: renderer.context.canvas.height,
                    c: SETTINGS.themes.night.fieldColor,
                })

                if(settings.dev.__drawFieldGrid.state === true) {
                    __drawFieldGrid(this.field);
                }

                // nextFigures
                renderer.drawRect({
                    x: this.field.width + 1,
                    y: 0,
                    w: this.nextFigures.width,
                    h: this.nextFigures.height,
                    c: '#1c202f',
                });

                this.renderQueue();

                this.playerProjection.render();

                // re-render
                this.field.figures.forEach(fieldItem => {
                    fieldItem.render();     
                });

                // updating stopwatch values
                if(this.gameover == false) {
                    ui.stopwatch.update();
                }


                if(settings.dev.__renderHighestLine.state === true) {
                    // Calculating highest line hight pixels
                    let highestLineHeight = renderer.context.canvas.height - this.field.highestLine * this.field.gridCellSize;

                    // render current highest line
                    renderer.drawLine({
                        x1: 0, y1: renderer.context.canvas.height,
                        x2: 0, y2: highestLineHeight,
                        w: 3, c: 'red'
                    });
                }

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
                                figure.freeze();
                                this.setHighestLine(figure);
                                this.checkLineCompletitions();
                                this.ui.figures.update();

                                this.player = this.spawnFigure();
                            }

                            if(collideWith == 'figure') {
                                figure.freeze();

                                this.setHighestLine(figure);
                                this.checkLineCompletitions();
                                this.ui.figures.update();

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
                // get shape from arg or get first item of next figures queue
                shape = shape || this.nextFigures.queue.shift().shape;

                // after grabbing first item of queue we need to re-generate queue
                this.regenerateQueue();


                // Now the end of the game is considered from the moment the counter reaches the highest point, 
                // ...that is, the height of the field (in blocks) minus 2 blocks
                if(this.field.highestLine > this.field.size[1] -2) startPointIsFull = true;

                if(startPointIsFull === false){
                    let figure = this.createFigure({
                        // update Game stored figure ID
                        id: __generateID(),
                        color: SETTINGS.themes.night.figures[shape],
                        parent: this.field,

                        // generate each time random figure
                        shape: shape,
                    });

                    this.field.figures.push(figure);
                    console.log('Added new figure: ', figure);

                    figure.isFalling = true;
                    figure.isFreezed = false;

                    // creating 'shadow' fugire that copies some player figure values (x pos, angle)
                    let newFigureProjection = this.createProjectionFor(figure);
                    this.playerProjection = newFigureProjection;

                    // update projection position 
                    this.playerProjection.syncPosition();

                    return figure;
                } else {
                    // TODO: add some visual
                    let endMessage = 'Game over! Your score: ' + this.ui.scores.value;
                    this.gameover = true;

                    console.log(endMessage);
                    alert(endMessage);
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

                ui.init(fpsInterval);

                // binding a settings object to a global variable
                SETTINGS = settings;

                // init controls module
                controls.init();

                // generating initial queue of random figures
                this.generateQueue(3);

                // create and add player figure
                let player = this.spawnFigure();
                this.player = player;

                // render all game figures include movements
                setInterval(self.render.bind(self), fpsInterval);

                // update gravity impact at target figure
                setInterval(self.gravitize.bind(self), 90 / SETTINGS.gravity);

                // manual fugire spawn
                dev_ui.devSettings.__spawnFigure.execute = (data) => {
                    this.field.figures = [];
                    this.player = null;
                    this.player = this.spawnFigure(data);
                };
                
                // some panel theming
                if(dev_ui.devSettings.__devMode.state === true) {
                    let devPanel = document.querySelector('#dev-panel');
                    let manualSpawnButtons = devPanel.querySelectorAll('[data-button-value]');

                    manualSpawnButtons.forEach(spawnButton => { 
                        spawnButton.style.background = SETTINGS.themes.night.figures[spawnButton.getAttribute('data-button-value')] 
                    });
                }

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

                    // Rotating figure by pressing w/UpArrow
                    this.playerProjection.syncPosition();
                });

                controls.on('left', () => {
                    let direction = 'left';
                    
                    // Moving figure to left by pressing a/LeftArrow
                    this.player.move({
                        direction: direction,
                        onCollide: (figure, collideWith) => {
                            figure.trembleOnCollide(direction);
                            this.screen.tremble('right');

                            if(collideWith == 'fieldBorder') {
                                console.log('Figure collide with '+ direction +' border of game field');
                            }

                            if(collideWith == 'figure') {
                                figure.freeze();
                                this.setHighestLine(figure);
                                this.checkLineCompletitions();
                                this.player = this.spawnFigure();
                            }
                        } 
                    });

                    // update projection position 
                    this.playerProjection.syncPosition();
                });

                controls.on('right', () => {
                    let direction = 'right';

                    // Moving figure to left by pressing d/RightArrow
                    this.player.move({
                        direction: direction,
                        onCollide: (figure, collideWith) => {
                            this.playerProjection.syncPosition();
                            figure.trembleOnCollide(direction);
                            this.screen.tremble('left');

                            if(collideWith == 'fieldBorder') {
                                console.log('Figure collide with '+ direction +' border of game field');
                            }

                            if(collideWith == 'figure') {
                                figure.freeze();
                                this.setHighestLine(figure);
                                this.checkLineCompletitions();

                                this.player = this.spawnFigure();
                            }
                        },
                    });

                    // update projection position 
                    this.playerProjection.syncPosition();
                });

                controls.on('down', () => {
                    let direction = 'down';

                    // Moving figure to down by pressing s/DownArrow
                    this.player.move({
                        direction: direction,
                        onCollide: (figure, collideWith) => {
                            if(collideWith == 'fieldBorder') {
                                // make it static
                                figure.freeze();
                                this.setHighestLine(figure);
                                this.checkLineCompletitions();
                                this.ui.figures.update();
    
                                this.player = this.spawnFigure();
                            }

                            if(collideWith == 'figure') {
                                // figure.updateStyle('color', 'green');
                                figure.freeze();
                                this.setHighestLine(figure);
                                this.checkLineCompletitions();
                                this.ui.figures.update();

                                this.player = this.spawnFigure();
                            }
                        },
                    });
                });
                
                controls.on('space', () => {
                    // at space key fast move figure to down
                    if(this.player.isFreezed == false){
                        this.player.moveDownUntilCollide({
                            // when it colliding with something
                            onCollide: figure => {
                                // start starndart procedure
                                figure.freeze();
                                this.setHighestLine(figure);
                                this.checkLineCompletitions();
                                this.ui.figures.update();

                                this.screen.tremble('down');
    
                                this.player = this.spawnFigure();
                            },
                        });
                    }
                });
            }
        }

    } else {
        throw new Error("Game class param 'screen' has bad value");
    }
}