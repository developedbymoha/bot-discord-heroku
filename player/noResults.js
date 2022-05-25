module.exports = (client, message, query) => {
    message.channel.send(`${client.emotes.error} - Aucuns résultats trouvés sur YouTube pour ${query} !`);
};