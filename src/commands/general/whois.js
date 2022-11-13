import { SlashCommandBuilder } from "@discordjs/builders";
import * as config from "../../../config/common.js";
import { EmbedBuilder } from "discord.js";
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
    const { ensureRecord } = await import("../../handlers/database.js");
    const { client } = await import("../../main.js");
    const user = interaction.options.getUser("user") || interaction.user;
    const userID = user.id;

    await ensureRecord(userID);
    fetch(`${config.api.endpoint}/user/${userID}`)
        .then(res => res.json()).then(data => {

            /*
            Given is that data.relativeProgress.togo is the amount of xp togo for the next level
            Given is that data.relativeProgress.earned is the amount of xp earned for the current level
            Given is that data.relativeProgress.needed is the amount of xp needed for the relative level

            Calculate the percentage past for this level
             */
            const percentage = (data.relativeProgress.earned / data.relativeProgress.needed) * 100;
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
            const originalEmbed = new EmbedBuilder()
                .setTimestamp()
                .setTitle(`${config.guild.shorthand} - ${user.username}`)
                .setColor(config.colors.default)
                .setThumbnail(user.avatarURL())
                .addFields(
                    {
                        name: "Gebruikersnaam",
                        value: `${user.username}#${user.discriminator}`,
                        inline: true
                    },
                    {
                        name: "Naam",
                        value: guild.members.cache.get(userID).nickname,
                        inline: true
                    },
                    {
                        name: "ID",
                        value: user.id,
                        inline: true
                    },
                    {
                        name: `\u200B \n ${bar}  ${percentageShort} %`,
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "Level",
                        value: `${data.progress.level}`,
                        inline: true
                    },
                    {
                        name: "Experience",
                        value: `(${data.relativeProgress.earned}/${data.relativeProgress.needed})`,
                        inline: true
                    },
                    {
                        name: "Needed",
                        value: `${data.relativeProgress.togo}`,
                        inline: true
                    },
                    {
                        name: "\u200B",
                        value: "\u200B",
                        inline: false
                    },
                    {
                        name: "Messages",
                        value: data.activity.messages.toString(),
                        inline: true
                    },
                    {
                        name: "Minutes",
                        value: data.activity.minutes.toString(),
                        inline: true
                    }
                );
            interaction.reply({embeds: [originalEmbed]});
        });
}

export { data, execute };