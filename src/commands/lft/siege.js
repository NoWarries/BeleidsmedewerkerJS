import { SlashCommandBuilder } from "@discordjs/builders";

let data = new SlashCommandBuilder()
    .setName("siege")
    .setDescription("Siege LFT aanvraag");

async function execute(interaction) {
    if (interaction.member.voice.channel) {
        let channel = interaction.member.voice.channel;
        let friends = [];
        channel.members.forEach( member => {
            friends.push(`<@${member.id}>`);
        });
        channel.createInvite({
            unique: false,
            maxAge: 3600
        })
            .then(invite => {
                if (friends.length == 1) {
                    interaction.reply(`${friends.join(" + ")} zoekt een of meerderen kameraden voor een goed potje <@&909758912763428874> => https://discord.gg/` + invite.code);
                } else if (friends.length == 4) {
                    interaction.reply(`${friends.join(" + ")} zijn zoekende naar een kameraad voor een goed potje <@&909758912763428874> => https://discord.gg/` + invite.code);
                } else {
                    interaction.reply(`${friends.join(" + ")} zijn zoekende naar een of meerderen kameraden voor een goed potje <@&909758912763428874> => https://discord.gg/` + invite.code);
                }
            });
    } else {
        interaction.reply({
            content: "Je moet in een voice-kanaal zitten om een LFT aanvraag te doen",
            ephemeral: true
        });
    }
}


export { data, execute };
