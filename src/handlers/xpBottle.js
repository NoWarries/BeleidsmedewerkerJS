import { addLevel, addXP } from "./database.js";
import ip from "ip";
import * as config from "../../config/common.js";
import fetch from "node-fetch";
import {announceLevelUp} from "./communicator.js";

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
 * assignXP to user id
 * @param {string} id 
 * @param {[number, number]} param1 
 */
function assignXP(id, [min, max]) {
    const xp = determineXP(min, max);
    addXP(id, xp).then(() => {
        fetch(`${config.api.endpoint}/user/${id}`).then(res => res.json()).then(data => {
            
            // if xp required has been reached
            if(data.progress.relative.togo <= 0) {
                // add level
                announceLevelUp(id, config.guild.channels.levelup, config.guild.id, data.progress.level+1).then(() =>
                    addLevel(id)
                );
            }

        });
    });
}



export { assignXP };
