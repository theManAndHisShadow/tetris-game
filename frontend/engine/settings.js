console.log('[Log]: Starting settings.js');

const Settings = function(){
    const devModeToggle__button = document.querySelector('#dev-panel__toggleDevMode-button');
    const showFigureCenter__button = document.querySelector('#dev-panel__showFigureCenter-button');

    return {
        // TODO: 
        // refactor settings logic, move dev html actions to dedicated file
        // add some dynamic html generation
        // add auto 'toggle-state' handling
        // add comments
        dev: {
            __devModeState: true,
            __showFigureCenter: true,
        },
    
        gravity: 0.1,

        init: function(){
            function __updateVisual(target, state){
                target.classList = "state-" + state;
                target.innerHTML = `${state}`;
            }

            console.log('[Log]: initializing Settings');
            __updateVisual(devModeToggle__button, this.dev.__devModeState);
            __updateVisual(showFigureCenter__button, this.dev.__showFigureCenter);

            devModeToggle__button.addEventListener('click', (e) => {
                this.dev.__devModeState = this.dev.__devModeState === true ? false : true;
                __updateVisual(devModeToggle__button, this.dev.__devModeState);

                console.log(this.dev.__devModeState);
            });

            showFigureCenter__button.addEventListener('click', (e) => {
                this.dev.__showFigureCenter = this.dev.__showFigureCenter === true ? false : true;
                __updateVisual(showFigureCenter__button, this.dev.__showFigureCenter);

                console.log(this.dev.__showFigureCenter);
            });
        },
    }
};