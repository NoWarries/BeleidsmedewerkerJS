import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";

const commands = [];
const commandFiles = fs.readdirSync("./src/commands/").filter(file => file.endsWith(".js"));
(async () => {
    console.log(commandFiles);
    for (const file of commandFiles) {
        const { data } = await import(`./src/commands/${file}`);
        console.log(`[ ✍️  ] Registering : ${file}`);
        commands.push(data.toJSON());
    }
})().then( () => {
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
    (async () => {
        try {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
                .then(() => console.log("✔️  => Commands registered"))
                .catch(console.error);
        } catch (error) {
            console.error(error);
        }
    })();
});