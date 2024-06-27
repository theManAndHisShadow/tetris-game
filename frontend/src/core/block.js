import { Texture } from "./texture.js";

class Block {
    constructor({id, x, y, color, size, renderer, parentFigureID, textureName}){
        // Some preparations
        // preparing texture
        let blockTexture = new Texture({
            renderer: renderer, 
            width: size, 
            height: size,
            x: x,
            y: y,
        });

        // preload texture file
        blockTexture.load(`../../resources/images/textures/${textureName}`);


        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.parentFigureID = parentFigureID;
        this.renderer = renderer;
        this.texture = blockTexture;
        this.textureName = textureName;
    }

    /**
         * Render block using texture rendering method
         */
    render (){
        this.texture.x = this.x;
        this.texture.y = this.y;
        this.texture.render();
    }



    /**
     * @param {Figure} from Figure Object ref
     */
    deleteFrom (from){
        from.forEach(figure => {
            if(figure.id == this.parentFigureID) {
                figure.blocks = figure.blocks.filter(block => {
                    return block.id !== this.id;
                });
            }
        });
    }
};

export { Block };