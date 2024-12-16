require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const expressHandler = require('./handlers/expressHandler');
const checkMessages = require('./handlers/checkPendingMessages');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Event-Handler initialisieren
eventHandler(client);

// Express-Server starten
expressHandler(client);





client.login(process.env.TOKEN);


client.once('ready', () => {
    console.log(`Bot ist bereit und eingeloggt als ${client.user.tag}`);

    setInterval(() => checkMessages(client), 60 * 1000);
});