import "dotenv/config";
import { ShardingManager } from "discord.js";

// eslint-disable-next-line no-undef
const manager = new ShardingManager("./src/main.js", { token: process.env.TOKEN });
manager.on("shardCreate", shard => console.log(`[ 💎 ] Launched shard ${shard.id}`));

manager.spawn();
