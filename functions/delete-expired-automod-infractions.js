const { now } = require('mongoose');
const Infraction = require('../schemas/automod-infraction');

async function deleteExpiredAutomodInfractions() {
    try {
        const expiredInfraction = await Infraction.find({ expires: { $lte: now } });

        for (const infraction of expiredInfraction) {
            await Infraction.findByIdAndDelete(infraction._id);
            console.log(`Deleted an expired infraction with ID: ${infraction.infractionId}.`);
        }
    } catch (error) {
        console.error(`An error occurred while checking and deleting expired infractions: ${error}`);
    }
}

module.exports = { deleteExpiredAutomodInfractions };