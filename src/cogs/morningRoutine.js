import cron from "node-cron";
import morning_hi_messages from "../lib/morningRoutine/morning_hi_messages.js";
import weatherEmbed from "../handlers/embeds/weatherEmbed.js";
import _ from "lodash";
import e from "express";

// import client
const { client } = await import("../main.js");

const task = cron.schedule("0 9 * * *", () => {
    goodMorning("561638595748823040");
}, {
    timezone: "Europe/Paris" // Europe since we're in europe (duh)
});

// Start the task
task.start();

// Functionality
async function goodMorning(channelID = "561638595748823040") {

    // Prepare date and time
    const date = new Date();
    const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    await client.channels.cache.get(channelID).send(morning_hi_messages[Math.floor(Math.random() * morning_hi_messages.length)]);
    
    // Send weather embed
    weatherEmbed(process.env.OPENWEATHERMAP_LAT, process.env.OPENWEATHERMAP_LON).then(embed => {
        client.channels.cache.get(channelID).send({ embeds: [embed] });
    });
}

export default goodMorning;