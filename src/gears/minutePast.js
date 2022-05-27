import * as config from "../../config/common.js";
import { client } from "../main.js";
import * as db from "../handler/database.js";

setInterval(async()=>{
    
    const guild = await client.guilds.fetch(config.info.id);
    const members = guild.members.cache.filter(m => m.voice.channelId != null && m.bot != true);

    members.forEach(member => {
        console.log(`[ 🎤 ] ${member.nickname} found in voice channel ${member.voice.channel.name}`);
        db.incrementMinute(member.id)
            .then(res => {
                console.log(`[ 🎤 ] Minute added ! ${member.nickname} now has ${res.minutes} minutes in vc`);
            });
    });

}, 60 * 1000);
