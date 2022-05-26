import { SlashCommandBuilder } from "@discordjs/builders";
import moment from "moment";
import "moment-duration-format";
import { MessageEmbed } from "discord.js";
import * as config from "../../config/common.js";


let data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send a ping to the bot");

function execute(interaction) {
    import("../main.js").then( client => { 
        (async () => {
            const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            console.log(duration);
            const originalEmbed = new MessageEmbed()
                .setTimestamp()
                .setTitle(`${config.info.shorthand} - Ping`)
                .setColor(config.colors.clrMain)
                .setThumbnail(interaction.guild.iconURL())
                .setDescription("Pinging...");

            const newEmbed = new MessageEmbed()
                .setTimestamp()
                .setTitle(`${config.info.shorthand} - Ping`)
                .setColor(config.colors.clrMain)
                .setThumbnail(interaction.guild.iconURL())
                .addField("⏱️ Ping data", "Time " + Math.round(Date.now() - interaction.createdTimestamp) + "ms \n Heartbeat: " + Math.round(client.ws.ping) + "ms")
                .addField("👁️‍🗨️ Uptime", duration);

            let fulfilledEmbed = await interaction.channel.send({ embeds: [originalEmbed] });
            fulfilledEmbed.edit({ embeds: [newEmbed] });
        })();
    });
}


export { data, execute };
