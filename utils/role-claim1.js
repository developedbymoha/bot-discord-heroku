// THIS IS THE SECTION AUTO ROLE (ALL THE ROLES THAT MEMBERS CAN ASSIGN TO THEMSELVES)

const { Client, MessageReaction, MessageAttachment, MessageEmbed } = require('discord.js');
const firstMessage = require('./first-message');

const emojis = {
    name_of_the_added_emoji: "role_name",
    name_of_the_added_emoji: "role_name"
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
    const channel = client.channels.cache.find((channel) => channel.id == 'RENAME WITH YOUR CHANNEL ID');
    const getEmoji = emojiName => client.emojis.cache.find((emoji) => emoji.name === emojiName);

    const reactions = [];
    
    const message = new MessageEmbed()
            .setTitle("__**Choisis tes rôles !**__")
            .setColor("BLACK")
            .setDescription("__**Cliques sur une des réactions ci-dessous pour obtenir le rôle correspondant**__\n\n"
                + "__**Les rôles :**__\n\n"
                + "**<:homme:969718730772861010> : <@&969627341804437595>**\n"
                + "**<:femme:969718730160496661> : <@&969627413355061279>**\n"
                + "**<:majeur:969718740482670602> : <@&969627510826475580>**\n"
                + "**<:mineur:969718737789939812> : <@&969627541738496021>**\n\n"
                + "**<:amongus:969714049485000704> : <@&969668015643832370>**\n"
                + "**<:apexlegends:969713998918455296> : <@&969269835303383050>**\n"
                + "**<:clashofclans:969714054417489930> : <@&969629425454960740>**\n"
                + "**<:clashroyale:969714054195183647> : <@&969270206176309370>**\n"
                + "**<:cod:969714017541177374> : <@&969668574979440671>**\n"
                + "**<:fifa:969714009546846218> : <@&969668324487217172>**\n"
                + "**<:fortnite:969714025426472970> : <@&969269735952887849>**\n"
                + "**<:genshin:969714010515718224> : <@&969270072210243645>**\n"
                + "**<:gtarp:969714011056787546> : <@&969628906720202794>**\n"
                + "**<:hearthstone:969714831512993803> : <@&969270153583919194>**\n"
                + "**<:lol:969714072314581042> : <@&969629049955713074>**\n"
                + "**<:minecraft:969714066123792496> : <@&969629102074134538>**\n"
                + "**<:r6:969714055881314305> : <@&969668732295196713>**\n"
                + "**<:valorant:969714013766311966> : <@&969269987468525629>**\n"
                + "**<:wow:969714075602911282> : <@&969269911631327293>**\n\n"
            )
            .setImage('https://i.imgur.com/kt66fKA.png');

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