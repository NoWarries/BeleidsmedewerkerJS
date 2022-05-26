import "dotenv/config";
import { Client, Intents, Collection } from "discord.js";
import fs from "fs";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

/**
 * Event handler
 * Handles loading in event and listening to their occurences 
 */
const events = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
try {
    (async () => {
        for (let event of events) {
            console.log(`[ 🎫 ] Preparing ${event}`);
            const eventFile = await import(`./events/${event}`);
            if (eventFile.once)
                client.once(eventFile.name, (...args) => {
                    eventFile.execute(...args);
                });
            else
                client.on(eventFile.name, (...args) => {
                    eventFile.execute(...args);
                });
        }
        console.log(`[ 🎫 ] ${events.length} Event(s) loaded sucsesfully`);
        console.table(events);
    })();
} catch (err) {
    console.log(`[❌] Something went terrible : ${err.message}`);
}

/**
 * Load in gears
 * Import / Execute on javascript execution
 */
const gears = fs.readdirSync("./src/gears").filter((file) => file.endsWith(".js"));
for (let gear of gears) {
    console.log(`[ ⚙️ ] Preparing ${gear}`);
    import(`./gears/${gear}`);
}
console.log(`[ ⚙️ ] ${gears.length} Gear(s) loaded sucsesfully`);
console.table(gears);

/**
 * Command handler
 * Loads in commands
 */
client.commands = new Collection();
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
(async () => {
    for (const file of commandFiles) {
        console.log(`[ 🤖 ] Preparing ${file}`);
        const command = await import(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    }
    console.log(`[ 🤖 ] ${commandFiles.length} Command(s) loaded sucsesfully`);
    console.table(commandFiles);
})();
client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
});

// eslint-disable-next-line no-undef
client.login(process.env.TOKEN);

export {
    client
};

