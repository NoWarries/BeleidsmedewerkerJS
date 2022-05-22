import "dotenv/config";
import { Client, Intents } from "discord.js";
import fs from "fs";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
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

// eslint-disable-next-line no-undef
client.login(process.env.TOKEN);

export {
    client
};

