console.log('[Log]: Starting helpers.js');



/**
 * Returns random integer from range (min, max)
 * @param {number} min range start value
 * @param {number} max range end value (including max value)
 * @returns {number}
 */
function getRandomNumber(min, max) {
  let randomNUmber = min + Math.random() * (max + 1 - min);

  return Math.floor(randomNUmber);
}



/**
 * Rotates given point around another given point (rotation center);
 * @param {number} cx rotation centerpoint x
 * @param {number} cy rotation center point y
 * @param {number} x position at x axis
 * @param {number} y  position at y axis
 * @param {number} angle rotation angle in degrees
 * @returns {object}
 */
function rotatePoint(cx, cy, x, y, angle) {
  let radians = (Math.PI / 180) * angle;
  let cos = Math.cos(radians);
  let sin = Math.sin(radians);
  let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
  let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

  return {x: nx, y: ny};
}

/**
 * Adding leading zero to time values
 * @param {number} time 
 * @returns 
 */
function addLeadingZero(time){
  let corrected = time == 0 ? '00' : time > 9 ? time : '0' + time;

  return corrected;
}