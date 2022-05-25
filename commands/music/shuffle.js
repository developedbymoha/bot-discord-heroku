module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    category: 'Music',
    utilisation: '{prefix}shuffle',

    execute(client, message) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans un salon vocal !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans le même salon vocal !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aucune musique n'est diffusée actuellement !`);

        const success = client.player.shuffle(message);

        if (success) message.channel.send(`${client.emotes.success} - **${client.player.getQueue(message).tracks.length}** musique(s) dans la file d'attente mélangée !`);
    },
};