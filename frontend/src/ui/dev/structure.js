const data = {
    sections: [
        {
            title: 'Dev mode',
            options: [
                {
                    id: 'devMode',
                    label: 'dev mode',
                    type: 'checkbox',
                    state: true,
                },

                {
                    id: 'disableGravity',
                    type: 'checkbox',
                    label: 'disable gravity',
                    state: false,
                },

                {
                    id: 'printGameFieldFiguresToConsole',
                    type: 'button',
                    label: "print 'Game.field.figures' to console",
                    buttonText: 'print',

                    execute: null,
                },

                {
                    id: 'clearField',
                    type: 'button',
                    label: "clear 'Game.field.figures' array",
                    buttonText: 'clear',

                    execute: null,
                },

                {
                    id: 'renderFieldGrid',
                    type: 'checkbox',
                    label: 'render field grid',
                    state: true,
                },

                {
                    id: 'renderFigureCenter',
                    type: 'checkbox',
                    label: 'render figure center',
                    state: false,
                },

                {
                    id: 'spawnFigure',
                    type: 'button-list',
                    label: 'spawn figure',
                    list: ['i', 'j', 'l', 'o', 't', 's', 'z'],
            
                    // prop that stores cb function
                    execute: null,
                },
            ],
        },
    ],
}

export { data };