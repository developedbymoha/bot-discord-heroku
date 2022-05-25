module.exports = {
    name: 'resume',
    aliases: ['r'],
    category: 'Music',
    utilisation: '{prefix}resume',

    execute(client, message) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans un salon vocal !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - Vous n'êtes pas dans le même salon vocal !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - Aucune musique n'est diffusée actuellement !`);

        if (!client.player.getQueue(message).paused) return message.channel.send(`${client.emotes.error} - La musique est déjà en marche !`);

        const success = client.player.resume(message);

        if (success) message.channel.send(`${client.emotes.success} - **${client.player.getQueue(message).playing.title}** vient de reprendre !`);
    },
};