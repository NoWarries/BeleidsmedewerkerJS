import { addXP } from "./database.js";

/**
 * Generates a random number with a min and max value
 * @param {number} min // min xp
 * @param {number} max // max xp
 * @returns {number} // xp to give out
 */
function determineXP(min, max) {
    const xp = Math.floor(Math.random() * max) + min;

    return xp;
}

/**
 * 
 * @param {string} id 
 * @param {[number, number]} param1 
 */
function assignXP(id, [min, max]) {
    const xp = determineXP(min, max);
    addXP(id, xp).then(res => {
        console.log(res);
    });
}



export { assignXP };
