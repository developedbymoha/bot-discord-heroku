module.exports = (client, error, message, ...args) => {
    switch (error) {
        case 'NotPlaying':
            message.channel.send(`${client.emotes.error} - Aucune musique n'est jouée sur ce serveur !`);
            break;
        case 'NotConnected':
            message.channel.send(`${client.emotes.error} - Vous n'êtes connecté à aucun salon vocal !`);
            break;
        case 'UnableToJoin':
            message.channel.send(`${client.emotes.error} - Je ne peux pas rejoindre votre salon vocal, veuillez vérifier mes permissions !`);
            break;
        case 'VideoUnavailable':
            message.channel.send(`${client.emotes.error} - ${args[0].title} n'est pas disponible dans votre pays ! Je passe à l'autre...`);
            break;
        case 'MusicStarting':
            message.channel.send(`La musique commence... veuillez attendre et réessayer !`);
            break;
        default:
            message.channel.send(`${client.emotes.error} - Quelque chose s'est mal passé ... Erreur : ${error}`);
    };
};
