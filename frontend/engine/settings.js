console.log('[Log]: Starting settings.js');

const Settings = function () {

    return {
        modal: {
            // change background color on website
            changeBackgroundColor: {
                label: 'Color',
                prevButton: '<',
                nextButton: '>',
                type: 'stepper'
            },

            changeBackgroundImage: {
                label: 'Image',
                prevButton: '<',
                nextButton: '>',
                type: 'stepper'
            },

            // turn on or off sound in game
            sound: {
                state: true,
                label: 'Sound',
                type: 'toggle'
            },

            // change music
            changeMusic: {
                label: 'Music',
                prevButton: '<',
                nextButton: '>',
                type: 'stepper'
            },
        }, 

        // background colors
        colors: {
            gray: '#858585',
            blue: '#3b9fd1',
            red: '#c35353',
            purple: '#7e4585',
            black: '#202324',
        },

        // background images
        images: {
            mountain: 'mountain.jpg',
            forest: 'forest.jpg',
            city: 'city.jpg'
        },

        // speed of figure moving to bottom
        gravity: 0.1,

        renderUISettings: function(){
            
            const modal = new CreateSettingsModal(this.modal, this.colors, this.images);
            modal.init();

        },
        // Storing some props for dev & debugging purposes
        dev: {
            // globally turn on or off dev mode
            __devMode: {
                state: true,
                label: 'dev mode',
            },

            __disableGravity: {
                state: true,
                label: 'disable gravity'
            },

            // draw dot to figure center
            __renderFigureCenter: {
                state: true,
                label: 'Render figure center',
            },

            // draw bounding rect of figure
            __rendeFieldFreeSpaceBoundingRect: {
                state: true,
                label: 'Render free space rect',
            },
        },

        init: function () {
            console.log('[Log]: initializing Settings');
            this.renderUISettings();
        },
    }
};