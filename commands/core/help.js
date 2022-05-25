module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'Core',
    utilisation: '{prefix}help <command name>',

    execute(client, message, args) {
        if (!args[0]) {
            const infos = message.client.commands.filter(x => x.category == 'Infos').map((x) => '`' + x.name + '`').join(', ');
            const music = message.client.commands.filter(x => x.category == 'Music').map((x) => '`' + x.name + '`').join(', ');

            message.channel.send({
                embed: {
                    color: 'BLACK',
                    author: { name: 'Commandes' },
                    footer: { text: 'MohaBot' },
                    fields: [
                        { name: 'Bot', value: infos },
                        { name: 'Musique', value: music },
                    ],
                    timestamp: new Date(),
                    description: `Pour utiliser les commandes, il faut faire **${client.config.discord.prefix}** (puis une commande comme ci-dessous).\nExample: **${client.config.discord.prefix}play et la musique en question.**`,
                },
            });
        } else {
            const command = message.client.commands.get(args.join(" ").toLowerCase()) || message.client.commands.find(x => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

            if (!command) return message.channel.send(`${client.emotes.error} - Je n'ai pas trouvé cette commande !`);

            message.channel.send({
                embed: {
                    color: 'BLACK',
                    author: { name: 'Commandes' },
                    footer: { text: 'MohaBot' },
                    fields: [
                        { name: 'Nom', value: command.name, inline: true },
                        { name: 'Catégorie', value: command.category, inline: true },
                        { name: 'Aliase(s)', value: command.aliases.length < 1 ? 'Aucun' : command.aliases.join(', '), inline: true },
                        { name: 'Utilisation', value: command.utilisation.replace('{prefix}', client.config.discord.prefix), inline: true },
                    ],
                    timestamp: new Date(),
                    description: '',
                }
            });
        };
    },
};