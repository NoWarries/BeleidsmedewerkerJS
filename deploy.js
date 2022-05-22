/* eslint-disable no-undef */
import "dotenv/config";
import SftpUpload from "sftp-upload";
var options = {
        host: process.env.SFTP_HOST,
        username:process.env.SFTP_USER,
        port:process.env.SFTP_PORT,
        path: "./",
        remoteDir: "/",
        excludedFolders: ["**/.git", "node_modules", ".idea", ".vscode"],
        exclude: [".gitignore", ".vscode/tasks.json"],
        password: process.env.SFTP_PASSWORD,
        dryRun: false,
    },
    sftp = new SftpUpload(options);

sftp.on("error", function(err) {
    console.log("[ ❌ ] Something went terrible D:<");
    throw err;
})
    .on("uploading", function(progress) {
        console.log("[ 🔨 ] Uploading", progress.file);
        console.log(progress.percent + "% completed");
    })
    .on("completed", function() {
        console.log("Upload Completed");
    })
    .upload();