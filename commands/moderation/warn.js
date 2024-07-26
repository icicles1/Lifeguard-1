const { EmbedBuilder } = require('discord.js');
const Infraction = require('../../schemas/manual-infraction');

const { deleteExpiredInfractions } = require('../../functions/delete-expired-infractions');
const { generateID } = require('../../functions/generate-infraction-ids');

const warning = new Set();

module.exports = {
    name: 'warn',
    description: 'Issues a warning.',
    usage: '>warn [user: User] <...reason: String>',
    examples: ['>warn 792168652563808306 spamming'],
    aliases: ['w'],
    staff: true,
    info: true,
    async execute(message, args, client) {
        const { guild, author, mentions } = message;

        let userId;
        let reason;

        if (!args.length) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You must provide a member to warn.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        userId = mentions.users.first() ? mentions.users.first().id : args[0];
        reason = args.slice(1).join(' ');

        let member;
        try {
            member = await guild.members.fetch(userId);
        } catch (error) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You must provide a valid user ID as the member is not in this server.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        if (member.user.bot) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You cannot warn a bot.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        if (member.id === author.id) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You cannot warn yourself.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        if (member.roles.highest.position > message.member.roles.highest.position) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You cannot warn a higher up.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        if (member.roles.highest.position === message.member.roles.highest.position) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You cannot warn a staff member with the same rank as you.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        if (warning.has(member.id)) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('Whoops! Double warn prevented.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        if (!reason) {
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('You must provide a reason.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        }

        warning.add(member.id);

        try {
            const infractionID = await generateID();
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 5);

            const warn = new Infraction({
                infractionId: infractionID,
                type: 'Warn',
                reason: reason,
                username: member.user.username,
                userId: member.id,
                moderator: author.username,
                moderatorId: author.id,
                issued: new Date(),
                expires: expiration,
            });

            await warn.save();
            await message.delete();

            const embed = new EmbedBuilder()
            .setColor('#fcd44f')
            .setDescription(`<@${member.id}> has been **warned** | \`${infractionID}\``)
            await message.channel.send({ embeds: [embed] });

            let additionalInfo = 'If you believe this punishment was false, you may DM one of the Head Moderators listed in <#1263994813741535242>.';

            const warnEmbed = new EmbedBuilder()
            .setColor('#fcd44f')
            .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL()}` })
            .setTitle(`You've been warned in ${guild.name}`)
            .addFields(
                { name: 'Reason', value: `${reason}` },
                { name: 'Additional Information', value: `${additionalInfo}` },
                { name: 'Expires', value: '4 weeks 2 days' }
            )
            .setFooter({ text: `Infraction ID: ${infractionID}` })
            .setTimestamp()
            await member.send({ embeds: [warnEmbed] }).catch((error) => {
                console.error(`Failed to send this message to ${member.user.username}: ${error}`);
            });
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
            .setColor('#eb4034')
            .setDescription('Failed to process this warn. You may try again in a few minutes.')
            const msg = await message.channel.send({ embeds: [embed] });
            setTimeout(() => {
                 message.delete();
                msg.delete();
            }, 2000);

            return;
        } finally {
            warning.delete(member.id);
        }
    },
};

(async () => {
    setInterval(async () => {
        await deleteExpiredInfractions();
    }, 60000); // Run every minute
})();