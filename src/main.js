import "dotenv/config";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";

const client = new Client(
    { intents: 
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates
        ] 
    });

/**
 * Event handlers
 * Handles loading in event and listening to their occurrences
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
        console.log(`[ 🎫 ] ${events.length} Event(s) loaded successfully`);
        console.table(events);
    })();
} catch (err) {
    console.log(`[❌] Something went terrible : ${err.message}`);
}

/**
 * Load in cogs
 * Import / Execute on javascript execution
 */
const gears = fs.readdirSync("./src/cogs").filter((file) => file.endsWith(".js"));
for (let gear of gears) {
    console.log(`[ ⚙️ ] Preparing ${gear}`);
    import(`./cogs/${gear}`);
}
console.log(`[ ⚙️ ] ${gears.length} Gear(s) loaded successfully`);
console.table(gears);

/**
 * Command handlers
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
    console.log(`[ 🤖 ] ${commandFiles.length} Command(s) loaded successfully`);
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

