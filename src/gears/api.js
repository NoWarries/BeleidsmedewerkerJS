import express from "express";
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`[ 🔧 ] API listening to port : ${port}`);
});

app.get("/", (req, res) => {
    res.send("Prove of concept");
});

