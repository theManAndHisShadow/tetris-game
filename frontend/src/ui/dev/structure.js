const data = {
    sections: [
        {
            title: 'Dev mode',
            options: [
                {
                    id: 'devMode',
                    label: 'dev mode',
                    type: 'toggle',
                    state: false,
                },

                {
                    id: 'disableGravity',
                    type: 'toggle',
                    label: 'disable gravity',
                    state: false,
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