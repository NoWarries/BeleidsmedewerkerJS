import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export default class VoteRepository {
    static async findById(id) {
        return prisma.vote.findUnique({
            where: {
                id: id,
            }
        });
    }
}