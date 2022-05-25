module.exports = {
    name: 'clear-queue',
    aliases: ['cq'],
    category: 'Music',
    utilisation: '{prefix}clear-queue',

    execute(client, message) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans un salon vocal !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans le même salon vocal !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aucune musique n'est joué actuellement !`);

        if (client.player.getQueue(message).tracks.length <= 1) return message.channel.send(`${client.emotes.error} - Il n'y a qu'une seule chanson dans la file d'attente.`);

        client.player.clearQueue(message);

        message.channel.send(`${client.emotes.success} - La file d'attente vient d'être **supprimée** !`);
    },
};