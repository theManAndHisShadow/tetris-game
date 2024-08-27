
import { Game } from '../game.js';

class MobileControllers {

  initControllers(){
    const controlBlock = document.createElement('div');
    const leftController = document.createElement('img');
    const rightController = document.createElement('img');
    const rotateController = document.createElement('img');
    const downController = document.createElement('img');
    const forceDownController = document.createElement('img');
    
    leftController.setAttribute('src', '../../resources/images/mobile/controls-arrows/leftarrow.png');
    rightController.setAttribute('src', '../../resources/images/mobile/controls-arrows/rightarrow.png');
    rotateController.setAttribute('src', '../../resources/images/mobile/controls-arrows/uparrow.png');
    downController.setAttribute('src', '../../resources/images/mobile/controls-arrows/downarrow.png');
    forceDownController.setAttribute('src', '../../resources/images/mobile/controls-arrows/forcedown.png');

    controlBlock.id = 'controllers__block';
    leftController.id = 'controller__left';
    rightController.id = 'controller__right';
    rotateController.id = 'controller__up';
    downController.id = 'controller__down';
    forceDownController.id = 'controller__forcedown';

    controlBlock.appendChild(leftController);
    controlBlock.appendChild(rotateController);
    controlBlock.appendChild(rightController);
    controlBlock.appendChild(downController);
    controlBlock.appendChild(forceDownController);

    document.querySelector('#root').appendChild(controlBlock);
  }

  checkDevice(){
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          this.initControllers();
        }else{
          return 0;
        }
  }

  init() {
    this.checkDevice();
  }

}

export { MobileControllers }