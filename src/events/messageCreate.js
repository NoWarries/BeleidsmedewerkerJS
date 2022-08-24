import stopPhishing from "stop-discord-phishing";
import * as infraction from "../handlers/ironDome.js";
import * as db from "../handlers/database.js";
import {MessageEmbed} from "discord.js";
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

    // Eval command for testing (will be moved later on)
    // eslint-disable-next-line no-undef
    if ( interaction.author.id === process.env.OWNER_ID
        && interaction.content.startsWith("$eval```js")) {

        let content = interaction.content;
        content = content.replace("$eval```js", "");
        const code = content.replace("```", "");

        try {
            var evaled = eval(code);
            const embed = new MessageEmbed()
                .setColor(0x00A2E8)
                .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: output: ", `\`\`\`js\n${clean(evaled)}\n\`\`\``);

            interaction.channel.send({embeds: [embed]});
        } catch (err) {
            const embed = new MessageEmbed()
                .setColor(0x00A2E8)
                .addField(":inbox_tray: Input: ", `\`\`\`${code}\`\`\``)
                .addField(":outbox_tray: output: ", `\`\`\`${clean(err)}\`\`\``);

            interaction.channel.send({embeds: [embed]});
        }
        // eslint-disable-next-line no-inner-declarations
        function clean(text) {
            if (typeof(text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
    }
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