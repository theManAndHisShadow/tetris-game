console.log('[Log]: Starting hud.js');

const HUD = function({parentScreen} = {}){
    return {
        fps: null,
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
                scoresDisplay.id = "ui__scores-display";
                scoresDisplay.classList.add('ui-element');
    
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
                figures.id = "ui__figures-placed";
                figures.classList.add('ui-element');
    
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
                lines.id = "ui__lines-completed";
                lines.classList.add('ui-element');
    
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
                stopwatchElement.id = "ui__stopwatch";
                stopwatchElement.classList.add('ui-element');
    
                stopwatchElement.innerText = this.label + this.value;
    
                this.html = stopwatchElement;
                renderAt.appendChild(stopwatchElement);
            },
        },

        parentScreen: parentScreen,

        render: function(){
            this.scores.renderAt(this.parentScreen);
            this.figures.renderAt(this.parentScreen);
            this.lines.renderAt(this.parentScreen);
            this.stopwatch.renderAt(this.parentScreen);
        },

        init: function(fps){
            console.log('[Log]: initializing HUD');

            this.stopwatch.fps = fps;
            console.log(this);
            this.render();
        },
    };
};