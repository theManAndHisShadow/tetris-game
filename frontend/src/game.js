console.log('[Log]: Starting game.js');

import { getRandomNumber } from './misc/helpers.js';

import { Renderer } from './core/render.js';
import { GameScreen } from './core/screen.js';
import { GameEventTarget } from './core/event.js';
import { Figure, FigureProjection } from './core/figure.js';
import { Controls } from './core/controls.js';
import { SoundComposer } from './core/sound.js';
import { HUD } from './core/hud.js';



class Game extends GameEventTarget {
    #currentID = 0;

    constructor({ screenElement, fieldSize = [10, 16], gridCellSize = 20, settings, devTool }) {
        super();

        if (screenElement) {
            // preparing some data
            const fps = 25;
            const fpsInterval = (1000 / fps);
            const bufferSpace = 50;

            // sizes of nextFigure display
            const nextFiguresWidth = 85;
            const nextFiguresHeight = 185;

            // precalulating field sizes
            const fieldWidth = fieldSize[0] * gridCellSize;
            const fieldHeight = fieldSize[1] * gridCellSize;

            // manually creating canvas HTMLElement
            let canvas = document.createElement('canvas');
            // setting canvas full sizes based on fieldSize and gridCellSize (in pixels)
            canvas.width = fieldWidth + nextFiguresWidth + bufferSpace;
            canvas.height = fieldHeight;
            // addding to screen element at html
            screenElement.appendChild(canvas);
            // preparing Screen class instance
            const screen = new GameScreen({
                html: screenElement,
                canvas: canvas,
            });

            // preparing Renderer class instance
            const renderer = new Renderer({
                context: screen.canvas.getContext("2d"),
            });

            // const events = new SynteticEventSystem();

            // preparing Controls calss instance
            const controls = new Controls({ target: screen });

            // preparing SoundComposer class instance
            const soundComposer = new SoundComposer();

            // preparing Constrols class instance
            const hud = new HUD({ parentScreen: screenElement, fps: fps});

            this.fps = fps;
            this.fpsInterval = fpsInterval;
            // binding with new intance of Game class
            this.id = this.#generateID();
            this.settings = settings,
                this.devTool = devTool;

            this.player = null;
            this.playerProjection = null;

            // storing some fx states
            this.fxStates = {
                // Check if denied move effect can be played 
                isCanPlayDeniedMoveFX: true,
            };

            this.states = {
                isGamePaused: false,
                isGameOver: false,
            };

            this.field = {
                gridCellSize: gridCellSize,
                size: fieldSize,
                width: fieldWidth,
                height: fieldHeight,
                figures: [],
                highestLine: 0,
            };

            this.nextFigures = {
                queue: [],
                width: nextFiguresWidth,
                height: nextFiguresHeight,
            };

            this.renderer = renderer;
            this.screen = screen;
            this.hud = hud;
            // this.events = events;
            this.controls = controls;
            this.sounds = soundComposer;
        } else {
            throw new Error('cant create without screenElement!');
        }
    }


