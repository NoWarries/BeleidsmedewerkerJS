import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Ensures the user to interact with has a record to talk to
 *
 * (Child function is only called upon by parents (CRUD))
 *
 * @param {string} id 
 */
async function ensureRecord(id) {
    return await prisma.user.upsert({
        where: { id: id || 0 },
        update: {},
        create: {
            id: id,
            activity: {
                create: {}
            },
            progress: {
                create: {}
            }
        },
    });
}

/**
 * Adds 1 message to the users activity
 * @param {string} id 
 */
async function incrementMessage(id) {
    /* Example usage :

    db.incrementMessage(interaction.author.id)
        .then(res => {
            console.log(res);
        });

    */
    await ensureRecord(id);
    return await prisma.activity.update({
        where: {
            id: id,
        },
        data : {
            messages: {
                increment: 1,
            }
        }
    });
}

/**
 * Increment x xp to the users progress
 * @param {string} id 
 * @param {number} xp
 */
async function addXP(id, xp) {
    /* Example usage :

    db.addXP(interaction.author.id, xp)
        .then(res => {
            console.log(res);
        });

    */
    await ensureRecord(id);
    return await prisma.progress.update({
        where: {
            id: id,
        },
        data : {
            xp: {
                increment: xp,
            }
        }
    });
}

/**
 * Increment x xp to the users progress
 * @param {string} id 
 * @param {number} xp
 */
async function addLevel(id) {
    /* Example usage :

    db.addLevel(interaction.author.id)
        .then(res => {
            console.log(res);
        });

    */
    await ensureRecord(id);
    return await prisma.progress.update({
        where: {
            id: id,
        },
        data : {
            level: {
                increment: 1,
            }
        }
    });
}

/**
 * Adds 1 minute to the users activity
 * @param {string} id 
 */
async function incrementMinute(id) {
    /* Example usage :

    db.incrementMinute(interaction.author.id)
        .then(res => {
            console.log(res);
        });

    */
    await ensureRecord(id);
    return await prisma.activity.update({
        where: {
            id: id,
        },
        data : {
            minutes: {
                increment: 1,
            }
        }
    });
}


/**
 * Get specified table data
 * @param {String} table 
 * @param {string} id 
 */
async function getTable(table, id) {
    return await prisma[table].findUnique({
        where: {
            id: id,
        },
    });
}

/**
 * Get [level = xp] table respectively
 */
async function getLevelTable() {
    return await prisma.levels.findMany();
}

/**
 * Get user object from given id
 * @param {string} id 
 */
async function getUser(id) {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            activity: true,
            progress: true,
        },
    });
}


export { getTable, getUser, incrementMessage, getLevelTable, ensureRecord, incrementMinute, addXP, addLevel };