import stopPhishing from "stop-discord-phishing";
import * as infraction from "../handler/ironDome.js";
import * as db from "../handler/database.js";
import {  } from "discord.js";
import { assignXP } from "../handler/xpBottle.js";
import * as config from "../../config/common.js";


const once = false;
const name = "messageCreate";

/**
 * Execute => function that runs on corresponding event
 *
 * @param interaction
 * @returns {Promise<void>}
 */
async function execute(interaction)
{
    /*
    Check if user whom send the message is a bot

    if true return function
        - Prevents loops
        - Prevents resource wasting
     */
    if(interaction.author.bot) return;

    // Check if message contains a phisingLink
    const phisingLinkTrue = checkMessage(interaction.content) || checkMessageFull(interaction.content);
    if(await phisingLinkTrue){

        infraction.deleteMesasge(interaction, "Phising link");
        infraction.timeOut(interaction, 10, "Phising link");

        return; // Exit out of execution ( No further steps required)
    }

    // Database
    assignXP(interaction.author.id, [config.xp.message.min, config.xp.message.max]);

    db.incrementMessage(interaction.author.id)
        .then(res => {
            console.log(res);
        });

}

/**
 * Global default message scan / check
 *
 * @param {string} message
 * @returns {Promise<boolean>}
 */
async function checkMessage (message) {
    //check string on confirmed Phishing Domains
    let isGrabber = await stopPhishing.checkMessage(message);
    //Now you can do something with the Boolean Value
    return isGrabber;
}

/**
 * @param {string} message
 * @returns {Promise<boolean>}
 */
async function checkMessageFull (message) {
    //check string on confirmed & not yet confirmed but suspicious Phishing Domains
    let isGrabber = await stopPhishing.checkMessage(message);
    //Now you can do something with the Boolean Value
    return isGrabber;
}


export { once, name, execute };