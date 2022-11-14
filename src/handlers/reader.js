import { promises } from "fs";
import path from "path";

const extractFilesRecursively = async (filePath) => {
    const dir = await promises.readdir(filePath);
    const files = await Promise.all(dir.map(async relativePath => {
        const absolutePath = path.join(filePath, relativePath);
        const stat = await promises.lstat(absolutePath);

        return stat.isDirectory() ? extractFilesRecursively(absolutePath) : absolutePath;
    }));

    return files.flat();
};

export { extractFilesRecursively };