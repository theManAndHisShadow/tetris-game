console.log('[Log]: Starting ui.js');

const UI = function({parentScreen} = {}){
    return {
        scores: {
            html: null,
            value: 0,

            add: function(value){
                this.value = this.value + value;
                this.html.innerText = 'Scores: ' + this.value;

            },
        },

        parentScreen: parentScreen,

        render: function(){
            let scoresDisplay = document.createElement('div');
            scoresDisplay.id = "screen__scores-display"

            scoresDisplay.innerText = 'Scores: ' + this.scores.value;

            this.scores.html = scoresDisplay;
            this.parentScreen.appendChild(scoresDisplay);
        },

        init: function(){
            console.log('[Log]: initializing User Interface');

            this.render();
        },
    };
};