
const TemplateSettingObj = function(color, turn, music){
    this.Background = color;
    this.Sound = turn;
    this.Music = music;
}

const CreateSettingsModal = function(modalSettings, backgroundColors) {

    return {

        modalSettings: modalSettings,

        elementsHtml: {
            settingsDiv: document.getElementById('settings'),
            buttonOpenModal: document.getElementById('settings-button'),
            rootBackground: document.querySelector('#root')
        },

        
        defaultSettings: new TemplateSettingObj('red', true, 0),

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

            this.elementsHtml.buttonOpenModal.addEventListener('click', () => {
                this.createdDOM.modalWindow.showModal();

                const buttonClose = this.createdDOM.modalWindow.querySelector('#settings-modal__close');
                buttonClose.onclick = () => this.createdDOM.modalWindow.close();
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
                    prevInput.id = 'settings-modal__' + modalSettings[setting].label + '_prev-input';
                    prevInput.classList.add('change-setting-input');
                    prevInput.setAttribute('data-type', modalSettings[setting].label);
                    prevInput.setAttribute('data-stepper', 'left');
                    prevInput.textContent = '<';

                    const currentValue = document.createElement('span');
                    currentValue.id = 'settings-modal__current-value';
                    this.createdDOM[modalSettings[setting].label] = currentValue;
                    
                    const nextInput = document.createElement('button');
                    nextInput.id = 'settings-modal__' + modalSettings[setting].label + '_next-input';
                    nextInput.classList.add('change-setting-input');
                    nextInput.setAttribute('data-type', modalSettings[setting].label);
                    nextInput.setAttribute('data-stepper', 'right');
                    nextInput.textContent = '>';

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

            this.createdDOM.modalWindow.append(buttonSaveSettings);
        },

        setDefaultValues: function() {

            if(!localStorage.getItem('settings')){
                
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

            for (const [key, value] of Object.entries(this.createdDOM)) {
                if(Object.hasOwn(jsonSettings, key)) {
                    if(typeof this.defaultSettings[key] === 'boolean'){
                        value.checked = this.defaultSettings[key];
                    } else {
                        value.textContent = this.defaultSettings[key];
                    }
                }
            }

            this.setBackgroundColor();
        }, 

        setBackgroundColor: function(localValueColor) {
            jsonSettings = JSON.parse(localStorage.getItem('settings'));
            
            if(jsonSettings.Background){
                this.elementsHtml.rootBackground.style.backgroundColor = backgroundColors[jsonSettings.Background];
            }

            if(localValueColor){
                this.elementsHtml.rootBackground.style.backgroundColor = localValueColor;
            }
        },

        setMusic: function() {

        },

        selectValueSetting: function(objects) {
            let colorID = 0;
            let musicID = 0;
            const arrayData = Object.entries(objects);
            this.createdDOM.modalWindow.addEventListener('click', function(event) {
                    if(event.target.getAttribute('data-type') === 'Background'){
                        
                        if(event.target.getAttribute('data-stepper') === 'left'){
                            colorID--;
                            this.setBackgroundColor(arrayData[colorID][1]);
                        }

                        if(event.target.getAttribute('data-stepper') === 'right'){
                            colorID++;
                            this.setBackgroundColor(arrayData[colorID][1]);
                        }

                    }
            })
        },

        changeValueSetting: function() {
            
        },

        init: function() {
            this.controlModal();
            this.renderSettingsElements();
            this.setDefaultValues();
            this.getValueSettings();
            this.selectValueSetting(backgroundColors);
        }
    }


}