/**
 * @param interaction
 * @param reason
 */
function deleteMesasge(interaction) {
    interaction.delete();
}

/** 
 * @param interaction
 * @param {number} time in seconds
 * @param {string} reason reason for timeOut
 */
function timeOut(interaction, time=600, reason="No reason given") {
    const member = interaction.guild.members.cache.get(interaction.author.id);
    if (interaction.member.moderatable) {
        member.timeout(time * 1000, reason);
    } 
}

export { deleteMesasge, timeOut };