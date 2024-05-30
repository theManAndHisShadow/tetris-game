
const CreateSettingsModal = function(settings) {
     
    return {
        elementsHtml: {
            settingsDiv: document.getElementById('settings'),
            buttonOpenModal: document.getElementById('settings-button'),
        },

        tempItems: {
            currentColor: [settings.background.colors[0]],
            rootBackground: document.querySelector('#root'),
        },

        createModal: function() {
            const modalWindow = document.createElement('dialog');
            modalWindow.id = 'settings-modal';
            const buttonClose = document.createElement('button');
            const title = document.createElement('span');
            title.textContent = 'Settings';
            buttonClose.innerHTML = '&#x2715;';
            buttonClose.id = 'settings-modal__close';
            const header = document.createElement('div');
            header.append(title, buttonClose);
            header.id = 'settings-modal__header';
            modalWindow.append(header);

            document.body.append(modalWindow);

            this.tempItems.modalWindow = modalWindow;
        },

        modalControl: function() {
            this.createModal();

            this.elementsHtml.buttonOpenModal.addEventListener('click', () => {
                this.tempItems.modalWindow.showModal();

                const buttonClose = this.tempItems.modalWindow.querySelector('#settings-modal__close');
                buttonClose.onclick = () => this.tempItems.modalWindow.close();
            })
        },

        createBlockBackground: function() {
            const blockColors = document.createElement('div');
            blockColors.id = 'settings-modal__background-colors';

            const subtitle = document.createElement('span');
            subtitle.textContent = 'Background';
            subtitle.id = 'settings-modal__background-title';
            blockColors.append(subtitle);
            
            const inputsControls = document.createElement('div');
            inputsControls.id = 'background-colors__inputs';


            const prevColor = document.createElement('button');
            prevColor.id = 'background-colors__prev';
            prevColor.classList.add('change-color-button');
            prevColor.textContent = '<';

            const colorName = document.createElement('span');
            colorName.id = 'background-colors__name';
            colorName.textContent = this.tempItems.currentColor[0][0];

            const nextColor = document.createElement('button');
            nextColor.id = 'background-colors__next';
            nextColor.classList.add('change-color-button');
            nextColor.textContent = '>';

            const buttonSaveSettings = document.createElement('button');
            buttonSaveSettings.textContent = 'Save';
            buttonSaveSettings.id = 'settings-modal__save-button';

            inputsControls.append(prevColor, colorName, nextColor);
            blockColors.append(inputsControls);

            this.tempItems.modalWindow.append(blockColors);

            this.tempItems.modalWindow.append(buttonSaveSettings);

            this.selectBackgroundColor(prevColor, nextColor, buttonSaveSettings);

        },

        selectBackgroundColor: function(...buttons){
            const colors = settings.background.colors;
            let indexColor = 0;
            const colorNameInModal = this.tempItems.modalWindow.querySelector('#background-colors__name');

            buttons.forEach(button => {
                buttonInactive(buttons[0], buttons[1]);

                button.addEventListener('click', (event) => {
                    
                    if(event.target.id === 'background-colors__prev' && indexColor > 0){
                        indexColor--;
                        colorNameInModal.textContent = colors[indexColor][0];
                        this.tempItems.rootBackground.style.backgroundColor = colors[indexColor][1];
                        buttonInactive(buttons[0], buttons[1]);
                    } 

                    if(event.target.id === 'background-colors__next' && indexColor < colors.length - 1) {
                        indexColor++;
                        colorNameInModal.textContent = colors[indexColor][0];
                        this.tempItems.rootBackground.style.backgroundColor = colors[indexColor][1];
                        buttonInactive(buttons[0], buttons[1]);
                    }

                    if(event.target.id === 'settings-modal__save-button'){
                        this.saveSelectedBackgroundColor(colors[indexColor][1]);
                    }
                })
            })

            function buttonInactive(firstButton, secondButton){
                if(indexColor === 0){
                    firstButton.disabled = true;
                } 
                if(indexColor > 0) {
                    firstButton.disabled = false;
                }

                if(indexColor === colors.length - 1){
                    secondButton.disabled = true;
                } 
                if(indexColor < colors.length - 1) {
                    secondButton.disabled = false;
                }
            }
        },

        saveSelectedBackgroundColor: function(color) {
            localStorage.setItem('backgroundColor', color);
        },

        loadSavedBackgroundColor: function() {
            this.tempItems.rootBackground.style.backgroundColor = localStorage.getItem('backgroundColor');
        },

        init: function() {
            this.modalControl();
            this.createBlockBackground();
            this.loadSavedBackgroundColor();
        }
    }


}