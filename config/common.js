import ip from "ip";

/** Common configuration file
 *  Should always be aproached as `config
 *
 *  Suggested import 
 *  import * as config from "../../config/common.js";
 */

var guild = {

    // Name of the application/server
    "name": "Beleidsmederwerker",
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
        // ID of the channel where the bot will post the level up message
        "levelup": "561916667236581377",
        // ID of the channel where the bot will post welcome messages
        "welcome": "561916667236581377",
        // ID of the channel where the bot will post leave messages
        "leave": "561916667236581377",

    }
    
};

class Api {
    constructor(port) {
        this.url = `http://${ip.address()}`,
        this.port =  port,
        this.endpoint = `${this.url}:${this.port}/v1`
    }
}
const api = new Api(28883);

var xp = {
    
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

var colors = {
    /*
    Main colors to use in embed
    */

    // Default color of the bot
    "default": "#ff6961"
};

export {
    colors,
    guild,
    api,
    xp
};

