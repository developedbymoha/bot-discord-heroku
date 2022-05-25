module.exports = (client, message, query, tracks) => {
    message.channel.send(`${client.emotes.error} - Vous n'avez pas fourni de réponse valable... S'il vous plaît envoyez la commande à nouveau !`);
};