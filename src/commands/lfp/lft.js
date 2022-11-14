import { SlashCommandBuilder } from "@discordjs/builders";
import {loadSubcommands} from "../../handlers/loader/subcommands.js";

let data = new SlashCommandBuilder()
    .setName("lfp")
    .setDescription("Looking For People")
    .addSubcommandGroup((group) =>
        group
            .setName("game")
            .setDescription("Looking For Team (LFT) request")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("siege")
                    .setDescription("looking for siege team")
                    .addIntegerOption(option =>
                        option.setName("players")
                            .setDescription("Define the amount of players to look for")
                            .setMinValue(1)
                            .setMaxValue(10)
                    )
            )
    );

const execute = async (interaction) => {
    await loadSubcommands(interaction);
};

export { data, execute };
