import stopPhishing from "stop-discord-phishing";

/**
 * Global default message scan / check
 *
 * @param {string} message
 * @returns {Promise<boolean>}
 */
async function checkMessage (message) {
    //check string on confirmed Phishing Domains
    const isGrabber = await stopPhishing.checkMessage(message);
    //Now you can do something with the Boolean Value
    return isGrabber;
}

/**
 * @param {string} message
 * @returns {Promise<boolean>}
 */
async function checkMessageFull (message) {
    //check string on confirmed & not yet confirmed but suspicious Phishing Domains
    const isGrabber = await stopPhishing.checkMessage(message);
    //Now you can do something with the Boolean Value
    return isGrabber;
}

export { checkMessage, checkMessageFull };