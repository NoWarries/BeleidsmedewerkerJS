import {EmbedBuilder} from "discord.js";

async function iniateVote(interaction) {
    const {client} = await import("../../main.js");

    // Delete the message
    interaction.delete();

    // Emote reference variables
    const up = "<:upvote:819303307033444363>";
    const down = "<:downvote:819304367806087189>";

    const embed = new EmbedBuilder();
    const user = client.users.cache.get(interaction.author.id);

    embed.setTitle("Stelling en Stemming [i]");
    embed.setDescription("Een nieuwe stelling is geplaatst \n Gelieve te kiezen uit " + up + " (Upvote) en " + down + " (Downvote)");
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