console.log('[Log]: Starting screen.js');

const GameScreen = function({html, canvas}){
    return {
        html: html,
        canvas: canvas,

        /**
         * Causes a shaking/trembling effect at canvas html elemtn
         * @param {string} direction 
         */
        tremble: function(direction){
            let cssSide = null;

            // setting css prop using direction
            if(direction == 'top') cssSide = 'top';
            if(direction == 'down') cssSide = 'bottom';
            if(direction == 'left') cssSide = 'left';
            if(direction == 'right') cssSide = 'right';

            const css = getComputedStyle(this.canvas);
            const originValue = Number(css[cssSide].replace('px', ''));

            // some random at down direction
            const delta = direction == 'down' ? getRandomNumber(2, 6) : 3;

            const delay = 35;

            this.canvas.style[cssSide] = delta + 'px';

            setTimeout(()=>{
                this.canvas.style[cssSide] = originValue + 'px';

                // removing this attr to avoiding bugs when canvas dont moving 
                // cause has 'left: 0, right: 0, top: 0, bottom: 0'
                this.canvas.removeAttribute('style');
            }, delay);

        },
    };
};