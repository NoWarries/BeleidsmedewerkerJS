import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default class levelRepository {
    static async findAll() {
        return prisma.levels.findMany({});
    }

    static async findByLevel(level) {
        return prisma.levels.findUnique({
            where: {
                level: parseInt(level),
            }
        });
    }
}