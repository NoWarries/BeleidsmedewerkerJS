import ip from "ip";

/** Common configuration file
 *  Should always be aproached as `config
 *
 *  Suggested import
 *  import * as config from "../../config/common.js";
 */


// const bot = {
//     "name": "Beleidsmederwerker",
// };

const guild = {

    // Name of the guild
    "name": "Verenigd Havistisch Genootschap",
    // Shorthand to display
    "shorthand": "VHG",
    // Guild ID
    "id": "561636178181357572",

    /*
    Guild channels references
    config.guild.channels.x
     */
    channels : {

        // ID of general notifcation channel
        "general": "561916667236581377",
        // ID of testing channel
        "testing": "833380699314454558",
        // ID of the channel where the bot will post the level up message
        "levelup": "561916667236581377",
        // ID of the channel where the bot will post welcome messages
        "welcome": "561916667236581377",
        // ID of the channel where the bot will post leave messages
        "leave": "561916667236581377",

        // ID of the channel where the bot will post vote results
        "voteResults": "827525708791152700",
    },
    /*
    Role channels references
    config.guild.roles.x
     */
    roles : {
        "siege": "909758912763428874",
    },
    /*
    Emoji references
    config.guild.emoji.x
    */
    emoji : {
        "upvote": "819303307033444363",
        "downvote": "819304367806087189",
    }
};

class Api {
    constructor(port) {
        this.root = "/v1",
        this.url = `http://${ip.address()}`,
        this.port =  port,
        this.endpoint = `${this.url}:${this.port}${this.root}`;
    }
}
const api = new Api(28883);

const xp = {

    // xp to give out on message
    "message": {
        "min" : 1,
        "max" : 4
    },
    // xp to give out on minute in vc
    "minute": {
        "min" : 2,
        "max" : 3
    }

};

const colors = {
    /*
    Main colors to use in embed
    */

    // Default color of the bot
    "default": "#ff6961",
    // Color for level up message
    "levelup": "#9fff7a"

};

// Defines various variables for moderation actions
const moderation = {
    // time in seconds to timeout a user for sending a phising link
    "phisingLink": 120,
};

export {
    colors,
    guild,
    api,
    xp,
    moderation
};

