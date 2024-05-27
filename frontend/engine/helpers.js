console.log('[Log]: Starting helpers.js');

/**
 * Helper function that can detect of object touching
 * @param {object} firstObject 
 * @param {object} secondObject 
 * @param {number} size 
 * @returns 
 */
function isTouchingTo(first, second, size, side) {
    // Checking that the first object touches the second in a downward direction.
    if (side === 'down') {
        return (first.y + size === second.y && 
                first.x < second.x + size &&
                first.x + size > second.x);
    }
    // Checking that the first object touches the second in a upward direction.
    else if (side === 'top') {
        return (second.y + size === first.y && 
                first.x < second.x + size &&
                first.x + size > second.x);
    }
    // Checking that the first object touches the second in a left-to-right direction
    else if (side === 'left') {
        return (first.x + size === second.x && 
                first.y < second.y + size &&
                first.y + size > second.y);
    }
    // Checking that the first object touches the second in a right-to-left direction
    else if (side === 'right') {
        return (second.x + size === first.x && 
                first.y < second.y + size &&
                first.y + size > second.y);
    }
    // Если указано неверное направление
    else {
        throw new Error('isTouchingTo side argument is incorrect!');
    }
}