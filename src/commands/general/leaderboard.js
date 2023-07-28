import {SlashCommandBuilder} from "@discordjs/builders";
import {PrismaClient} from "@prisma/client";
import {EmbedBuilder} from "discord.js";

const prisma = new PrismaClient();

const DISPLAY_LIMIT = 5;

let data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard")
    .addStringOption((option) =>
        option
            .setName("type")
            .setDescription("The type of leaderboard to show")
            .setRequired(false)
            .addChoices(
                {name: "Level", value: "level"},
                {name: "Messages", value: "messages"},
                {name: "Minutes", value: "minutes"},
            )
    )
    .addIntegerOption((option) =>
        option
            .setName("page")
            .setDescription("The page of the leaderboard to show")
            .setMinValue(1)
            .setRequired(false)
    );

async function fetchUserInformation(users, interaction, dataType, page) {
    const userInformationArray = [];

    const fetchUserPromises = users.map(async (user, index) => {
        try {
            const member = await interaction.guild.members.fetch(user.user.id);
            const displayName = member.nickname || member.user.username || "REDACTED";
            userInformationArray[index] = {
                name: `\`#${index + 1 + (DISPLAY_LIMIT * page) - 5}\` ${displayName}`,
                value: `${dataType === "level" ? "Level" : dataType === "messages" ? "Messages" : "Minutes"}: ${user[dataType]}`,
            };
            // If dataType is "level", then show both level and xp
            if (dataType === "level") {
                userInformationArray[index].value += `\nXP: ${user.xp}`;
            }
        } catch (error) {
            userInformationArray[index] = {
                name: `\`#${index + 1 + (DISPLAY_LIMIT * page) - 5}\` ${user.user.id} (User not in server)`,
                value: `${dataType === "level" ? "Level" : "XP"}: ${user[dataType]}`,
            };
        }
    });

    await Promise.all(fetchUserPromises);
    return userInformationArray;
}

const execute = async (interaction) => {
    const type = interaction.options.getString("type") || "level";
    const page = interaction.options.getInteger("page") || 1;

    switch (type) {
    case "level":
        const levelUsers = await prisma.progress.findMany({
            take: DISPLAY_LIMIT,
            skip: (page - 1) * DISPLAY_LIMIT,
            orderBy: {
                level: "desc", // Change "xp" to "level"
            },
            include: {
                user: true,
            },
        });

        const levelEmbed = new EmbedBuilder()
            .setTitle("🏆 Level Leaderboard 🏆")
            .setColor("#00ff00")
            .setFooter({
                text: `Page ${page}/${Math.ceil((await prisma.progress.count()) / DISPLAY_LIMIT)}`,
            });

        const userInformationArray = await fetchUserInformation(levelUsers, interaction, "level", page);
        userInformationArray.forEach((userInfo) => {
            levelEmbed.addFields(userInfo);
        });

        await interaction.reply({
            embeds: [levelEmbed],
        });
        break;
    case "messages":
    case "minutes":
        const activityType = type === "messages" ? "messages" : "minutes";
        const activityUsers = await prisma.activity.findMany({
            take: DISPLAY_LIMIT,
            skip: (page - 1) * DISPLAY_LIMIT,
            orderBy: {
                [activityType]: "desc",
            },
            include: {
                user: true,
            },
        });

        const activityEmbed = new EmbedBuilder()
            .setTitle(`🏆 ${type === "messages" ? "Messages" : "Minutes"} Leaderboard 🏆`)
            .setColor("#00ff00")
            .setFooter({
                text: `Page ${page}/${Math.ceil((await prisma.activity.count()) / DISPLAY_LIMIT)}`,
            });

        const activityInformationArray = await fetchUserInformation(activityUsers, interaction, activityType, page);
        activityInformationArray.forEach((activityInfo) => {
            activityEmbed.addFields(activityInfo);
        });

        await interaction.reply({
            embeds: [activityEmbed],
        });
        break;
    default:
        await interaction.reply({
            content: "Invalid type",
            ephemeral: true,
        });
    }
};

export {data, execute};
