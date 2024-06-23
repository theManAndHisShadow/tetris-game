console.log('[Log]: Starting dev.js');

import { data } from "./structure.js";

/**
 * Managing UI helper for dev purposes
 * @returns {object}
 */
const DevHelper = function({rootElement}){
    return {

        html: {
            rootNodeRef: null,
        },

        data: data,

        getOption: function(targetID){
            let arrayOfObjects = this.data.sections;
            let result = null;

            arrayOfObjects.forEach(object => {
                let arrayOfOptions = object.options;

                arrayOfOptions.forEach(option => {
                    if(option.id == targetID) result = option;
                });
            });

            return result;
        },

        getValue: function(targetID){
            return this.getOption(targetID).state;
        },

        /**
         * Creates and return toggle button
         * @param {object} object dev panel object (label, state, type etc)
         * @returns {HTMLElement}
         */
        renderToggle: function(object){
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
            optionContainer.id = 'dev-panel' + object.id + "-option-container";
            
            // create option label element
            let optionTitle = document.createElement('span');
            optionTitle.id =  'dev-panel' + object.id + "-option-label";
            optionTitle.innerText = optionTitle__text + ": ";

            // create toggle button element
            let optionToggle = document.createElement('button');
            optionToggle.id = 'dev-panel' + object.id + "-option-" + object.type;
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
         * Creates and return toggle button
         * @param {object} object dev panel object (label, state, type etc)
         * @returns {HTMLElement}
         */
        renderButton: function(object){
            // storing some values
            let optionTitle__text = object.label

            // create container element
            let optionContainer = document.createElement('div');
            optionContainer.id = 'dev-panel' + object.id + "-option-container";
            
            // create option label element
            let optionTitle = document.createElement('span');
            optionTitle.id =  'dev-panel' + object.id + "-option-label";
            optionTitle.innerText = optionTitle__text + ": ";

            // create toggle button element
            let optionButton = document.createElement('button');
            optionButton.id = 'dev-panel' + object.id + "-option-" + object.type;
            optionButton.classList = 'button';
            optionButton.innerHTML = 'print';

            // adding handler to update toggle button state and visula at click
            optionButton.addEventListener('click', (e) => {
                if(typeof object.execute == 'function') {
                    object.execute()
                } else {
                    console.log('[Log]: DevTool option ' + object.id + ' has empty handler');
                }
            });

            // adding to container
            optionContainer.appendChild(optionTitle);
            optionContainer.appendChild(optionButton);

            return optionContainer;
        },



        /**
         * Creates and return button list element 
         * @param {object} object dev panel object (label, state, type etc)
         * @returns {HTMLElement}
         */
        renderButtonList: function(object){
            //storing some values
            let optionTitle__text = object.label;

            // create container element
            let optionContainer = document.createElement('div');
            optionContainer.id = 'dev-panel' + object.id + "-option-container";
            
            // create option label element
            let optionTitle = document.createElement('span');
            optionTitle.id =  'dev-panel' + object.id + "-option-label";
            optionTitle.innerText = optionTitle__text + ": ";

            // createcontainer element
            let buttonsContainer = document.createElement('ul');
            buttonsContainer.id = 'dev-panel' + object.id + "-option-" + object.type;

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
        render: function(){
            let a = this.getOption('devMode');
            
            // Store settings.dev properties
            let sections = this.data.sections;

            sections.forEach(section => {
                let options = section.options;

                // Render each particular option
                options.forEach(option => {
                    let optionContainer;

                    if(option.type == 'button') optionContainer = this.renderButton(option);
                    if(option.type == 'toggle') optionContainer = this.renderToggle(option);
                    if(option.type == 'button-list') optionContainer = this.renderButtonList(option);

                    this.html.rootNodeRef.appendChild(optionContainer);
                });
            });


        },

        init: function(){
            console.log('[Log]: initializing DevUI');

            let parentElement = document.createElement('div');
            parentElement.id = 'dev-panel';
            rootElement.appendChild(parentElement);
            this.html.rootNodeRef = parentElement;

            this.render();
        },
    }
}

export { DevHelper }