class Texture {
    constructor({renderer, width, height, x, y}){
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

        // path to image
        this.url = null;

        // loading status
        this.loaded = false;

        // previously loaded texture
        this.texture = null;
    }



    /**
     * Loads image as texture
     * @param {string} url path to texture image
     */
    load(url){
        this.url = url;

        const texture = new Image();
        texture.src = url;

        // on texture load - set status of loading and save texture for future using
        texture.onload = () => {
            this.texture = texture;
            this.loaded = true;
        };
    }



    /**
     * 
     */
    render(){
        // if texture already loadd - use it again
        if(this.loaded === true) {
            this.renderer.context.drawImage(this.texture, this.x, this.y, this.width, this.height);
        }
    }
}

export { Texture };