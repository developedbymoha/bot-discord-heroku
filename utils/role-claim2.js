// THIS IS THE ROLE OF THE VERIFIED MEMBER
// EXEMPLE : THE NAME OF THE ADDED EMOJI IS "verified" & THE ROLE NAME IS : "| Membres."

const { Client, MessageReaction, MessageEmbed } = require('discord.js');
const firstMessage = require('./first-message');

const emojis = {
    verified: "| Membres."
}

/**
 * 
 * @param {MessageReaction} reaction 
 * @param {*} user 
 * @param {*} add 
 */
const handleReaction = (reaction, user, add) => {
    const emoji = reaction.emoji.name;
    const { guild } = reaction.message;

    const roleName = emojis[emoji];

    if (!roleName) {
        return;
    }

    const role = guild.roles.cache.find(role => role.name === roleName);

    if (!role) {
        return;
    }

    const member = guild.members.cache.find(member => member.id === user.id);

    if (add) {
        member.roles.add(role);
    } else {
        member.roles.remove(role);
    }
}

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    const channel = client.channels.cache.find((channel) => channel.id == '969244840590209114');
    const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName);

    const reactions = [];
    
    const message = new MessageEmbed()
            .setTitle("__**Règlement Discord :**__")
            .setColor("BLACK")
            .setDescription("<:Fruit11:969558524982067220> __**Voici le règlement officiel du serveur Discord Communautaire. Merci de le lire et de le respecter dès votre arrivée sous peine d'être lourdement sanctionné.**__ <:Fruit11:969558524982067220>\n\n"
                + "<:Fruit1:969556641408233492> __**PAS D'INSULTES**__- **Tout message inapproprié sera supprimé et l'auteur sera banni.** <:Fruit1:969556641408233492>\n\n"
                + "<:Fruit5:969556669027741776> __**PAS D'INFOS PERSO**__- **L'envoi de nombreux messages (identiques ou non) en peu de temps est interdit.** <:Fruit5:969556669027741776>\n\n"
                + "<:Fruit6:969556682986360852> __**PAS DE SPAM**__- **L'envoi de nombreux messages (identiques ou non) en peu de temps est interdit.** <:Fruit6:969556682986360852>\n\n"
                + "<:Fruit7:969556711809622067> __**PAS D'HORS SALON**__- **Chaque salon a un rôle spécifique qui se doit d'être respecté. Fais attention de ne pas te tromper !** <:Fruit7:969556711809622067>\n\n"
                + "<:fruit272xp:969556648760848384> __**PAS DE PUB N'IMPORTE OÙ**__- **Il existe un salon <#969557528629350420> où vous avez le droit de faire de la promotion pour votre chaîne Youtube, Twitch. La pub est autorisée uniquement dans ce salon (et pas ailleurs) !** <:fruit272xp:969556648760848384>\n\n"
                + "<:Fruit9:969558513640681492> __**PAS DE PSEUDO/PHOTO DE PROFIL INNAPROPRIÉE**__- **Les pseudos Discord et les photos de profil à caractère sexuel, insultant, provoquant ou rabaissant ne sont pas les bienvenus ici.** <:Fruit9:969558513640681492>\n\n"
                + "<:Fruit10:969558501036802048> __**Nous ne gérons pas non plus les problèmes entre membres qui ont lieu en dehors du serveur (sur Fortnite en chat vocal ou en message privé).**__ <:Fruit10:969558501036802048>\n\n"
                + "<:Fruit872:969559348248469564> __**Merci d'avoir lu ces quelques règles, nous espérons que tu apprécieras ton expérience chez nous !**__ <:Fruit872:969559348248469564>\n\n"
                + "<:Fruit12:969559863384494131> __**L'équipe de Modération !**__ <:Fruit12:969559863384494131>\n\n"
            );

    for (const key in emojis) {
        const emoji = getEmoji(key);
        if (emoji) {
            reactions.push(emoji);
            message;
        }
    }

    firstMessage(channel, message, reactions);

    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === channel.id) {
            handleReaction(reaction, user, true);
        }
    });

    client.on('messageReactionRemove', (reaction, user) => {
        if (reaction.message.channel.id === channel.id) {
            handleReaction(reaction, user, false);
        }
    });
}