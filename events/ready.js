module.exports = async (client) => {
    console.log(`Connecté en tant que ${client.user.tag}`);
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'SET YOUR BOT ACTIVITY',
            type: 'WATCHING'
        }
    });
};