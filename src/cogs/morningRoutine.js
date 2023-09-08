import fetch from "node-fetch";
import cron from "node-cron";
import morning_hi_messages from "../lib/morningRoutine/morning_hi_messages.js";

const task = cron.schedule("0 9 * * *", () => {
    goodMorning("561638595748823040");
}, {
    timezone: "Europe/Paris" // Europe since we're in europe (duh)
});

// Start the task
task.start();

// Functionality
async function goodMorning(channelID = "561638595748823040") {
    // import client
    const { client } = await import("../main.js");

    // Prepare date and time
    const date = new Date();
    const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    // fetch weather openweathermap
    const weather_url = `https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly&lat=${process.env.OPENWEATHERMAP_LAT}&lon=${process.env.OPENWEATHERMAP_LON}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}&lang=nl`;
    console.log(`[${time}] Fetching weather from ${weather_url}`);
    const weather = await fetch(weather_url).then(response => response.json());
    const maxTemp = weather.daily[0].temp.max;

    // Start message chain

    // Start with a random hi message
    await client.channels.cache.get(channelID).send(morning_hi_messages[Math.floor(Math.random() * morning_hi_messages.length)]);


    // send weather embed based on openweathermap api 2.5
    const weatherEmbed = {
        color: 0x0099ff,
        title: "Weerbericht",
        description: "Het weerbericht voor vandaag :sun_with_face:",
        thumbnail: {
            url: "https://openweathermap.org/img/w/" + weather.daily[0].weather[0].icon + ".png",
        },
        fields: [
            {
                name: "\u200b",
                value: `Het is momenteel ${weather.current.temp}°C en ${weather.current.weather[0].description} \n 
                Over het algemeen wordt het vandaag ${weather.daily[0].weather[0].description} met een maximum temperatuur van ${maxTemp}°C`,
            },
            {
                name: "Maximale temperatuur",
                value: `\`${maxTemp}°C\``,
                inline: true
            },
            {
                name: "Minimale temperatuur",
                value: `\`${weather.daily[0].temp.min}°C\``,
                inline: true
            },
            {
                name: "Vanavond",
                value: `\`${weather.daily[0].temp.night}°C\``,
                inline: true
            }
        ],
        timestamp: new Date(),
    };

    await client.channels.cache.get(channelID).send({ embeds: [weatherEmbed] });

}

export default goodMorning;