console.log('[Log]: Starting ui.js');

const UI = function({parentScreen} = {}){
    return {
        fps: null,
        scores: {
            html: null,
            value: 0,

            add: function(value){
                this.value = this.value + value;
                this.html.innerText = 'Scores: ' + this.value;

            },

            renderAt: function(renderAt){
                let scoresDisplay = document.createElement('div');
                scoresDisplay.id = "ui__scores-display";
                scoresDisplay.classList.add('ui-element');
    
                scoresDisplay.innerText = 'Scores: ' + this.value;
    
                this.html = scoresDisplay;
                renderAt.appendChild(scoresDisplay);
            },
        },

        stopwatch: {
            html: null,
            fps: null,
            value: 0,
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

                console.log(this.seconds, this.seconds % 60);
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
                this.html.innerText = 'Time: '+ minutesFormat + ':' + secondsFormat + "." + this.milliseconds; 
            },

            renderAt: function(renderAt){
                let stopwatchElement = document.createElement('div');
                stopwatchElement.id = "ui__stopwatch";
                stopwatchElement.classList.add('ui-element');
    
                stopwatchElement.innerText = 'Time: ' + this.value;
    
                this.html = stopwatchElement;
                renderAt.appendChild(stopwatchElement);
            },
        },

        parentScreen: parentScreen,

        render: function(){
            this.scores.renderAt(this.parentScreen);
            this.stopwatch.renderAt(this.parentScreen);
        },

        init: function(fps){
            console.log('[Log]: initializing User Interface');

            this.stopwatch.fps = fps;
            console.log(this);
            this.render();
        },
    };
};