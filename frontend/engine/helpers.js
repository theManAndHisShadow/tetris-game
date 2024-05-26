console.log('[Log]: Starting helpers.js');

/**
 * Helper function that can detect of object touching
 * @param {object} firstObject 
 * @param {object} secondObject 
 * @param {number} size 
 * @returns 
 */
function isTouching(firstObject, secondObject, size) {
    // get first object x&y
    let x1 = firstObject.x;
    let y1 = firstObject.y;

    // get second object x&y
    let x2 = secondObject.x;
    let y2 = secondObject.y;

    // get bounding rect of second object
    let left1 = x1;
    let right1 = x1 + size;
    let top1 = y1;
    let bottom1 = y1 + size;

    // get bounding rect of second object
    let left2 = x2;
    let right2 = x2 + size;
    let top2 = y2;
    let bottom2 = y2 + size;

    // check is two object is touching
    let touch = (

        (top1 === bottom2 || bottom1 === top2) && (right1 > left2 && left1 < right2)
    );

    return touch;
}
