const canvas = document.getElementById('app__render-zone');
const context = canvas.getContext('2d');

const squareParam = {
    x: 10,
    y: 10,
    w: 50,
    h: 50,
    moveTo (axisAdd){
        context.clearRect(this.x, this.y, this.w, this.h);
    
        if(axisAdd === 'x+') this.x++;
    
        if(axisAdd === 'x-') this.x--;
    
        if(axisAdd === 'y+') this.y++;
    
        if(axisAdd === 'y-') this.y--;
    
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}

context.fillRect(squareParam.x, squareParam.y, squareParam.w, squareParam.h);

document.addEventListener("keydown", (event) => {
    if(event.key === 'ArrowLeft'){
        squareParam.moveTo('x-');
    }

    if(event.key === 'ArrowRight'){
        squareParam.moveTo('x+');
    }

    if(event.key === 'ArrowUp'){
        squareParam.moveTo('y-');
    }

    if(event.key === 'ArrowDown'){
        squareParam.moveTo('y+');
    }
});
