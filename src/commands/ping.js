import { SlashCommandBuilder } from "@discordjs/builders";

let data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send a ping to the bot");

function execute(interaction) {
    interaction.channel.send("pong");
}


export { data, execute };
