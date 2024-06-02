console.log("[Log]: Starting app.js");

let tetris = new Game({
    screen: document.querySelector('#app__screen'),
    gridCellSize: 23,
    fieldSize: [12, 21]
});

tetris.init();