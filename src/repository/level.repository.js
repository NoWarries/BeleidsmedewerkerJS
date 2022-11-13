import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class levelRepository {
    static async findAll() {
        const levels = prisma.levels.findMany({});
        return levels;
    }

    static async findByLevel(level) {
        const levels = prisma.levels.findUnique({
            where: {
                level: parseInt(level),
            }
        });
        return levels;
    }
}