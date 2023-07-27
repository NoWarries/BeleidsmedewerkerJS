import { guild } from "../../config/common.js";
import * as db from "../handlers/database.js";

const once = false;
const name = "messageReactionAdd";

/**
 * Execute => function that runs on corresponding event
 *
 * @param interaction
 * @returns {Promise<void>}
 */
async function execute(interaction)
{
    const guildConfig = db.getTable("server", interaction.message.guildId) || null;
    const {client} = await import("../main.js");

    guildConfig.then(data => {
        /*
        If server has config
        */
        if(data !== null) {
            /*
            Check if within voting channel
            */
            if (data.voteChannel === interaction.message.channelId || data.councilVoteChannel === interaction.channel){
                // If not an upvote or downvote
                if(interaction.emoji.id !== guild.emoji.upvote && interaction.emoji.id !== guild.emoji.downvote) {
                    // remove reaction
                    interaction.emoji.reaction.remove();
                    // send message and remove after 5 seconds
                    interaction.message.channel.send({
                        embeds: [
                            {
                                title: "Invalid reaction",
                                description: `You can only vote with ${client.emojis.cache.get(guild.emoji.upvote)} or ${client.emojis.cache.get(guild.emoji.downvote)}`,
                            }
                        ],
                    }).then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 3500);
                    }
                    );
                }
            } 
        }
    });
}

export { once, name, execute };