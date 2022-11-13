import userRepository from "../../repository/user.repository.js";

async function get(req, res) {
    userRepository.findAll().then(data => {
        res.json(data);
    });
}

async function getById(req, res) {
    userRepository.findByID(req.params.userID).then(data => {
        if(data === null) {
            res.status(404).json({ error: "User ID invalid" });
        }

        if (data != null) {
            res.json(data);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
}


export {
    get,
    getById
};