import { getLevelTable } from "../../handlers/database.js";

async function get(req, res) {
    getLevelTable().then(dataTable => {
        res.json(dataTable);
    });
}

export {
    get
};