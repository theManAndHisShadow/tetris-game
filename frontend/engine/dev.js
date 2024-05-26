console.log('[Log]: Starting dev.js');

/**
 * Managing UI helper for dev purposes
 * @param {objectRef} devSettings 
 * @returns {object}
 */
const DevUI = function(devSettings){
    if(devSettings && typeof devSettings == 'object'){
        return {
            // setting object has other properties,
            // just stroing dev properties
            devSettings: devSettings,

            html: {
                rootNodeRef: document.querySelector('#dev-panel'),
            },

            /**
             * Rendering dev UI settings to HTML
             */
            renderDevUI: function(){
                /**
                 * 
                 * @param {HTMLButtonElement} target which button should get an appearance update 
                 * @param {boolean} state new state 
                 */
                function __updateVisual(target, state){
                    target.classList = "state-" + state;
                    target.innerHTML = `${state}`;
                }
                
                // Store settings.dev properties
                let options = Object.keys(this.devSettings);

                // Render each particular option
                options.forEach(option => {
                    // Below this comment: 
                    // storing values, creating html nodes, writing labels, values
                    // adding toggle state handlers
                    // finally, adding all elements to HTML
                    let optionTitle__text = devSettings[option].label
                    let optionValue = devSettings[option].state;

                    let optionContainer = document.createElement('div');
                    optionContainer.id = 'dev-panel' + option + "-option-container";
                    
                    let optionTitle = document.createElement('span');
                    optionTitle.id =  'dev-panel' + option + "-option-label";
                    optionTitle.innerText = optionTitle__text + ": ";

                    let optionToggle = document.createElement('button');
                    optionToggle.id = 'dev-panel' + option + "-option-toggle";
                    optionToggle.innerHTML = optionValue;

                    __updateVisual(optionToggle, devSettings[option].state);

                    optionToggle.addEventListener('click', (e) => {
                        devSettings[option].state = devSettings[option].state == true ? false : true;
                        __updateVisual(optionToggle, devSettings[option].state);
                    });

                    optionContainer.appendChild(optionTitle);
                    optionContainer.appendChild(optionToggle);

                    this.html.rootNodeRef.appendChild(optionContainer);
                });
            },

            init: function(){
                console.log('[Log]: initializing DevUI');

                this.renderDevUI();
            },
        }
    } else {
        throw new Error(`DevUI constructor param 'devSettings' has bad value. devSettings = ${devSettings}`);
    }
}