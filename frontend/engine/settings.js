console.log('[Log]: Starting settings.js');

const Settings = function () {

    return {
        // speed of figure moving to bottom
        gravity: 0.1,
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
                type: 'toggle',
                label: 'dev mode',
                state: false,
            },

            __disableGravity: {
                type: 'toggle',
                label: 'disable gravity',
                state: false,
            },

            // draw dot to figure center
            __renderFigureCenter: {
                type: 'toggle',
                label: 'render figure center',
                state: false,
            },

            __renderHighestLine: {
                type: 'toggle',
                label: 'render highest line',
                state: true,
            },

            __drawFieldGrid: {
                type: 'toggle',
                label: 'render field grid',
                state: true,
            },

            __spawnFigure: {
                type: 'button-list',
                label: 'spawn figure',
                list: ['i', 'j', 'l', 'o', 't', 's', 'z'],

                // prop that stores cb function
                execute: null,
            },
        },

        themes: {
            night: {
                fieldColor: 'black',
                gridColor: '#1c202f',
                figures: {
                    i: '#f94144',
                    j: '#f3722c',
                    l: '#f8961e',
                    o: '#f9c74f',
                    t: '#90be6d',
                    s: '#43aa8b',
                    z: '#577590',
                },
            }
        },
        init: function () {
            console.log('[Log]: initializing Settings');
            this.renderUISettings();
        },
    }
};