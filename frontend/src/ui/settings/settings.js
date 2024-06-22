console.log('[Log]: Starting settings.js');

import { CreateSettingsModal } from "../modal.js";

const Settings = function () {

    return {
        // speed of figure moving to bottom
        gravity: 0.1,

        html: null,

        // TODO: refactor
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

        renderUISettings: function(){
            const modal = new CreateSettingsModal(this.modal, this.colors, this.images);

            this.html = modal;

            modal.init();
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

        on: function(eventName, callback){
            if(eventName == 'open' || eventName == 'close'){
                this.html.event[eventName].addEvent(callback);
            }
        },

        init: function () {
            console.log('[Log]: initializing Settings');
            this.renderUISettings();
        },
    }
};

export { Settings };