console.log("[Log]: Starting app.js");

let tetris = new Game({
    renderOn: document.querySelector('#app__render-zone'),
});

tetris.init();