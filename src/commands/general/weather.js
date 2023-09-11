import {SlashCommandBuilder} from "@discordjs/builders";
import weatherEmbed from "../../handlers/embeds/weatherEmbed.js";

let data = new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Retrieves the weather for today/now")
    // Ad ephemeral toggle
    .addBooleanOption(option => option.setName("ephemeral").setDescription("Only show the message to you").setRequired(false));

const execute = async (interaction) => {
    // get ephemeral option
    const ephemeralToggle = interaction.options.getBoolean("ephemeral") || false;

    // TODO: In the future allow users to specify a location
    weatherEmbed(process.env.OPENWEATHERMAP_LAT, process.env.OPENWEATHERMAP_LON).then(embed => {
        interaction.reply({ embeds: [embed], ephemeral: ephemeralToggle });
    }).catch(error => {
        console.error(error);
        interaction.reply({ content: "Something went wrong while fetching the weather", ephemeral: ephemeralToggle });
    });
};

export {data, execute};