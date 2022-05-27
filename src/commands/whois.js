import { SlashCommandBuilder } from "@discordjs/builders";
import * as config from "../../config/common.js";
import { MessageEmbed } from "discord.js";
import ip from "ip";
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
    const { ensureRecord } = await import("../handler/database.js");
    const { client } = await import("../main.js");


    const user = interaction.options.getUser("user") || interaction.user;
    const userID = user.id;

    await ensureRecord(userID);
    
    fetch("http://"+ip.address()+":"+config.api.port+"/v1/user/"+userID).then(res => res.json()).then(data => { 

        const guild = client.guilds.cache.get(config.info.id);
        const originalEmbed = new MessageEmbed()
            .setTimestamp()
            .setTitle(`${config.info.shorthand} - ${user.username}`)
            .setColor(config.colors.clrMain)
            .setThumbnail(user.avatarURL())
        
            .addField("Gebruikersnaam", `${user.username}#${user.discriminator}`, true)
            .addField("Naam", guild.members.cache.get(userID).nickname, true)
            .addField("ID", user.id, true)

            .addField("Level", `${data.progress.level}`, true)
            .addField("Experience", `(${data.progress.xp})`, true)
            .addField("Needed", `${data.progress.togo}`, true)


            .addField("Messages :", data.activity.messages.toString(), true)
            .addField("Minutes  :", data.activity.minutes.toString(), true);

        interaction.reply({ embeds: [originalEmbed] });
    });
}

export { data, execute };