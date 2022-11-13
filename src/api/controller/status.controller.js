async function get(req, res) {
    try {
        const {client} = await import("../../main.js");
        if (client.uptime > 0) {
            res.sendStatus(202);
        } else {
            res.sendStatus(500);
        }
    } catch (e) {
        res.sendStatus(503);
    }
}

export {
    get
};