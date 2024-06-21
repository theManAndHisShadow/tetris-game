
const TemplateSettingObj = function(background, turn, music){
    this.Background = background;
    this.Sound = turn;
    this.Music = music;
}

const CreateSettingsModal = function(modalSettings, backgroundColors, backgroundImages) {

    return {

        modalSettings: modalSettings,

        elementsHtml: {
            settingsDiv: document.getElementById('settings'),
            buttonOpenModal: document.getElementById('settings-button'),
            rootBackground: document.querySelector('#root')
        },
        
        defaultSettings: new TemplateSettingObj(['gray', '#858585', 'Color'], true, 0),
        currentSettings: new TemplateSettingObj(),
        loadedSettings: {},

        createdDOM: {},

        createModal: function() {
            const modalWindow = document.createElement('dialog');
            modalWindow.id = 'settings-modal';

            const buttonClose = document.createElement('button');
            buttonClose.innerHTML = '&#x2715;';
            buttonClose.id = 'settings-modal__close';
            
            const title = document.createElement('span');
            title.textContent = 'Settings';

            const header = document.createElement('div');
            header.append(title, buttonClose);
            header.id = 'settings-modal__header';

            modalWindow.append(header);

            document.body.append(modalWindow);

            this.createdDOM.modalWindow = modalWindow;
        },

        controlModal: function() {
            this.createModal();

            // Deprecated
            // this.elementsHtml.buttonOpenModal.addEventListener('click', () => {
            //     this.createdDOM.modalWindow.showModal();
            // })

            const buttonClose = this.createdDOM.modalWindow.querySelector('#settings-modal__close');
                
            buttonClose.addEventListener('click', () => {
                this.createdDOM.modalWindow.close();
                this.getValueSettings();
            })
        },

        renderSettingsElements: function() {

            const settings = Object.keys(modalSettings);

            settings.forEach(setting => {

                const settingBlock = document.createElement('div');
                settingBlock.id = 'settings-modal__setting';

                const subtitle = document.createElement('span');
                subtitle.textContent = modalSettings[setting].label;
                subtitle.id = 'settings-modal__subtitle';
                settingBlock.append(subtitle);

                const inputsControls = document.createElement('div');
                inputsControls.id = 'settings-modal__inputs';

                if(modalSettings[setting].type === 'stepper') {
                    const prevInput = document.createElement('button');
                    prevInput.classList.add('change-setting-input');
                    prevInput.setAttribute('data-type', modalSettings[setting].label);
                    prevInput.setAttribute('data-stepper', 'left');
                    prevInput.textContent = '<';
                    this.createdDOM[`${prevInput.getAttribute('data-type')}_${prevInput.getAttribute('data-stepper')}`] = prevInput;

                    const currentValue = document.createElement('span');
                    currentValue.id = 'settings-modal__current-value';
                    this.createdDOM[modalSettings[setting].label] = currentValue;
                    
                    const nextInput = document.createElement('button');
                    nextInput.classList.add('change-setting-input');
                    nextInput.setAttribute('data-type', modalSettings[setting].label);
                    nextInput.setAttribute('data-stepper', 'right');
                    nextInput.textContent = '>';
                    this.createdDOM[`${nextInput.getAttribute('data-type')}_${nextInput.getAttribute('data-stepper')}`] = nextInput;

                    inputsControls.append(prevInput, currentValue, nextInput);
                } 

                if(modalSettings[setting].type === 'toggle') {
                    const toggle = document.createElement('input');
                    toggle.id = 'settings-modal__' + modalSettings[setting].label + 'toggle';
                    toggle.setAttribute('type', 'checkbox');
                    this.createdDOM[modalSettings[setting].label] = toggle;

                    const labelToggle = document.createElement('label');
                    labelToggle.textContent = 'State';
                    labelToggle.setAttribute('for', toggle.id);
                    

                    inputsControls.append(labelToggle, toggle);
                }

                settingBlock.append(inputsControls);
                this.createdDOM.modalWindow.append(settingBlock);

            });

            const buttonSaveSettings = document.createElement('button');
            buttonSaveSettings.textContent = 'Save';
            buttonSaveSettings.id = 'settings-modal__save-button';
            this.createdDOM.saveButton = buttonSaveSettings;

            this.createdDOM.modalWindow.append(buttonSaveSettings);
        },

        setDefaultValues: function() {

            if(!localStorage.getItem('settings') || !JSON.parse(localStorage.getItem('settings')).Background){
                
                for (const [key, value] of Object.entries(this.createdDOM)) {
                    if(Object.hasOwn(this.defaultSettings, key)) {
                        
                        if(typeof this.defaultSettings[key] === 'boolean'){
                            value.checked = this.defaultSettings[key];
                        } else {
                            value.textContent = this.defaultSettings[key];
                        }
                        
                    }
                }

                localStorage.setItem('settings', JSON.stringify(this.defaultSettings));
            }

        },

        getValueSettings: function () {
            jsonSettings = JSON.parse(localStorage.getItem('settings'));
            this.loadedSettings = jsonSettings;
            
            for (const [key, value] of Object.entries(jsonSettings)) {
                if(key === 'Sound'){
                    this.createdDOM[key].checked = value;
                }

                if(key === 'Background'){
                    if(value[2] === 'Color'){
                        this.createdDOM.Color.textContent = value[0];
                        this.createdDOM.Image.textContent = Object.entries(backgroundImages)[0][0];
                    }
                    if(value[2] === 'Image'){
                        this.createdDOM.Image.textContent = value[0];
                        this.createdDOM.Color.textContent = Object.entries(backgroundColors)[0][0];
                    }
                }

                if(key === 'Music'){
                    this.createdDOM[key].textContent = value;
                }
            }            

            this.setBackground();
            this.selectValueSetting(backgroundColors, backgroundImages);
        }, 

        /**
         * 
         * @param {string} type type background, color or image
         * @param {string} localValue background value
         */

        setBackground: function(type, localValue) {
            jsonSettings = JSON.parse(localStorage.getItem('settings'));

            if(jsonSettings.Background){
                if(jsonSettings.Background[2] === 'Color'){
                    this.elementsHtml.rootBackground.style.removeProperty('background-image');
                   this.elementsHtml.rootBackground.style.backgroundColor = jsonSettings.Background[1]; 
                }
                if(jsonSettings.Background[2] === 'Image'){
                    this.elementsHtml.rootBackground.style.removeProperty('background-color');
                    this.elementsHtml.rootBackground.style.backgroundImage = `url(/resources/images/${jsonSettings.Background[1]})`;
                }
            }

            if(type === 'color'){
                this.elementsHtml.rootBackground.style.removeProperty('background-image');
                this.elementsHtml.rootBackground.style.backgroundColor = localValue;
            }
            if(type === 'image'){
                this.elementsHtml.rootBackground.style.removeProperty('background-color');
                this.elementsHtml.rootBackground.style.backgroundImage = `url(resources/images/${localValue})`;
            }
        },

        setMusic: function() {

        },

        controlSound: function() {

        },

        /**
         * 
         * @param {object} left left select button
         * @param {object} right right select button
         * @param {number} idValue id current value color or image
         * @param {array} array array with colors or images
         */

        changeStateButton: function(left, right, idValue, array) {
            if(idValue === 0){
                left.disabled = true;
            } 
            if(idValue > 0) {
                left.disabled = false;
            }

            if(idValue === array.length - 1){
                right.disabled = true;
            } 
            if(idValue < array.length - 1) {
                right.disabled = false;
            }
        }, 

        /**
         * 
         * @param {object} colors object with background colors
         * @param {object} images object with background images
         */

        selectValueSetting: function(colors, images) {

            const colorArray = Object.entries(colors);
            const imageArray = Object.entries(images);

            let selectedBackground;
            let colorID = 0;
            let imageID = 0;
            let musicID = 0;

            
            if(this.loadedSettings.Background){
                for (const key of colorArray) {
                    if(key[0] === this.loadedSettings.Background[0]) {
                        colorID = colorArray.indexOf(key);
                    }
                }
    
                for (const key of imageArray) {
                    if(key[0] === this.loadedSettings.Background[0]) {
                        imageID = imageArray.indexOf(key);
                    }
                }
            }

            this.changeStateButton(this.createdDOM.Color_left, this.createdDOM.Color_right, colorID, colorArray);
            this.changeStateButton(this.createdDOM.Image_left, this.createdDOM.Image_right, imageID, imageArray);
            
            this.createdDOM.modalWindow.addEventListener('click', event => {

                    if(event.target.getAttribute('data-type') === 'Color'){

                        if(event.target.getAttribute('data-stepper') === 'left' && colorID > 0){
                            colorID--;
                            this.setBackground('color', colorArray[colorID][1]);
                            this.changeStateButton(this.createdDOM.Color_left, this.createdDOM.Color_right, colorID, colorArray);
                        }

                        if(event.target.getAttribute('data-stepper') === 'right' && colorID < colorArray.length - 1){
                            colorID++;
                            this.setBackground('color', colorArray[colorID][1]);
                            this.changeStateButton(this.createdDOM.Color_left, this.createdDOM.Color_right, colorID, colorArray);
                        }

                        this.createdDOM.Color.textContent = colorArray[colorID][0];
                        selectedBackground = [colorArray[colorID][0], colorArray[colorID][1], event.target.getAttribute('data-type')];
                    }

                    if(event.target.getAttribute('data-type') === 'Image'){

                        if(event.target.getAttribute('data-stepper') === 'left' && imageID > 0){
                            imageID--;
                            this.setBackground('image', imageArray[imageID][1]);
                            this.changeStateButton(this.createdDOM.Image_left, this.createdDOM.Image_right, imageID, imageArray);
                        }

                        if(event.target.getAttribute('data-stepper') === 'right' && imageID < imageArray.length - 1){
                            imageID++;
                            this.setBackground('image', imageArray[imageID][1]);
                            this.changeStateButton(this.createdDOM.Image_left, this.createdDOM.Image_right, imageID, imageArray);
                        }

                        this.createdDOM.Image.textContent = imageArray[imageID][0];
                        selectedBackground = [imageArray[imageID][0], imageArray[imageID][1], event.target.getAttribute('data-type')]
                    }

                    if(event.target.getAttribute('data-type') === 'Music'){
                        
                        if(event.target.getAttribute('data-stepper') === 'left'){
                            musicID--;
                        }

                        if(event.target.getAttribute('data-stepper') === 'right'){
                            musicID++;
                        }

                    }

                    if(event.target === this.createdDOM.saveButton){
                        this.saveValueSettings(selectedBackground, this.createdDOM.Sound.value, musicID);
                        this.createdDOM.modalWindow.close();
                    }
            })
        },

        /**
         * 
         * @param {array} background selected background colors or image
         * @param {boolean} sound toggle turn on/off sound
         * @param {array} music background music
         */

        saveValueSettings: function(background, sound, music) {
            
            this.currentSettings = new TemplateSettingObj(background, sound, music);

            localStorage.setItem('settings', JSON.stringify(this.currentSettings));
        },

        init: function() {
            this.controlModal();
            this.renderSettingsElements();
            this.setDefaultValues();
            this.getValueSettings();
        }
    }
}