console.log('[Log]: Starting settings.js');

const Settings = function () {

    return {
        // Storing some props for dev & debugging purposes
        dev: {
            // globally turn on or off dev mode
            __devMode: {
                state: true,
                label: 'dev mode',
            },

            __disableGravity: {
                state: false,
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

        // speed of figure moving to bottom
        gravity: 0.1,

        init: function () {
            console.log('[Log]: initializing Settings');

        },
    }
};