    /**
     * Get new ID value
     * @returns {Number}
     */
    #generateID() {
        this.#currentID += 1;
        return this.#currentID;
    }

    /**
     *  Private internal helper function to draw game field grid
     * @param {number} gridCellSize size of grid cell
     * @param {string} linesColor color of grid line
     */
    #drawFieldGrid(field, linesColor) {
        const horizontal_amount = field.width / field.gridCellSize;
        const verical_amount = field.height / field.gridCellSize;

        // thikness of grid line
        const thickness = 1;

        // offset for fixing grid line width (making it thinner)
        const offset = 0.5;

        //how many of field grid lines renders with gradient
        const gradientSectionLines = Math.round(field.size[1] * 0.45);

        // staring point for normal grid lines
        const staringPoint = field.gridCellSize * gradientSectionLines;

        // color of gradient colorStop
        const color = '#14151b';

        // coord for gradient
        const y2 = (gradientSectionLines * field.gridCellSize) / 2;

        for (let h = 0; h <= horizontal_amount; h++) {
            for (let v = 0; v <= verical_amount; v++) {

                // if lines of 'gradient part'
                // draw some lines using drawGradientLine
                if (v > gradientSectionLines) {
                    // drawning vertical lines
                    this.renderer.drawGradientLine({
                        x1: field.gridCellSize * h + offset, y1: 0 + offset,
                        x2: field.gridCellSize * h + offset, y2: staringPoint + offset,
                        c: linesColor, w: thickness,
                        colorStop1: color,
                        colorStop2: linesColor,
                        gradientCoords: {
                            x1: 0, y1: 0, x2: 0, y2: y2,
                        },
                    });

                    // drawning regular horizontal lines
                    this.renderer.drawLine({
                        x1: 0 + offset, y1: field.gridCellSize * v - offset,
                        x2: field.width + offset, y2: field.gridCellSize * v - offset,
                        c: linesColor, w: thickness,
                    });
                } else {
                    // drawning gradient horizontal lines
                    this.renderer.drawGradientLine({
                        x1: 0 + offset, y1: field.gridCellSize * v - offset,
                        x2: field.width + offset, y2: field.gridCellSize * v - offset,
                        w: thickness,
                        colorStop1: color,
                        colorStop2: linesColor,
                        gradientCoords: {
                            x1: 0, y1: 0, x2: 0, y2: y2,
                        },
                    });
                }


                // drawning regular vertical lines
                this.renderer.drawLine({
                    x1: field.gridCellSize * h + offset, y1: staringPoint + offset,
                    x2: field.gridCellSize * h + offset, y2: field.height + offset,
                    c: linesColor, w: thickness,
                });
            }
        }
    }


    /**
      * Create figure object and adds to game field
      * @param {Object} options - Options for creating the figure
      * @param {number} options.cx - Figure center x coordinate
      * @param {number} options.cy - Figure center y coordinate
      * @param {number} [options.shape=0] - Type of figure
      * @param {string} [options.color='black'] - Color of figure
      * @param {number} [options.id=null] - ID of the figure
      * @param {Object} [options.parent=null] - Parent of the figure
      * @param {number} [options.size=this.field.gridCellSize] - Size of the figure
      * @return {Figure} The created figure
      */
    createFigure({ id = null, cx, cy, shape = 0, color = 'black', parent = null, size = this.field.gridCellSize }) {
        id = id || null;
        color = color || 'black';
        shape = shape || 0;
        size = size || this.field.gridCellSize;

        const figure = new Figure({
            parent: parent,
            siblings: [],

            id: id,
            cx: cx,
            cy: cy,
            color: color,
            size: size,
            shape: shape,
            renderer: this.renderer,
        });

        return figure;
    }



    /**
     * updateValues 'figure.siblings' array
     */
    updateValueFieldSiblingsInfo() {
        // Save to field figure 'siblings' refs to other figures
        this.field.figures.forEach(fieldItem => {
            let siblings = [...this.field.figures].filter(figure => {
                // If the identifiers are different, this means that...
                // ...the figures are different, which means we add siblings to the array
                if (figure.id !== fieldItem.id) return figure;
            });

            // link new updateValued sibling array to field figure 'siblings' prop
            fieldItem.siblings = siblings;
        });
    }


    /**
     * Adds figure object into field figures array
     * @param {Figure} figureObject figure to add
     */
    addFigureToField(figureObject) {
        this.field.figures.push(figureObject);

        // TODO: check is do it really worth it?
        // after field figures array was changing - updateValue all field items siblings info
        this.updateValueFieldSiblingsInfo();
    }



    /**
     * Removes figure from field figures array
    * @param {Figure} figureObject figure to delete
    */
    removeFigureFromField(figureObject) {
        let index = this.field.figures.indexOf(figureObject);
        this.field.figures.splice(index, 1);

        // after field figures array was changing - updateValue all field items siblings info
        this.updateValueFieldSiblingsInfo(this.field.figures);
    }



    /**
     * Checks is taget figure's blocks array is emmpty
     * and if is true - removes figure from field array
     * @param {Figure} targetFigure 
     */
    checkIsGarbage(targetFigure) {
        if (targetFigure.blocks.length == 0) {
            console.log('[Log]: removing figure beacuse it has no blocks, figure -', targetFigure);
            this.removeFigureFromField(targetFigure);
        }
    }



    createProjectionFor(figure) {
        const projection = new FigureProjection(figure);

        return projection;
    }

    checkLineCompletitions() {
        /**
         * Internal helper function, returns true if target line is complete (full)
         * @param {number} lineNumber target line number
         * @returns {boolean}
         */
        const __lineChecker = (lineNumber) => {
            // calculate taget line height
            let lineHeight = this.renderer.context.canvas.height - (lineNumber * this.field.gridCellSize);

            // saving target blocks
            let targets = [];

            // check all field figures...
            this.field.figures.forEach(figure => {
                // check is figure has no blocks and if true - removes it
                this.checkIsGarbage(figure);

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

            return { isComplete: state, targets };
        };

        // check lines from 1 to current highest value
        for (let lineNum = 1; lineNum <= this.field.highestLine; lineNum++) {
            // get result of checker
            let line = __lineChecker(lineNum);

            // if checker says that line is complete
            if (line.isComplete === true) {
                // log this
                console.log('Line ' + lineNum + ' is complete now');

                // delete all targets from checker
                line.targets.forEach(targetBlock => {
                    targetBlock.deleteFrom(this.field.figures);
                });

                // decrease highest value (updateValue value after all deletions)
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
                this.hud.scores.updateValue(this.field.size[0] * 10);
                this.hud.lines.updateValue();
                this.sounds.play('sfx', 'score', 0.75);

                // additional checking after line is deleted
                this.checkLineCompletitions();
            }
        }
    }


    
    /**
    * Sets highest non-empty line of game field
    * @param {Figure} figure 
    */
    setHighestLine(figure) {
        let line = (this.renderer.context.canvas.height - (figure.blocks.sort((a, b) => a.y - b.y)[0].y)) / this.field.gridCellSize;
        this.field.highestLine = line > this.field.highestLine ? line : this.field.highestLine;

        console.log('Hightest line: ' + this.field.highestLine);
    };


    /**
     * Returns random shape letter
     * @returns {string}
     */
    getRandomShape() {
        const shapesLetters = ['i', 'j', 'l', 'o', 't', 's', 'z'];
        const randomPos = getRandomNumber(0, shapesLetters.length - 1); // Generate a random index to select a shape from shapesLetters array

        return shapesLetters[randomPos];
    }



    /**
     * Return array of generated figures
     * @param {number} length length of shapes quque
     * @param {Array} shapeLettersQueue Optional param. If empty when generates new random queue
     * @returns {Array}
     */
    generateShapeQueue(length, shapeLettersQueue) {
        let queue = [];
        let miniDisplaySectionSize = this.nextFigures.height / length;

        for (let i = 0; i < length; i++) {
            // If empty when generates new random queue
            const shape = (shapeLettersQueue && shapeLettersQueue[i]) ? shapeLettersQueue[i] : this.getRandomShape();

            const nextFigure = this.createFigure({
                cx: this.field.width + (this.nextFigures.width / 2),
                // use equal portions of minidisplay
                cy: (miniDisplaySectionSize * i + 1) + (miniDisplaySectionSize / 2),
                color: this.settings.themes.night.figures[shape],
                parent: this.field,
                size: 10,

                // generate each time figure from queue
                shape: shape,
            });

            queue.push(nextFigure);
        }

        return queue;
    }



    /**
     * Generates new random queue of figures, sets 'this.nextFigures.queue'
     * @param {number} length length of queue
     */
    generateQueue(length) {
        // set queue values from shapes array
        this.nextFigures.queue = this.generateShapeQueue(length);
    }



    /**
     * Re-generate quueue, resets 'this.nextFigures.queue'
     */
    regenerateQueue() {
        let shapeLettersQueue = [...this.nextFigures.queue].map(figure => {
            return figure.shape;
        });

        shapeLettersQueue.push(this.getRandomShape());

        // set queue values from shapes array
        this.nextFigures.queue = this.generateShapeQueue(shapeLettersQueue.length, shapeLettersQueue);
    }



    /**
     * Render all items of next figures queue
     */
    renderQueue() {
        this.nextFigures.queue.forEach(nextFigure => {
            nextFigure.render();
        });
    }



    /**
     * Renders all filed figures 
     */
    render() {
        /**
         * Internal helper function, clears entire render zone
         */
        function __clearRenderZone(renderer) {
            renderer.context.clearRect(
                0, 0,
                renderer.context.canvas.width,
                renderer.context.canvas.height
            );
        }

        // clear render zone manually
        __clearRenderZone(this.renderer);

        this.renderer.drawRect({
            x: 0, y: 0,
            w: this.renderer.context.canvas.width,
            h: this.renderer.context.canvas.height,
            c: this.settings.themes.night.fieldColor,
        })

        if (this.devTool.getValue('renderFieldGrid') === true) {
            this.#drawFieldGrid(this.field, this.settings.themes.night.gridColor);
        }

        // nextFigures
        this.renderer.drawRect({
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

            // fixing center point rendering 
            fieldItem.renderCenterPoint = this.devTool.getValue('renderFigureCenter');
        });

        // updating stopwatch values
        if (this.states.isGamePaused == false && this.states.isGameOver == false) {
            this.hud.stopwatch.updateValue();
        }

        // todo fix this
        if (true) {
            // Calculating highest line hight pixels
            let highestLineHeight = this.renderer.context.canvas.height - this.field.highestLine * this.field.gridCellSize;

            // render current highest line
            this.renderer.drawLine({
                x1: 0, y1: this.renderer.context.canvas.height,
                x2: 0, y2: highestLineHeight,
                w: 3, c: 'red'
            });
        }

    }


    /**
     * Implements the gravitational effect of the player figure
     * @param {object} target target of gravity impact
     */
    gravitize() {
        let condition = this.devTool.getValue('disableGravity') === false;
        let gravitizeIsAllowed = condition && this.checkMobility();

        // check result condition
        if (gravitizeIsAllowed) {
            let direction = 'down';

            this.player.move({
                direction: direction
            });
        }
    }


    /**
     * Spawn a new block and add it to game field
     * @returns {object}
     */
    spawnFigure(shape) {
        let startPointIsFull = false;
        // get shape from arg or get first item of next figures queue
        shape = shape || this.nextFigures.queue.shift().shape;

        // after grabbing first item of queue we need to re-generate queue
        this.regenerateQueue();


        // Now the end of the game is considered from the moment the counter reaches the highest point, 
        // ...that is, the height of the field (in blocks) minus 2 blocks
        if (this.field.highestLine > this.field.size[1] - 2) startPointIsFull = true;

        if (startPointIsFull === false) {
            let figure = this.createFigure({
                // updateValue Game stored figure ID
                id: this.#generateID(),
                color: this.settings.themes.night.figures[shape],
                parent: this.field,

                // generate each time random figure
                shape: shape,
            });

            this.addFigureToField(figure);

            console.log('Added new figure: ', figure);

            figure.isFalling = true;
            figure.isFreezed = false;

            // creating 'shadow' fugire that copies some player figure values (x pos, angle)
            let newFigureProjection = this.createProjectionFor(figure);
            this.playerProjection = newFigureProjection;

            // updateValue projection position 
            this.playerProjection.syncPosition();

            return figure;
        } else {
            this.dispatchEvent('onGameover', {
                scores: this.hud.scores.value,
            });

            return false;
        }
    }

    updatePlayerFigure(){
        let newFigure = this.spawnFigure();
        newFigure.events = this.player.events;

        this.player = newFigure;
    }



    /**
     * Pauses game process, antipod of Game.resume()
     */
    pause() {
        this.states.isGamePaused = true;

        this.screen.html.classList.add('opacity-60');
        console.log("[Game]: Current instance of game is paused");
    }



    /**
     * Resumes game process, antipod of Game.pause()
     */
    resume() {
        this.states.isGamePaused = false;

        this.screen.html.classList.remove('opacity-60');
        console.log("[Game]: Current instance of game is resumed");
    }



    /**
     * Checks if at this moment figure movements is allowed
     * @returns {boolean}
     */
    checkMobility() {
        let condition_1 = this.states.isGamePaused === false;
        let condition_2 = this.states.isGameOver === false;

        let movementIsAllowed = condition_1 && condition_2;

        return movementIsAllowed;
    }



    /**
     * Inits game starting process
     */
    init() {
        console.log('[Log]: initializing Game');

        // init controls module
        this.controls.init();

        // init sound system
        this.sounds.init();

        // generating initial queue of random figures
        this.generateQueue(3);

        // init game hud
        this.hud.init();

        // create and add player figure
        let player = this.spawnFigure();
        this.player = player;

        // render all game figures include movements
        setInterval(this.render.bind(this), this.fpsInterval);

        // updateValue gravity impact at target figure
        setInterval(this.gravitize.bind(this), 90 / this.settings.gravity);

        // manual fugire spawn
        this.devTool.getOption('spawnFigure').execute = (data) => {
            this.field.figures = [];
            this.player = null;
            this.player = this.spawnFigure(data);
        };


        // manual print info about field figures array to console
        this.devTool.getOption('printGameFieldFiguresToConsole').execute = (data) => {
            console.log(
                "[Log]: executed DevTool 'printGameFieldFiguresToConsole' option handler",
                this.field.figures
            );
        };

        // some panel theming
        if (this.devTool.getValue('devMode') === true) {
            let devPanel = this.devTool.html;
            let manualSpawnButtons = devPanel.querySelectorAll('[data-button-value]');

            manualSpawnButtons.forEach(spawnButton => {
                spawnButton.style.background = this.settings.themes.night.figures[spawnButton.getAttribute('data-button-value')]
            });
        }

        // Movement managment
        this.controls.on('up', () => {
            let direction = 'up';

            if (this.checkMobility()) {
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

                this.sounds.play('sfx', 'rotation', 1.2);
            }
        });

        this.controls.on('left', () => {
            let direction = 'left';

            if (this.checkMobility()) {
                // Moving figure to left by pressing a/LeftArrow
                this.player.move({
                    direction: direction,
                    onMove: (figure) => {
                        this.sounds.play('sfx', 'movement', -0.7);
                    },
                });
            }
        });

        this.controls.on('right', () => {
            let direction = 'right';

            if (this.checkMobility()) {
                // Moving figure to left by pressing d/RightArrow
                this.player.move({
                    direction: direction,     
                    onMove: (figure) => {
                        this.sounds.play('sfx', 'movement', -0.7);
                    },
                });
            }
        });

        this.controls.on('down', () => {
            let direction = 'down';

            if (this.checkMobility()) {
                // Moving figure to down by pressing s/DownArrow
                this.player.move({
                    direction: direction,
                    onMove: (figure) => {
                        this.sounds.play('sfx', 'movement', -0.7);
                    },
                });
            }
        });

        this.controls.on('space', () => {
            if (this.checkMobility()) {
                // at space key fast move figure to down
                if (this.player.isFreezed == false) {
                    this.player.moveDownUntilCollide();
                }
            }
        });

        this.player.addEventListener('onMove', (event) => {
            if(event.direction !== 'down') this.fxStates.isCanPlayDeniedMoveFX = true;

            // updateValue projection position 
            this.playerProjection.syncPosition();
        });

        this.player.addEventListener('onCollide', (event) => {
            if(event.collideWith == 'figure' || event.direction == 'down'){
                event.figure.freeze();
                this.setHighestLine(event.figure);
                this.checkLineCompletitions();
                this.hud.figures.updateValue();
                this.updatePlayerFigure();
            }

            if(this.fxStates.isCanPlayDeniedMoveFX === true && event.direction !== 'down') {
                this.screen.tremble(event.direction);
                this.sounds.play('sfx', 'denied', -0.7);
                this.fxStates.isCanPlayDeniedMoveFX = false;
            } 

            if(event.direction == 'down') {
                // chose sound effect to down movements (not for fast fall)
                // this.sounds.play('sfx', 'drop');
            }

            // updateValue projection position 
            this.playerProjection.syncPosition();
        });

        this.player.addEventListener('onFastfall', (event) => {
            this.sounds.play('sfx', 'drop');
            this.screen.tremble('down');
        });

        this.addEventListener('onGameover', (event) => {
            // TODO: add some visual
            let endMessage = 'Game over! Your score: ' + event.scores;
            
            this.states.isGameOver = true;
            this.sounds.play('music', 'gameOverChime', -0.7);

            console.log(endMessage, this.states);
        });
    }
}


export { Game }; 