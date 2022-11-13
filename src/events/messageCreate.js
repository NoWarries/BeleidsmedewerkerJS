import stopPhishing from "stop-discord-phishing";
import * as infraction from "../handlers/ironDome.js";
import * as db from "../handlers/database.js";
import { EmbedBuilder } from "discord.js";
import { assignXP } from "../handlers/xpBottle.js";
import * as config from "../../config/common.js";
import "dotenv/config";

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
    const { client } = await import("../main.js");   
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
                // Delete the message
                interaction.delete();

                // Emote reference variables
                const up = "<:upvote:819303307033444363>";
                const down = "<:downvote:819304367806087189>";

                const embed = new EmbedBuilder();
                const user = client.users.cache.get(interaction.author.id);

                embed.setTitle("Stelling en Stemming [i]");
                embed.setDescription("Een nieuwe stelling is geplaatst \n Gelieve te kiezen uit " + up + " (Upvote) en " + down + " (Downvote)");
                embed.setFooter({text: `${interaction.guild.members.cache.get(interaction.author.id).nickname}`, iconURL: user.avatarURL()});
                embed.setTimestamp();
                embed.setColor("Random");
                embed.addFields(
                    { 
                        name: "\u200B", 
                        value: "```" + interaction.content + "```",
                        inline: false
                    }
                );
                interaction.channel.send({ embeds: [embed] })
                    .then(message => message.react(up))
                    .then(res => res.message.react(down));
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