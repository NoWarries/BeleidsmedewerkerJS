import {EmbedBuilder} from "discord.js";
import { createVote } from "../../handlers/database.js";

async function iniateCouncilVote(interaction) {
    const {client} = await import("../../main.js");

    // Delete the message
    interaction.delete();

    // Emote reference variables
    const up = "<:upvote:819303307033444363>";
    const down = "<:downvote:819304367806087189>";

    const embed = new EmbedBuilder();
    const user = client.users.cache.get(interaction.author.id);

    embed.setTitle("Motion and Vote [i]");
    embed.setDescription("Vote id: " + interaction.id);
    embed.setFooter({
        text: `${interaction.guild.members.cache.get(interaction.author.id).nickname}`,
        iconURL: user.avatarURL()
    });
    embed.setTimestamp();
    embed.setColor("#fff");
    embed.addFields(
        {
            name: "\u200B",
            value: "```" + interaction.content + "```",
            inline: false
        }
    );
    interaction.channel.send({embeds: [embed]})
        .then(message => message.react(up))
        .then(res => res.message.react(down))
        .then (res => {
            createVote(
                interaction.id, 
                interaction.channel.id, 
                res.message.id,
                
                interaction.content,
                "Pending",

                interaction.author.id,
            );
        });
}

export { iniateCouncilVote };