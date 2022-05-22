import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Ensures the user to interact with has a record to talk to
 *
 * (Child function is only called upon by parents (CRUD))
 *
 * @param {(string|number)} id 
 */
async function ensureRecord(id) {
    return await prisma.user.upsert({
        where: { id: parseInt(id) || 0 },
        update: {},
        create: {
            id: parseInt(id),
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
 * @param {(string|number)} id 
 */
async function incrementMessage(id) {
    /* Example usage :

    db.incrementMessage(interaction.author.id)
        .then(res => {
            console.log(res);
        });

    */
    await ensureRecord(parseInt(id));
    return await prisma.activity.update({
        where: {
            id: parseInt(id),
        },
        data : {
            messages: {
                increment: 1,
            }
        }
    });
}

/**
 * Get specified table data
 * @param {String} table 
 * @param {(string|number)} id 
 */
async function getTable(table, id) {
    return await prisma[table].findUnique({
        where: {
            id: parseInt(id),
        },
    });
}

/**
 * Get user object from given id
 * @param {(string|number)} id 
 */
async function getUser(id) {
    return await prisma.user.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            activity: true,
            progress: true,
        },
    });
}



export { getTable, getUser, incrementMessage };