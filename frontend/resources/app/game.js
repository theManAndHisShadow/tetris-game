const canvas = document.getElementById('app__render-zone');
const context = canvas.getContext('2d');

canvas.height = 500;

const randomSquare = {
    createButton: document.getElementById('app__random-create'),
    generateSquare(){
        this.square = new Element(Math.random() * 200, Math.random() * 400, 50, 50);
        context.fillRect(this.square.x, this.square.y, this.square.w, this.square.h);
    }
}

function Element(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function syncMoveSquares(n){
    const elements = Array();
    let distance = 5;
    for (let i = 0; i < n; i++) {
        elements.push(new Element(distance, 10, 50, 50));
        distance += 55;
    }
    
    setInterval(() => {    
        for(const el of elements){
            context.clearRect(el.x, el.y, el.w, el.h);

            if(el.y < canvas.height){
                el.y++;
            } else {
                el.y = 0;
            }

            context.fillRect(el.x, el.y, el.w, el.h);
        }
    }, 20);
}

syncMoveSquares(2);

randomSquare.createButton.addEventListener('click', () => {
    randomSquare.generateSquare();
})


function moveTo(element, axisAdd){
    context.clearRect(element.x, element.y, element.w, element.h);

    if(axisAdd === 'x+') element.x++;

    if(axisAdd === 'x-') element.x--;

    if(axisAdd === 'y+') element.y++;

    if(axisAdd === 'y-') element.y--;

    context.fillRect(element.x, element.y, element.w, element.h);
}

document.addEventListener("keydown", (event) => {
    if(event.key === 'ArrowLeft'){
        moveTo(randomSquare.square, 'x-');
    }

    if(event.key === 'ArrowRight'){
        moveTo(randomSquare.square, 'x+');
    }

    if(event.key === 'ArrowUp'){
        moveTo(randomSquare.square, 'y-');
    }

    if(event.key === 'ArrowDown'){
        moveTo(randomSquare.square, 'y+');
    }
});
