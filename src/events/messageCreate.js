import stopPhishing from "stop-discord-phishing";
import * as infraction from "../handlers/ironDome.js";
import * as db from "../handlers/database.js";

import { assignXP } from "../handlers/xpBottle.js";
import * as config from "../../config/common.js";
import "dotenv/config";
import {iniateVote} from "./messageCreate/voteChannel.js";

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
    const interactionChannel = interaction.channel;
    const guildConfig = db.getTable("server", interaction.guild.id) || null;

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
        infraction.timeOut(interaction, config.moderation.phisingLink, "Phising link");

        return; // Exit out of execution ( No further steps required)
    }


    // Database
    assignXP(interaction.author.id, [config.xp.message.min, config.xp.message.max]);

    db.incrementMessage(interaction.author.id)
        .then(res => {
            console.log(res);
        });

    guildConfig.then(data => {
        /*
        If server has config
        */
        if(data !== null) {
            /*
            Check for voting channel
            */
            if (data.voteChannel === interactionChannel.id){
                iniateVote(interaction);
            }
        }
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