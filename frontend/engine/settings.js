console.log('[Log]: Starting settings.js');

const Settings = function () {

    return {
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
                label: 'Render figure center',
                state: true,
            },

            // draw bounding rect of figure
            __rendeFieldFreeSpaceBoundingRect: {
                type: 'toggle',
                label: 'Render free space rect',
                state: true,
            },

            __drawFieldGrid: {
                type: 'toggle',
                label: 'Render field grid',
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

        // speed of figure moving to bottom
        gravity: 0.1,

        init: function () {
            console.log('[Log]: initializing Settings');

        },
    }
};