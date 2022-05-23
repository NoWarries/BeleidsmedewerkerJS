import express from "express";
import * as db from "../handler/database.js";

const app = express();
const port = 28883;

app.listen(port, () => {
    console.log(`[ 🔧 ] API listening to port : ${port}`);
});

app.get("/", (req, res) => {
    res.send("root");
});

app.get("/user/:userID", (req, res) => {
    db.getUser(req.params.userID).then(data => {
        if (data != null) {
            res.json(data);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
});