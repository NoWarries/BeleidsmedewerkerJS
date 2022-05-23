import "dotenv/config";
import { Client, Intents } from "discord.js";
import fs from "fs";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Load in events
const events = fs.readdirSync("./src/events").filter((file) => file.endsWith(".js"));
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

// Load in gears
const gears = fs.readdirSync("./src/gears").filter((file) => file.endsWith(".js"));

for (let gear of gears) {
    let gearFile = await import(`./gears/${gear}`);
    console.log(gearFile);
}


// eslint-disable-next-line no-undef
client.login(process.env.TOKEN);

export {
    client
};

