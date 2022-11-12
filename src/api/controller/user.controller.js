import { getUser, getLevelTable } from "../../handlers/database.js";


async function find(req, res) {
    getUser(req.params.userID).then(data => {
        getLevelTable().then(dataTable => { 

            if(data === null) {
                res.status(404).json({ error: "User ID invalid" });
            }

            // Progress data relative to current level
            data.progress.relative = {
                // relative xp to next level (current)
                togo : dataTable[data.progress.level]["xp"] - data.progress.xp || 0,
                // relative xp earned for this level (current)
                earned : data.progress.xp - dataTable[data.progress.level-1]["xp"] || 0,
                // relative xp earned this level (current)
                needed : dataTable[data.progress.level]["xp"] - dataTable[data.progress.level-1]["xp"] || 0,
                // total xp needed for next level
                total : dataTable[data.progress.level]["xp"] || 0,
            };

            if (data != null) {
                res.json(data);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        });
    });
}

export {
    find
};