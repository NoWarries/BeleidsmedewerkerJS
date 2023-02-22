import * as config from "../../config/common.js";
import {EmbedBuilder} from "discord.js";
const { client } = await import("../main.js");

// Retrieve guild specific interaction data
class Interaction
{
    constructor(userID = null, channelID = config.guild.channels.general, guildID = config.guild.id)
    {
        this.guild = client.guilds.cache.get(guildID);
        this.channel = client.channels.cache.get(channelID);
        this.user = this.guild.members.cache.get(userID);
        console.log(this.channel);
    }
}

/**
 *
 * @param {string} userID
 * @param {number} channelID
 * @param {number} guildID
 * @param {number} level
 * @returns {Promise<void>}
 */
async function announceLevelUp(userID, channelID, guildID, level) {
    /*
    announceLevelUp(
        interaction.author.id,
        config.guild.channels.levelup,
        interaction.guild.id
    );
     */

    // construct interaction object
    const interaction = new Interaction(userID, channelID, guildID);

    // create embed
    const embed = new EmbedBuilder()
        .setTitle("Progressie geen depressie [!]")
        .setDescription(`Hoera! <@${interaction.user.id}> heeft een nieuw niveau bereikt`)
        .addFields({
            name: "\u200B",
            value: `Gefeliciteerd met het bereiken van niveau ${level} mogen er nog vele volgen 🙏`,
            inline: false
        })
        .setThumbnail(interaction.user.displayAvatarURL())
        .setColor(config.colors.levelup);

    interaction.channel.send({embeds: [embed]});
}

export { announceLevelUp };