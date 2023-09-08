import goodMorning from "../../cogs/morningRoutine.js";
import {SlashCommandBuilder} from "@discordjs/builders";

let data = new SlashCommandBuilder()
    .setName("goodmorning")
    .setDescription("Says good morning to you");

const execute = async (interaction) => {
    // import morningRoutine
    try {
        await goodMorning(interaction.channel.id);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
    await interaction.reply({ content: ":white_check_mark:", ephemeral: true });
    // wait 5 seconds
    await new Promise(r => setTimeout(r, 5000));
    await interaction.deleteReply();
};

export {data, execute};