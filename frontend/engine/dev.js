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
             * Creates and return toggle button
             * @param {string} propertyName prop name of dev panel option (for example '__renderFigureCenter')
             * @param {object} object dev panel object (label, state, type etc)
             * @returns {HTMLElement}
             */
            renderToggle: function(propertyName, object){
                /**
                 * 
                 * @param {HTMLButtonElement} target which button should get an appearance update 
                 * @param {boolean} state new state 
                 */
                function __updateVisual(target, state){
                    target.setAttribute("data-toggle-state", state);
                    target.innerHTML = `${state}`;
                }

                // storing some values
                let optionTitle__text = object.label
                let optionValue = object.state;

                // create container element
                let optionContainer = document.createElement('div');
                optionContainer.id = 'dev-panel' + propertyName + "-option-container";
                
                // create option label element
                let optionTitle = document.createElement('span');
                optionTitle.id =  'dev-panel' + propertyName + "-option-label";
                optionTitle.innerText = optionTitle__text + ": ";

                // create toggle button element
                let optionToggle = document.createElement('button');
                optionToggle.id = 'dev-panel' + propertyName + "-option-" + object.type;
                optionToggle.classList.add('toggle');
                optionToggle.innerHTML = optionValue;

                // update toggle button state
                __updateVisual(optionToggle, object.state);

                // adding handler to update toggle button state and visula at click
                optionToggle.addEventListener('click', (e) => {
                    object.state = object.state == true ? false : true;
                    __updateVisual(optionToggle, object.state);
                });

                // adding to container
                optionContainer.appendChild(optionTitle);
                optionContainer.appendChild(optionToggle);

                return optionContainer;
            },



            /**
             * Creates and return button list element 
             * @param {string} propertyName prop name of dev panel option (for example '__renderFigureCenter')
             * @param {object} object dev panel object (label, state, type etc)
             * @returns {HTMLElement}
             */
            renderButtonList: function(propertyName, object){
                //storing some values
                let optionTitle__text = object.label;

                // create container element
                let optionContainer = document.createElement('div');
                optionContainer.id = 'dev-panel' + propertyName + "-option-container";
                
                // create option label element
                let optionTitle = document.createElement('span');
                optionTitle.id =  'dev-panel' + propertyName + "-option-label";
                optionTitle.innerText = optionTitle__text + ": ";

                // createcontainer element
                let buttonsContainer = document.createElement('ul');
                buttonsContainer.id = 'dev-panel' + propertyName + "-option-" + object.type;

                // take values from object.list and render all list item
                object.list.forEach(buttonName => {
                    // creating button element (item of list)
                    let button = document.createElement('button');
                    button.classList.add('button');
                    button.setAttribute('data-button-value', buttonName);
                    button.innerText = buttonName.toUpperCase();

                    buttonsContainer.appendChild(button);

                    // add handler to execute some function when element clicked
                    button.addEventListener('click', (e) => {
                        object.execute(buttonName);
                    });
                });

                // adding to container
                optionContainer.appendChild(optionTitle);
                optionContainer.appendChild(buttonsContainer);

                return optionContainer;
            },



            
            /**
             * Rendering dev UI settings to HTML
             */
            renderDevUI: function(){
                // Store settings.dev properties
                let options = Object.keys(this.devSettings);

                // Render each particular option
                options.forEach(option => {
                    let optionContainer;
                    let object = this.devSettings[option];

                    console.log(option);
                    if(object.type == 'toggle') optionContainer = this.renderToggle(option, object);
                    if(object.type == 'button-list') optionContainer = this.renderButtonList(option, object);

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