module.exports = {
    name: 'debug',
    aliases: ['db'],
    category: 'Infos',
    utilisation: '{prefix}debug',

    execute(client, message) {
        message.channel.send(`${client.emotes.success} - ${client.user.username} connecté sur **${client.voice.connections.size}** salon(s) !`);
    },
};