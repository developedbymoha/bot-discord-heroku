const fs = require('fs');
const discord = require('discord.js')
const roleClaim1 = require('./utils/role-claim1');
const roleClaim2 = require('./utils/role-claim2');
const Enmap = require('enmap');

const client = new discord.Client({ disableMentions: 'everyone' }, {
    allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL'],
    intents: [ 
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MEMBERS,
        discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
  });

client.settings = new Enmap({name: "settings"});

const { Player } = require('discord-player');

client.player = new Player(client);
client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.commands = new discord.Collection();

fs.readdirSync('./commands').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

for (const file of player) {
    console.log(`Loading discord-player event ${file}`);
    const event = require(`./player/${file}`);
    client.player.on(file.split(".")[0], event.bind(null, client));
};

client.on('ready', () => {
    roleClaim1(client);
    roleClaim2(client);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;

    const prefix = client.config.discord.prefix;

    let args = message.content.toLowerCase().split(" ");
    let cmd = args.shift()

    client.settings.ensure(message.guildId, {
        TicketSystem1: {
            channel: "",
            message: "",
            category: "",
        }
    })

    if(cmd == prefix + "close") {
        let TicketUserId = client.settings.findKey(d => d.channelId == message.channelId);

        if(!client.settings.has(TicketUserId)){
            return message.reply({
                content: `:x: Ce channel n'est pas un ticket`
            })
        }
        client.settings.delete(TicketUserId);
        message.reply("Suppression du ticket dans 3 secondes");
        setTimeout(() => {
            message.channel.delete().catch(()=>{});
        }, 3000)
    }
    if(cmd == prefix + "setup") {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]); 
        if(!channel) return message.reply(":x: Merci de ping le channel");

        let TicketEmbed = new discord.MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("🎫 Créer un ticket")
            .setDescription("Sélectionnez ce pour quoi vous avez besoin d'aide")
            .setFooter(message.guild.name, message.guild.iconURL({dynamic: true}));
        
            let Menu = new discord.MessageSelectMenu()
            .setCustomId("FirstTicketOpeningMenu")
            .setPlaceholder("Cliquez sur moi pour ouvrir un ticket")
            .setMaxValues(1) 
            .setMinValues(1)
            .addOptions([ //maximum 25 items
                {
                    label: "Recrutement Esport".substr(0, 25), //maximum 25 Letters long
                    value: "recrutement_esport".substr(0, 25), //maximum 25 Letters long
                    description: "Si vous avez une question...".substr(0, 50), //maximum 50 Letters long
                    emoji: "👌", //optional
                },
                {
                    label: "Recrutement Clan".substr(0, 25), //maximum 25 Letters long
                    value: "recrutement_clan".substr(0, 25), //maximum 25 Letters long
                    description: "If you need help with ordering".substr(0, 50), //maximum 50 Letters long
                    emoji: "👍", //optional
                },
                {
                    label: "Recrutement Staff".substr(0, 25), //maximum 25 Letters long
                    value: "recrutement_staff".substr(0, 25), //maximum 25 Letters long
                    description: "If you need help with ordering".substr(0, 50), //maximum 50 Letters long
                    emoji: "👍", //optional
                }
            ])
        let row = new discord.MessageActionRow().addComponents(Menu);
        
        channel.send({
            embeds: [TicketEmbed],
            components: [row]
        }).then((msg) => {
            client.settings.set(message.guildId, channel.id, "TicketSystem1.channel")
            client.settings.set(message.guildId, msg.id, "TicketSystem1.message")
            client.settings.set(message.guildId, channel.parentId, "TicketSystem1.category")
            return message.reply("👍 **Configuré**");
        }).catch((e) => {
            console.log(e);
            return message.reply("Quelque chose a mal tourné");
        })
    }
})

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isSelectMenu() || !interaction.guildId || interaction.message.author.id != client.user.id) return
    
    client.settings.ensure(interaction.guildId, {
        TicketSystem1: {
            channel: "",
            message: "",
            category: "",
        }
    })

    let data = client.settings.get(interaction.guildId)
    if(!data.TicketSystem1.channel || data.TicketSystem1.channel.length == 0) return

    //right ticket system
    if(interaction.channelId == data.TicketSystem1.channel && interaction.message.id == data.TicketSystem1.message) {        
        switch(interaction.values[0]){
            case "recrutement_esport": {
                let channel = await CreateTicket({
                    OpeningMessage: "Vous venez de créer un ticket recrutement esport...",
                    ClosedMessage: `Ticket de recrutement esport ouvert ici: <#{channelId}>`,
                    embeds: [ new discord.MessageEmbed().setColor("GREEN").setTitle("Comment pouvons-nous vous aider ?").setTimestamp()]
                }).catch(e=>{
                    return console.log(e)
                })
                console.log(channel.name); //work in the channel ... Awaiting message .. application etc.
            } break;
            case "recrutement_clan": {
                let channel = await CreateTicket({
                    OpeningMessage: "Vous venez de créer un ticket recrutement clan...",
                    ClosedMessage: `Ticket de recrutement clan ouvert ici: <#{channelId}>`,
                    embeds: [ new discord.MessageEmbed().setColor("ORANGE").setTitle("Comment pouvons-nous vous aider ?").setTimestamp()]
                }).catch(e=>{
                    return console.log(e)
                })
                console.log(channel.name); //work in the channel ... Awaiting message .. application etc.
            } break;
            case "recrutement_staff": {
                let channel = await CreateTicket({
                    OpeningMessage: "Vous venez de créer un ticket recrutement staff...",
                    ClosedMessage: `Ticket de recrutement staff ouvert ici: <#{channelId}>`,
                    embeds: [ new discord.MessageEmbed().setColor("ORANGE").setTitle("Comment pouvons-nous vous aider ?").setTimestamp()]
                }).catch(e=>{
                    return console.log(e)
                })
                console.log(channel.name); //work in the channel ... Awaiting message .. application etc.
            } break;
        }
        
        async function CreateTicket(ticketdata) {
            return new Promise(async function(resolve, reject) {
                await interaction.reply({
                    ephemeral: true,
                    content: ticketdata.OpeningMessage
                })
                let { guild } = interaction.message;
                let category = guild.channels.cache.get(data.TicketSystem1.category);
                if(!category || category.type != "GUILD_CATEGORY") category = interaction.message.channel.parentId || null; 
                let optionsData = {
                    type: "GUILD_TEXT",
                    topic: `${interaction.user.tag} | ${interaction.user.id}`,
                    permissionOverwrites: [],
                }
                if(client.settings.has(interaction.user.id)){
                    let TicketChannel = guild.channels.cache.get(client.settings.get(interaction.user.id, "channelId"))
                    if(!TicketChannel) {
                        client.settings.delete(interaction.user.id)
                    } else {
                        return interaction.editReply({
                            ephemeral: true,
                            content: `Vous avez déjà un ticket <#${TicketChannel.id}>`
                        })
                    }
                }
                optionsData.permissionOverwrites = [...guild.roles.cache.values()].sort((a, b) => b?.rawPosition - a.rawPosition).map(r => {
                    let Obj = {}
                    if(r.id){
                        Obj.id = r.id;
                        Obj.type = "role";
                        Obj.deny = ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"]
                        Obj.allow = [];
                        return Obj;
                    } else {
                        return false;
                    }
                }).filter(Boolean);
                //Add USER ID Permissions to the TICKET
                optionsData.permissionOverwrites.push({
                    id: interaction.user.id,
                    type: "member",
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS", "ADD_REACTIONS", "ATTACH_FILES"],
                    deny: [],
                })
                //if there are too many, remove the first ones..
                while (optionsData.permissionOverwrites.length >= 99){
                optionsData.permissionOverwrites.shift();
                }
                if(category) optionsData.parent = category;
                guild.channels.create(`ticket-${interaction.user.username.split(" ").join("-")}`.substr(0, 32), optionsData).then(async channel => {
                    await channel.send({
                        content: `<@${interaction.user.id}>`,
                        embeds: ticketdata.embeds
                    }).catch(()=>{});
                    client.settings.set(interaction.user.id, {
                        userId: interaction.user.id,
                        channelId: channel.id,
                    })
                    await interaction.editReply({
                        ephemeral: true,
                        content: ticketdata.ClosedMessage.replace("{channelId}", channel.id)
                    }).catch(()=>{});
                    resolve(channel);
                }).catch((e)=>{
                    reject(e)
                });
            })
            
        }

    } 
})

client.login(client.config.discord.token);