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

            // draw dot to figure center
            __renderFigureCenter: {
                state: true,
                label: 'show figure center',
            },

            // draw bounding rect of figure
            __renderFigureBoundingRect: {
                state: true,
                label: 'show figure bounding rect',
            },
        },

        // speed of figure moving to bottom
        gravity: 0.1,

        init: function () {
            console.log('[Log]: initializing Settings');

        },
    }
};