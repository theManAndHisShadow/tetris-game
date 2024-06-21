console.log("[Log]: Starting app.js");

const tetris = new Game({
    screenElement: document.querySelector('#app__screen'),
    gridCellSize: 23,
    fieldSize: [12, 21]
});

const settings = new Settings();
settings.on('open', () => {
    console.log('settings window is open');
});

settings.on('close', () => {
    console.log('settings window is closed');
});

const devTool = new DevUI({});

tetris.init();