import { PrismaClient } from "@prisma/client";
import levelRepository from "./level.repository.js";
const prisma = new PrismaClient();

function compute(user, levels) {
    const computed = {
        ...user,
        relativeProgress: {
            // relative xp to next level (current)
            togo : levels[user.progress.level].xp - user.progress.xp || 0,
            // relative xp earned for this level (current)
            earned : user.progress.xp - levels[user.progress.level-1].xp || 0,
            // relative xp earned this level (current)
            needed : levels[user.progress.level].xp - levels[user.progress.level-1].xp || 0,
            // total xp needed for next level
            total : levels[user.progress.level].xp || 0,
        }
    };
    return computed;
}

export default class userRepository {
    static async findByID(userID) {
        const user = prisma.user.findUnique({
            where: {
                id: userID,
            },
            include: {
                activity: true,
                progress: true,
            }
        });
        return compute(
            await user,
            await levelRepository.findAll()
        );
    }
    static async findAll() {
        const users = prisma.user.findMany({
            include: {
                activity: true,
                progress: true,
            }
        });
        const levels = await levelRepository.findAll();
        return (await users).map(user => compute(user, levels));
    }
}