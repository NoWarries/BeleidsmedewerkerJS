import "dotenv/config";
import { Client, Intents } from "discord.js";
import fs from "fs";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Load in events
const events = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
try {
    (async () => {
        for (let event of events) {
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
    })();
} catch (err) {
    console.log(`[❌] Something went terrible : ${err.message}`);
}

// Load in gears
const gears = fs.readdirSync("./src/gears").filter((file) => file.endsWith(".js"));

for (let gear of gears) {
    import(`./gears/${gear}`);
}


// eslint-disable-next-line no-undef
client.login(process.env.TOKEN);

export {
    client
};

