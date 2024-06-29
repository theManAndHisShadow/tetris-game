console.log('[Log]: Starting sound.js');


/**
 * Loads audio files and manages them 
 * @returns {Object}
 */
class SoundComposer {
    constructor(){
        // prop to saving Audio Context 
        this.context = null;

        // sound effects data
        this.sfx = {
            drop: null,
            movement: null,
            denied: null,
            rotation: null,
        }

        // music data
        this.music = {
            gameOverChine: null,
         }
    }

    /**
     * Loads file to SoundComposer
     * @param {Object} options
     * @param {string} options.path - path to file
     * @param {string} options.type - type of file (sfx, music)
     * @param {string} options.name - name of file
     */
    loadFile ({path, type, name}){
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
    }



    /**
     * Settings AudioContext, async file loading
     */
    init (){
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

        this.loadFile({
            type: 'sfx',
            name: 'rotation',
            path: "/resources/sounds/sfx__rotation.mp3",
        });

        this.loadFile({
            type: 'sfx',
            name: 'score',
            path: "/resources/sounds/sfx__score.mp3",
        });

        this.loadFile({
            type: 'music',
            name: 'gameOverChime',
            path: "/resources/sounds/music__game-over-chime.mp3",
        });

        let loadingQueueLength = Object.values(this.sfx).length;
        console.log('[Log]: loaded ' + loadingQueueLength + ' audio files');
    }



    /**
     * Play target sound file 
     * @param {string} type - type of sound file (sfx, music)
     * @param {string} name - name of file
     * @param {number} [gain = 1] - increase or decrease sound volume
     */
    play (type, name, gain = 1){
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


export { SoundComposer };