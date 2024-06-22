console.log("[Log]: Starting app.js");

import { Game } from './src/game.js';
import { Settings } from './src/ui/settings/settings.js';
import { DevHelper } from './src/ui/dev/dev.js';

const settings = new Settings();
settings.init();

const devTool = new DevHelper({
    rootElement: document.querySelector('#root')
});

devTool.init();

const tetris = new Game({
    screenElement: document.querySelector('#app__screen'),
    gridCellSize: 23,
    fieldSize: [12, 21], 
    settings: settings,
    devSettings: devTool,
});

settings.on('open', () => {
    console.log('[Log]: settings window is open');
    tetris.pause();
});

settings.on('close', () => {
    console.log('[Log]: settings window is closed');
    tetris.resume();
});

tetris.init();