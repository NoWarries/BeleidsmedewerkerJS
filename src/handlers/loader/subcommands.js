const loadSubcommands = async function (interaction) {
    try {
        const subCommand = await import(`../../subcommands/${interaction.commandName}/${interaction.options.getSubcommand()}.js`);
        return subCommand.execute(interaction);
    }
    catch(e) {
        console.error(e);
    }
};

export { loadSubcommands };