/* eslint-disable no-undef */

import path from "path";
import "dotenv/config";

import SFTPClient from "ssh2-sftp-client";

/*
*  => Define files/folders you wish to send to production
*/

// Folders to upload
const folders = ["src", "prisma"];
// Files to upload
const files = ["index.js", "package.json"];

// Configuration connection (SFTP)
const config = {
    host: process.env.SFTP_HOST,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASSWORD,
    port: process.env.SFTP_PORT
};

async function syncFolder(client, dir) {
    const src = path.join(dir);
    const dst = "/";
    try {
        await client.connect(config);
        client.on("upload", info => {
            console.log(`[📁] Uploading : ${info.source}`);
        });
        let rslt = await client.uploadDir(src, dst+dir);
        return rslt;
    } catch (err) {
        console.error(err);
    } finally {
        client.end();
    }
}
async function syncFile(client, file) {
    try {
        await client.connect(config);
        client.on("upload", info => {
            console.log(`[📁] Uploading : ${info.source}`);
        });
        let rslt = await client.fastPut("./"+file, "./"+file);
        return rslt;
    } catch (err) {
        console.error(err);
    } finally {
        client.end();
    }
}


folders.forEach(folder => {
    const client = new SFTPClient("Upload folder to remote");
    syncFolder(client, folder)
        .then(msg => {
            console.log(`✔️  => ${msg}`);
        })
        .catch(err => {
            console.log(`[❌] Something went terrible : ${err.message}`);
        });
});


files.forEach(file => {
    const client = new SFTPClient;
    syncFile(client, file)
        .then(msg => {
            console.log(`✔️  => ${msg}`);
        })
        .catch(err => {
            console.log(`[❌] Something went terrible : ${err.message}`);
        });
});