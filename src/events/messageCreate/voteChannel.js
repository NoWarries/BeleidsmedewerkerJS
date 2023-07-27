import {EmbedBuilder} from "discord.js";
import { guild } from "../../../config/common.js";

async function iniateVote(interaction) {
    const {client} = await import("../../main.js");

    // Delete the message
    interaction.delete();

    // Emote reference variables
    const up = `<:upvote:${guild.emoji.upvote}>`;
    const down = `<:downvote:${guild.emoji.downvote}>`;

    const embed = new EmbedBuilder();
    const user = client.users.cache.get(interaction.author.id);

    embed.setTitle("Poll and Voting [i]");
    embed.setDescription("A new poll has been posted. \n Please choose between " + up + " (Upvote) and " + down + " (Downvote)");
    embed.setFooter({
        text: `${interaction.guild.members.cache.get(interaction.author.id).nickname}`,
        iconURL: user.avatarURL()
    });
    embed.setTimestamp();
    embed.setColor("Random");
    embed.addFields(
        {
            name: "\u200B",
            value: "```" + interaction.content + "```",
            inline: false
        }
    );
    interaction.channel.send({embeds: [embed]})
        .then(message => message.react(up))
        .then(res => res.message.react(down));
}

export { iniateVote };