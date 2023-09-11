import { fetchBuilder, MemoryCache } from "node-fetch-cache";
const fetch = fetchBuilder.withCache(new MemoryCache({
    ttl: 120 * 60 * 1000 // 2 hours 
}));
export default async function weatherEmbed(lat, lon) {
    // fetch weather openweathermap
    const weather_url = `https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly&lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}&lang=nl`;
    console.log("Fetching weather from openweathermap");
    const weather = await fetch(weather_url).then(response => response.json());
    const maxTemp = weather.daily[0].temp.max;


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
    
    return weatherEmbed;
}