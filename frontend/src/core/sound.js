console.log('[Log]: Starting sound.js');

/**
 * Loads audio files and manages them 
 * @returns {Object}
 */
const SoundComposer = function(){
    return {
        // prop to saving Audio Context 
        context: null,

        // sound effects data
        sfx: {
            drop: null,
            movement: null,
            denied: null,
        },

        // music data
        music: {

        },

        /**
         * Loads file to SoundComposer
         * @param {string} path path to file
         * @param {string} type type of file (sfx, music)
         * @param {string} name name of file
         */
        loadFile: function({path, type, name}){
            const request = new XMLHttpRequest();
            request.open('GET', path, true);
            request.responseType = 'arraybuffer';

            // Decode asynchronously
            request.onload = () => {
                this.context.decodeAudioData(request.response, buffer => {
                    if (!buffer) {
                        console.log('Error decoding file data: ' + path);
                        return;
                    }

                    this[type][name] = buffer;
                });
            };

            request.onerror = function() {
                console.log('BufferLoader: XHR error');        
            };

            request.send();
        },



        /**
         * Settings AudioContext, async file loading
         */
        init: function(){
            console.log('[Log]: initializing SoundComposer');

            this.context = new AudioContext();

            this.loadFile({
                type: 'sfx',
                name: 'movement',
                path: "/resources/sounds/sfx__movement.mp3",
            });

            this.loadFile({
                type: 'sfx',
                name: 'drop',
                path: "/resources/sounds/sfx__drop.mp3",
            });

            this.loadFile({
                type: 'sfx',
                name: 'denied',
                path: "/resources/sounds/sfx__denied.mp3",
            });

            let loadingQueueLength = Object.values(this.sfx).length;
            console.log('[Log]: loaded ' + loadingQueueLength + ' audio files');
        },



        /**
         * Play target sound file 
         * @param {string} type type of sound file (sfx, music)
         * @param {string} name name of file
         * @param {number} gain (optional) increase or decrease sound volume
         */
        play: function(type, name, gain){
            gain = gain || 1; // Setting default gain to 1 instead of 0

            if(!this[type]) {
                throw new Error("Unknown sound type '"+ type +"'!");
            }

            if(this[type] && !this[type][name]) {
                throw new Error("Unknown sound name '"+ name +"'!");
            }

            if(this[type] && this[type][name]){
                let source = this.context.createBufferSource();    // creates a sound source
                source.buffer = this[type][name];                  // tell the source which sound to play
                
                let gainNode = this.context.createGain();          // Create a gain node
                gainNode.connect(this.context.destination);        // Connect the gain node to the destination
                gainNode.gain.value = gain;                        // Set the volume
                
                source.connect(gainNode);                          // Connect the source to the gain node
                
                // Zero in function below means timecode of staring pay process
                source.start(0);  

                // Cleaning some parts after completion 
                source.onended = () => {
                    source.disconnect(gainNode);
                    gainNode.disconnect(this.context.destination);
                };
            } 
        }
    }
};

export { SoundComposer };