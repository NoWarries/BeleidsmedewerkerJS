import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import {extractFilesRecursively} from "./src/handlers/reader.js";

const commands = [];
const commandFiles = await extractFilesRecursively("./src/commands");
(async () => {
    for (const file of commandFiles) {
        const { data } = await import(`./${file}`);
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