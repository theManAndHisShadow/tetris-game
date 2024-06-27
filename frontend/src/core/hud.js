console.log('[Log]: Starting hud.js');

import { addLeadingZero } from "../misc/helpers.js";

class HUDElement {
    /**
     * @constructor
     * @param {Object} options
     * @param {string} options.codeName - this value uses to set id, and if label value empty set label at html
     * @param {string} [options.label = ""] - text prefix at html element
     */    
    constructor({codeName, label}){
        if(codeName == ''){
            throw new Error('HUDElement: codeName argument cant be an empty value');
        } else if(typeof codeName !== 'string') {
            throw new Error('HUDElement: type of codeName argument must be a string');
        } else {
            label = label || codeName[0].toUpperCase() + codeName.slice(1);

            this.html = null;
            this.parent = null;
            this.value = 0;
            this.codeName = codeName;
            this.label = label + ': ';
        }
    }


    /**
     * Updates object value and html element content value
     * @param {number} [value=1] new value of element 
     */
    updateValue (value = 1){
        this.value = this.value + value;
        this.html.innerText = this.label + this.value;
    }



    /**
     * Creates HTML body of element and saves it to this.html
     */
    create (){
        let element = document.createElement('div');
        element.id = `hud__${this.codeName}-display`;
        element.classList.add('hud-element');

        element.innerText = this.label + this.value;

        this.html = element;
    }



    /**
     * Appends html of element to parent html element and sets this element parent html Node
     * @param {HTMLElement} targetToAppend - ref to parent HTML Node
     */
    appentTo (targetToAppend){
        this.parent = targetToAppend;
        targetToAppend.appendChild(this.html);
    }
}

class HUDStopwatchElement extends HUDElement {
    /**
     * @constructor
     * @param {Object} options
     * @param {number} options.fps          - global fps value
     * @param {string} options.codeName     - this value uses to set id, and if label value empty set label at html
     * @param {string} [options.label = ""] - text prefix at html element
     */    
    constructor(options) {
        if (options.fps < 1) {
            throw new Error("HUDStopwatchElement: fps param value cant be less than 1");
        } else if (!options.fps) {
            throw new Error("HUDStopwatchElement: fps param is undefined or null");
        } else if (typeof options.fps !== 'number') {
            throw new Error("HUDStopwatchElement: type of fps param must be a number");
        } else {
            super(options);

            this.fps = options.fps;
            this.minutes = 0;
            this.seconds = 0;
            this.milliseconds = 0;
        }
    }

    /**
     * Conversion of calculator data (minutes, seconds, milliseconds)
     */
    recalulate() {
        // calculating inteval single loop time
        const fpsInterval = (1000 / (1000 / this.fps));


        // increase stopwatch value
        this.value += 1;

        // calculate milliseconds
        this.milliseconds = (this.value % fpsInterval) * 4;

        // calculate seconds
        if (this.value % fpsInterval == 0) {
            this.seconds += 1;

            // calculate minutes
            if (this.seconds % 60 == 0) {
                this.minutes += 1;
                this.seconds = 0;
            }
        }
    }

    /**
     * Updates stopwtach values and rerender values inside html element
     */
    updateValue (){
        // recalculate stopwatch data
        this.recalulate();

        // fixing  stopfatch format (adding leading zero)
        let minutesFormat = addLeadingZero(this.minutes, 9);
        let secondsFormat = addLeadingZero(this.seconds, 9);

        // rerender
        this.html.innerText = this.label + minutesFormat + ':' + secondsFormat + "." + this.milliseconds; 
    }
}


class HUD {
    constructor({parentScreen, fps}){
        this.parentScreen = parentScreen;

        this.scores = new HUDElement({
            codeName: 'scores',
        });

        this.figures = new HUDElement({
            codeName: 'figures',
        });

        this.lines = new HUDElement({
            codeName: 'lines',
        });

        this.stopwatch = new HUDStopwatchElement({
            codeName: 'stopwatch',
            fps: fps,
        });
    }



    /**
     * Creates hud container, creates all children elements and appends all to Game Screen`s HTML
     */
    render () {
        let HUDdataDisplay = document.createElement('div');
        HUDdataDisplay.id = 'hud-container';
        this.parentScreen.appendChild(HUDdataDisplay);

        this.scores.create();
        this.figures.create();
        this.lines.create();
        this.stopwatch.create();

        this.scores.appentTo(HUDdataDisplay);
        this.figures.appentTo(HUDdataDisplay);
        this.lines.appentTo(HUDdataDisplay);
        this.stopwatch.appentTo(HUDdataDisplay);
    }


    /**
     * Init HUD class instance
     */
    init (){
        console.log('[Log]: initializing HUD');

        this.render();
    }
}


export { HUD };