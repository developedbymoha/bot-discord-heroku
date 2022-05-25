module.exports = (client, message, track) => {
    message.channel.send(`${client.emotes.music} - **${track.title}** est en cours de lecture sur ${message.member.voice.channel.name}`);
};