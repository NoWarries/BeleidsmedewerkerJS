import levelRepository from "../../repository/level.repository.js";

async function get(req, res) {
    res.json(await levelRepository.findAll());
}

async function getByLevel(req, res) {
    res.json(await levelRepository.findByLevel(req.params.level));
}
export {
    get,
    getByLevel
};