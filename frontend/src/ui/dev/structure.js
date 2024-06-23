const data = {
    sections: [
        {
            title: 'Dev mode',
            options: [
                {
                    id: 'devMode',
                    label: 'dev mode',
                    type: 'toggle',
                    state: true,
                },

                {
                    id: 'disableGravity',
                    type: 'toggle',
                    label: 'disable gravity',
                    state: false,
                },

                {
                    id: 'printGameFieldFiguresToConsole',
                    type: 'button',
                    label: "print 'Game.field.figures' to console",

                    execute: null,
                },

                {
                    id: 'renderFieldGrid',
                    type: 'toggle',
                    label: 'render field grid',
                    state: true,
                },

                {
                    id: 'renderFigureCenter',
                    type: 'toggle',
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