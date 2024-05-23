console.log('[Log]: Starting settings.js');

const Settings = function(){
    const devModeToggle__button = document.querySelector('#dev-controls__toggleDevMode-button');

    return {
        dev: {
            __devModeState: true,
            __showBrickCenter: true,
        },
    
        gravity: 0.01,

        init: function(){
            console.log('[Log]: initializing Settings');
            
            devModeToggle__button.addEventListener('click', (e) => {
                this.dev.__devModeState = this.dev.__devModeState === true ? false : true;

                console.log(this.dev.__devModeState);
            });
        },
    }
};