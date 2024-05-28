
const CreateSettingsModal = function() {
     
    return {
        elementsHtml: {
            settingsDiv: document.getElementById('settings'),
            buttonOpenModal: document.getElementById('settings-button'),
        },

        createModal: function() {
            const modalWindow = document.createElement('dialog');
            modalWindow.id = 'settings-modal';
            const buttonClose = document.createElement('button');
            modalWindow.append('Hi!');
            buttonClose.textContent = 'X';
            modalWindow.append(buttonClose);

            document.body.append(modalWindow);

            return modalWindow;
        },

        modalControl: function() {
            this.elementsHtml.buttonOpenModal.addEventListener('click', () => {
                const modal = this.createModal();
                modal.showModal();

                const btnclose = modal.querySelector('button');

                btnclose.onclick = () => modal.close();
            })
        },

        init: function() {
            this.modalControl();
        }
    }


}