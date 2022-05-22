import {client} from "../main.js";

const once = true;
const name = "ready";

async function execute(interaction)
{   
    console.log("[ i ] " + interaction.user.tag + "is met beleid opgestart");

    client.user.setStatus("dnd");
}

export { once, name, execute };