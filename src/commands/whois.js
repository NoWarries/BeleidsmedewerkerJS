import { SlashCommandBuilder } from "@discordjs/builders";
import * as config from "../../config/common.js";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

let data = new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Whoami or whois command")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("User to request data from")
    );

async function execute(interaction) {
    const { ensureRecord } = await import("../handlers/database.js");
    const { client } = await import("../main.js");
    const user = interaction.options.getUser("user") || interaction.user;
    const userID = user.id;

    await ensureRecord(userID);
    fetch(`${config.api.endpoint}/user/${userID}`)
        .then(res => res.json()).then(data => {

            /*
            Given is that data.progress.relative.togo is the amount of xp togo for the next level
            Given is that data.progress.relative.earned is the amount of xp earned for the current level
            Given is that data.progress.relative.needed is the amount of xp needed for the relative level

            Calculate the percentage past for this level
             */
            const percentage = (data.progress.relative.earned / data.progress.relative.needed) * 100;
            // Round percentage to 2 decimal places
            const percentageShort = Math.round(percentage * 100) / 100;

            let bar = "";
            // Create a bar of 10 characters
            for (let i = 1; i <= 10; i++) {
                if (i < percentageShort / 10) {
                    bar += "🟥";
                } else {
                    bar += "⬜";
                }
            }

            const guild = client.guilds.cache.get(config.guild.id);
            const originalEmbed = new MessageEmbed()
                .setTimestamp()
                .setTitle(`${config.guild.shorthand} - ${user.username}`)
                .setColor(config.colors.default)
                .setThumbnail(user.avatarURL())

                .addField("Gebruikersnaam", `${user.username}#${user.discriminator}`, true)
                .addField("Naam", guild.members.cache.get(userID).nickname, true)
                .addField("ID", user.id, true)

                .addField(`\u200B \n ${bar}  ${percentageShort} %`, "\u200B")

                .addField("Level", `${data.progress.level}`, true)
                .addField("Experience", `(${data.progress.relative.earned}/${data.progress.relative.needed})`, true)
                .addField("Needed", `${data.progress.relative.togo}`, true)

                .addField("\u200B", "\u200B")

                .addField("Messages :", data.activity.messages.toString(), true)
                .addField("Minutes  :", data.activity.minutes.toString(), true);

            interaction.reply({embeds: [originalEmbed]});
        });
}

export { data, execute };