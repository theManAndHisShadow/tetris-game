console.log('[Log]: Starting settings.js');

const Settings = function () {

    return {
        // speed of figure moving to bottom
        gravity: 0.1,
        
        // Storing some props for dev & debugging purposes
        dev: {
            // globally turn on or off dev mode
            __devMode: {
                type: 'toggle',
                label: 'dev mode',
                state: true,
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
                fieldColor: '#1c202f',
                gridColor: '#0f1426',
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

        },
    }
};