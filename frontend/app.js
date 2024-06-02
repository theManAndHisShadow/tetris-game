console.log("[Log]: Starting app.js");

let tetris = new Game({
    renderOn: document.querySelector('#app__render-zone'),
    gridCellSize: 23,
    fieldSize: [12, 22]
});

tetris.init();