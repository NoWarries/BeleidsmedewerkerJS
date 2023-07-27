import { SlashCommandBuilder } from "@discordjs/builders";
import VoteRepository from "../../repository/vote.repository.js";
import { ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder } from "discord.js";
import { updateVote } from "../../handlers/database.js";
import { guild } from "../../../config/common.js";

function removeReactions(message) {
    message.reactions.cache.get(guild.emoji.upvote).remove();
    message.reactions.cache.get(guild.emoji.downvote).remove();
}

let data = new SlashCommandBuilder()
    .setName("vote-close") 
    .setDescription("Close a council vote")
    .addStringOption(option => 
        option
            .setName("id")
            .setDescription("The ID of the vote to close")
            .setRequired(true)
            .setAutocomplete(true))
    .addStringOption(option =>
        option
            .setName("action")
            .setDescription("Specify the action to take on the vote")
            .setRequired(false)
            .addChoices(
                { name: "Democratic", value: "Democratic" },
                { name: "Cancelled", value: "cancelled" },
                { name: "Adopted", value: "adopted" },
            )
    )
    .addStringOption(option =>
        option.setName("reason")
            .setDescription("Optional elaboration on the vote result")
            .setRequired(false)
    )
    .addIntegerOption(option =>
        option.setName("percentage")
            .setDescription("The percentage of votes required to pass the vote")
            .setRequired(false)
            .setMaxValue(100)
            .setMinValue(0)
    );

// add autocomplete for vote id
async function autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    const choices = await VoteRepository.findAllByStatus("Pending").then(res => {
        return res.map(vote => vote.id);
    });

    console.log(choices);

    const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    console.log(filtered);


    await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
    );
}

async function execute(interaction) {   
    const percentage = interaction.options.getInteger("percentage") || 51;

    VoteRepository.findById(interaction.options.getString("id")).then(res => {
        // Check if vote exists
        if(res == null) {
            const embed = new EmbedBuilder()
                .setTitle("Vote not found")
                .setDescription("The vote with the ID ``" + interaction.options.getString("id") + "`` was not found")
                .setColor("#ff0000");

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } 
        // Check if vote is editable
        else if(res.status != "Pending") {
            const embed = new EmbedBuilder()
                .setTitle("Vote not editable")
                .setDescription("The vote with the ID ``" + interaction.options.getString("id") + "`` is not editable")
                .setColor("#ff0000");

            interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        } else {
        
            // get the channel
            const channel = interaction.guild.channels.cache.get(res.channelId);

            const resultEmbed = new EmbedBuilder();

            channel.messages.fetch(res.messageId).then(vote => {
                const embed = vote.embeds[0];

                // get reactions
                const up = vote.reactions.cache.find((reaction) => reaction.emoji.id === guild.emoji.upvote).count - 1;
                const down = vote.reactions.cache.find((reaction) => reaction.emoji.id === guild.emoji.downvote).count - 1;


                const total = up + down;
                const ratio = up + " / " + down;

                const score = up / total * 100 + " / " +  down / total * 100;
            
                resultEmbed.setTitle("Vote information");
                resultEmbed.setDescription("Vote id: " + interaction.options.getString("id"));

                const action = interaction.options.getString("action") || "Democratic";
                const reason = interaction.options.getString("reason") || "No reason provided";     

                resultEmbed.addFields(
                    {
                        name: "Motion",
                        value: embed.fields[0].value,
                        inline: false
                    },
                    {
                        name: "Action",
                        value: "```" + action + "```",
                        inline: true
                    },
                    {
                        name: "Percentage",
                        value: "```" + percentage + "```",
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: "```" + reason + "```",
                        inline: false
                    },
                    {
                        name: "Score",
                        value: "```" + score + "```",
                        inline: true
                    },
                    {
                        name: "Ratio",
                        value: "```" + ratio + "```",
                        inline: true
                    },
                    {
                        name: "Total votes",
                        value: "```" + total + "```",
                        inline: true
                    },
                );
  

                const confirm = new ButtonBuilder()
                    .setCustomId("vote-close-confirm")
                    .setLabel("Proceed")
                    .setStyle(ButtonStyle.Success);

                const cancel = new ButtonBuilder()
                    .setCustomId("vote-close-cancel")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Secondary);

                const row = new ActionRowBuilder()
                    .addComponents(cancel, confirm);      

                resultEmbed.setTimestamp();
                interaction.reply({
                    embeds: [resultEmbed],
                    components: [row],
                    ephemeral: true
                });

                const filter = (btnInt) => {
                    return btnInt.user.id === interaction.user.id;
                };

                const collector = interaction.channel.createMessageComponentCollector({
                    filter,
                    max: 1,
                });

                collector.on("end", (collection) => {
                    if (collection.first().customId === "vote-close-confirm") {
                        // disable buttons
                        
                        const paperTrail = new EmbedBuilder();
                        paperTrail.setTimestamp();
                        paperTrail.setFooter({
                            text: embed.footer.text,
                            iconUrl: embed.footer.iconUrl
                        });
                        paperTrail.addFields(
                            {
                                name: "\u200B",
                                value: `**Motion and Vote** \n${embed.fields[0].value}`,
                                inline: false
                            },
                        );
                        paperTrail.setDescription("**Vote has been resolved ** \n " + embed.description);
                        switch(action) {
                        case "cancelled":
                            paperTrail.setTitle("Cancelled by administrator");
                            vote.react("🗑️");
                            break;
                        case "adopted":
                            paperTrail.setTitle("Adopted by administrator");
                            vote.react("⏩");
                            break;
                        default:
                            paperTrail.setDescription("**Vote has been resolved ** \n " + embed.description + " \n  \n" + up / total * 100 + "% / " + down / total * 100 + "% (" + ratio + ")");
                            if (up / total * 100 >= percentage) {
                                paperTrail.setTitle("Adopted");
                                paperTrail.setColor("#77dd77");
                                vote.react("✅");
                            } else {
                                paperTrail.setTitle("Rejected");
                                paperTrail.setColor("#ff6961");
                                vote.react("🛑");
                            }
                            break;
                        }

                        // add reason
                        if(reason != "No reason provided") {
                            paperTrail.addFields(
                                {
                                    name: "Reason",
                                    value: "```" + reason + "```",
                                    inline: false
                                },
                            );
                        }

                        // get channel by id
                        const resChannel = interaction.guild.channels.cache.get(guild.channels.voteResults);
                        // send embed
                        resChannel.send({embeds: [paperTrail]});
                        updateVote(
                            interaction.options.getString("id"),
                            paperTrail.data.title,
                            up,
                            down,
                            interaction.user.id,
                            reason,
                        );
                        removeReactions(vote);        
                        interaction.deleteReply();
                    }
                    else if (collection.first().customId === "vote-close-cancel") {
                        // delete resultEmbed
                        interaction.deleteReply();
                    }
                });
            });

        } 

    });
    
}


export { data, execute, autocomplete };
