import express from "express";
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

import statusRouter from "../api/routes/status.routes.js";
import levelRouter from "../api/routes/level.routes.js";
import userRouter from "../api/routes/user.router.js";

app.use(config.api.root + "/status", statusRouter);
app.use(config.api.root + "/level", levelRouter);
app.use(config.api.root + "/user", userRouter);