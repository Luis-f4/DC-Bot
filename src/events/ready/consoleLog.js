module.exports = async (client) => {

    const channel = await client.channels.fetch(process.env.ALLGEMEIN_CHAT_ID);

    //await channel.send('@everyone McBotface ist back!'); 

    console.log(`${client.user.tag} is online`);
};