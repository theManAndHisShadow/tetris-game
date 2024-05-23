console.log('[Log]: Starting settings.js');

const Settings = function(){
    const devModeToggle__button = document.querySelector('#dev-panel__toggleDevMode-button');

    return {
        dev: {
            __devModeState: true,
            __showBrickCenter: true,
        },
    
        gravity: 0.01,

        init: function(){
            function __updateVisual(target, state){
                target.classList = "state-" + state;
                target.innerHTML = state === true ? 'on' : 'off';
            }

            console.log('[Log]: initializing Settings');
            __updateVisual(devModeToggle__button, this.dev.__devModeState);

            devModeToggle__button.addEventListener('click', (e) => {
                this.dev.__devModeState = this.dev.__devModeState === true ? false : true;
                __updateVisual(devModeToggle__button, this.dev.__devModeState);

                console.log(this.dev.__devModeState);
            });
        },
    }
};