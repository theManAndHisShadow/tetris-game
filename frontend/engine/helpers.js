console.log('[Log]: Starting helpers.js');

function getRandomNumber(min, max) {
    let rand = min + Math.random() * (max + 1 - min);

    return Math.floor(rand);
}

function rotate(cx, cy, x, y, angle) {
  var radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return {x: nx, y: ny};
}