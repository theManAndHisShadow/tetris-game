console.log('[Log]: Starting controls.js');

class Controls {
    // Storing event listener set state
    #hasKeyboardHandler = false;

    constructor(){
        this.handlerQueue = [];
    }

    /**
     * This function adds callbacks to handlerQueue array. 
     * That handlerQueue callback functions executes inside default 'document.body.addEventListener('keydown', ...)' at 'init' function
     * @param {string} action - trigger, that invokes callback function 
     * @param {Function} callback - what to do after triggered 
     */
    on (action, callback){
        this.handlerQueue.push([action, callback]);
    }

    init (){
        console.log('[Log]: initializing Controls');

        // Check that event listener set only once
        if(!this.#hasKeyboardHandler){
            // update event listener set state
            this.#hasKeyboardHandler = true;

            document.body.addEventListener('keypress', (e) => {
                /**
                 * Internal helper function.
                 * @param {string} targetAction 
                 * @param {array} item pair [action, cb], single item of control handlerQueue
                 */
                function __execute(targetAction, item,){
                    let action = item[0];
                    let cb = item[1];

                    if(action == targetAction) {
                        cb();
                    }
                }
                
                // This block chesk paricular key press and call cb function from handlerQueue
                if(e.code == "ArrowUp" || e.code == "KeyW") {
                    this.handlerQueue.forEach(item => {
                        __execute('up', item);
                    });
                }

                if(e.code == "ArrowLeft" || e.code == "KeyA") {
                    this.handlerQueue.forEach(item => {
                        __execute('left', item);
                    });
                }

                if(e.code == "ArrowRight" || e.code == "KeyD") {
                    this.handlerQueue.forEach(item => {
                        __execute('right', item);
                    });
                }

                if(e.code == "ArrowDown" || e.code == "KeyS") {
                    this.handlerQueue.forEach(item => {
                        __execute('down', item);
                    });
                }

                if(e.code == "Space") {
                    this.handlerQueue.forEach(item => {
                        __execute('space', item);
                    });
                }
            });
        }
    }
}

export { Controls };