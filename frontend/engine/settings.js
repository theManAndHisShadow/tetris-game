console.log('[Log]: Starting settings.js');

const Settings = function(){
    const devModeToggle__button = document.querySelector('#dev-panel__toggleDevMode-button');
    const showBrickCenter__button = document.querySelector('#dev-panel__showBrickCenter-button');

    return {
        // TODO: 
        // refactor settings logic, move dev html actions to dedicated file
        // add some dynamic html generation
        // add auto 'toggle-state' handling
        // add comments
        dev: {
            __devModeState: true,
            __showBrickCenter: true,
        },
    
        gravity: 0.1,

        init: function(){
            function __updateVisual(target, state){
                target.classList = "state-" + state;
                target.innerHTML = `${state}`;
            }

            console.log('[Log]: initializing Settings');
            __updateVisual(devModeToggle__button, this.dev.__devModeState);
            __updateVisual(showBrickCenter__button, this.dev.__showBrickCenter);

            devModeToggle__button.addEventListener('click', (e) => {
                this.dev.__devModeState = this.dev.__devModeState === true ? false : true;
                __updateVisual(devModeToggle__button, this.dev.__devModeState);

                console.log(this.dev.__devModeState);
            });

            showBrickCenter__button.addEventListener('click', (e) => {
                this.dev.__showBrickCenter = this.dev.__showBrickCenter === true ? false : true;
                __updateVisual(showBrickCenter__button, this.dev.__showBrickCenter);

                console.log(this.dev.__showBrickCenter);
            });
        },
    }
};