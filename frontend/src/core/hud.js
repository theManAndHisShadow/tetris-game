console.log('[Log]: Starting hud.js');

import { addLeadingZero } from "../misc/helpers.js";

const HUD = function({parentScreen} = {}){
    return {
        scores: {
            html: null,
            value: 0,
            label: 'Scores: ',

            add: function(value){
                this.value = this.value + value;
                this.html.innerText = this.label + this.value;
            },

            renderAt: function(renderAt){
                let scoresDisplay = document.createElement('div');
                scoresDisplay.id = "hud__scores-display";
                scoresDisplay.classList.add('hud-element');
    
                scoresDisplay.innerText = this.label + this.value;
    
                this.html = scoresDisplay;
                renderAt.appendChild(scoresDisplay);
            },
        },

        figures: {
            html: null,
            value: 0,
            label: 'Figures: ',

            update: function(){
                this.value += 1;

                this.html.innerText = this.label + this.value;
            },

            renderAt: function(renderAt){
                let figures = document.createElement('div');
                figures.id = "hud__figures-placed";
                figures.classList.add('hud-element');
    
                figures.innerText = this.label + this.value;
    
                this.html = figures;
                renderAt.appendChild(figures);
            },
        },

        lines: {
            html: null,
            value: 0,
            label: 'Lines: ',

            update: function(){
                this.value += 1;

                this.html.innerText = this.label + this.value;
            },

            renderAt: function(renderAt){
                let lines = document.createElement('div');
                lines.id = "hud__lines-completed";
                lines.classList.add('hud-element');
    
                lines.innerText = this.label + this.value;
    
                this.html = lines;
                renderAt.appendChild(lines);
            },
        },

        stopwatch: {
            html: null,
            fps: null,
            value: 0,
            label: 'Time: ',
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
            
            /**
             * Conversion of calculator data (minutes, seconds, milliseconds)
             */
            recalulate: function(){
                // calculating inteval single loop time
                const fpsInterval = (1000 / this.fps);

                // increase stopwatch value
                this.value += 1;

                // calculate milliseconds
                this.milliseconds = (this.value % fpsInterval) * 4;

                // calculate seconds
                if(this.value % fpsInterval == 0) {
                    this.seconds += 1;

                    // calculate minutes
                    if(this.seconds % 60 == 0) {
                        this.minutes += 1;
                        this.seconds = 0;
                    }
                }
            },


            /**
             * Updates stopwtach values and rerender values inside html element
             */
            update: function(){
                // recalculate stopwatch data
                this.recalulate();

                // fixing  stopfatch format (adding leading zero)
                let minutesFormat = addLeadingZero(this.minutes, 9);
                let secondsFormat = addLeadingZero(this.seconds, 9);

                // rerender
                this.html.innerText = this.label + minutesFormat + ':' + secondsFormat + "." + this.milliseconds; 
            },

            renderAt: function(renderAt){
                let stopwatchElement = document.createElement('div');
                stopwatchElement.id = "hud__stopwatch";
                stopwatchElement.classList.add('hud-element');
    
                stopwatchElement.innerText = this.label + this.value;
    
                this.html = stopwatchElement;
                renderAt.appendChild(stopwatchElement);
            },
        },

        parentScreen: parentScreen,

        render: function(){
            let HUDdataDisplay = document.createElement('div');
            HUDdataDisplay.id = 'hud-container';
            this.parentScreen.appendChild(HUDdataDisplay);

            this.scores.renderAt(HUDdataDisplay);
            this.figures.renderAt(HUDdataDisplay);
            this.lines.renderAt(HUDdataDisplay);
            this.stopwatch.renderAt(HUDdataDisplay);
        },

        init: function(fps){
            console.log('[Log]: initializing HUD');

            this.stopwatch.fps = fps;
            console.log(this);
            this.render();
        },
    };
};

export { HUD };