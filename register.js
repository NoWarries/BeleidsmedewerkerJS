import "dotenv/config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { extractFilesRecursively } from "./src/handlers/reader.js";

const registerCommands = async () => {
    const commands = [];
    const commandFiles = await extractFilesRecursively("./src/commands");

    for (const file of commandFiles) {
        const { data } = await import(`./${file}`);
        console.log(`[ ✍️  ] Registering : ${file}`);
        commands.push(data.toJSON());
    }

    return commands;
};

const registerCommandsInDiscord = async () => {
    const commands = await registerCommands();

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log("✔️  => Commands registered");
    } catch (error) {
        console.error(error);
    }
};

registerCommandsInDiscord();
