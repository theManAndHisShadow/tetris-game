console.log('[Log]: Starting helpers.js');

function getRandomNumber(min, max) {
    let rand = min + Math.random() * (max + 1 - min);

    return Math.floor(rand);
  }