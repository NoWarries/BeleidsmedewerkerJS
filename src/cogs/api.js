import express from "express";
import * as db from "../handlers/database.js";
import * as config from "../../config/common.js";

const app = express();
// Add headers to api requests
app.use((req, res, next) => {
    res.header("Acess-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Content-Type", "Application/json");
    res.header("X-Frame-Options", "SAMEORIGIN");
    res.header("Referrer-Policy", "origin");
    res.header("Permissions-Policy", "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), window-placement=(), vertical-scroll=()");
    next();
});

const port = config.api.port;

app.listen(port, () => {
    console.log(`[ 🔧 ] API listening to port : ${port}`);
});

// status endpoint to check status of api
app.get(config.api.root + "/status", async (req, res) => {
    try {
        const {client} = await import("../main.js");
        if (client.uptime > 0) {
            res.sendStatus(202);
        } else {
            res.sendStatus(500);
        }
    } catch (e) {
        res.sendStatus(503);
    }
});

app.get(config.api.root + "/xptable", (req, res) => {
    db.getLevelTable().then(dataTable => { 
        res.json(dataTable);
    });
});

app.get(config.api.root + "/user/:userID", (req, res) => {
    db.getUser(req.params.userID).then(data => {
        db.getLevelTable().then(dataTable => { 

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
});