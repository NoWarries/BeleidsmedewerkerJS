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

    guildConfig.then(async data => {
        /*
        If server has config
        */
        if(data !== null) {
            /*
            Check if within voting channel
            */
            if (data.voteChannel === interaction.message.channelId || data.councilVoteChannel === interaction.channel){
                // If not an upvote or downvote

                // fetch the message
                const reaction = await interaction.message.channel.messages.fetch(interaction.message.id).then((message) => {
                    // fetch the reaction
                    return message.reactions.cache.find(
                        (reaction) => {
                            return reaction.emoji.name === interaction.emoji.name || (reaction.emoji.id != null && reaction.emoji.id === interaction.emoji.id);
                        }
                    );
                
                });

                const botAuthored = await reaction.users.fetch().then((users) => {
                    return users.has(client.user.id);
                });

                // Reaction is not an upvote or downvote and bot did not add the reaction
                if(interaction.emoji.id !== guild.emoji.upvote && interaction.emoji.id !== guild.emoji.downvote && !botAuthored) {

                    // remove reaction
                    if(interaction.emoji.id !== null) {
                        interaction.message.reactions.cache.get(interaction.emoji.id).remove();
                    } else {
                        interaction.message.reactions.cache.get(interaction.emoji.name).remove();
                    }

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