import {guild} from "../../../config/common.js";

const execute = async (interaction) => {
    if (interaction.member.voice.channel) {
        let channel = interaction.member.voice.channel;
        let friends = [];
        channel.members.forEach( member => {
            friends.push(`<@${member.id}>`);
        });
        let lookingFor = interaction.options.getInteger("players") || 5-friends.length;
        channel.createInvite({
            unique: false,
            maxAge: 3600
        })
            .then(invite => {
                if (lookingFor > 1 && friends.length === 1) {
                    interaction.reply(`${friends.join(" + ")} is looking for 1 to ${lookingFor} people to play siege with! <@&${guild.roles.siege}> => https://discord.gg/` + invite.code);
                } else if (lookingFor === 1) {
                    interaction.reply(`${friends.join(" + ")} are/is looking for a person to play siege with! <@&${guild.roles.siege}> => https://discord.gg/` + invite.code);
                } else {
                    interaction.reply(`${friends.join(" + ")} are looking for 1 to ${lookingFor} people to play siege with! <@&${guild.roles.siege}> => https://discord.gg/` + invite.code);
                }
            });
    } else {
        interaction.reply({
            content: "You must be in a voice-channel to do a LFT/LFP request",
            ephemeral: true
        });
    }
};

export { execute };