const express = require('express');
const bodyParser = require('body-parser');
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');
const test = require('../commands/testordner/test');
const jsonOperations = require('./JSONOperations');


//////////////

const cors = require('cors');

//////////////

module.exports = (client) => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    ////////////////
    app.use(cors()); 
    ////////////////


    app.use(bodyParser.json());

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    app.get('/test', async (req, res) => {

        const newMessage = {
            id: null,
            content: "Test api",
            sendAt: "2024-12-07T12:00:00",
            status: "done"
          };

        jsonOperations.deleteMessageByStatus("pending");
        res.status(200).send('Hi');
    });

    app.get('/testmessage', async (req, res) => {
        const channelId = process.env.ALLGEMEIN_CHAT_ID; 
        const { message, anzahl } = req.body;
    
        try {
            const channel = await client.channels.fetch(channelId);
            if (!channel || !channel.isTextBased()) {
                return res.status(404).send('Channel not found or not a text channel');
            }

            for(let i = 0; i < anzahl; i++){
                await channel.send(message + `     message ${i+1}/${anzahl}`);

                sleep(5000);
            }


            res.status(200).send('Message sent to Discord!');

        } catch (error) {
            console.error('Error sending message to Discord:', error);
            res.status(500).send('Failed to send message to Discord');
        }
    });


    app.post('/apiMessage', async (req, res) => {

        const { id, content, sendAt, status } = req.body;
        const channelId = process.env.ALLGEMEIN_CHAT_ID;      
        const channel = await client.channels.fetch(channelId);


        if(status === "pending"){

            console.log("Zukunft");
            console.log("re body: ", req.body);
            console.log("Zukunft");
            jsonOperations.saveMessage(req.body);
            
        }else{
            await channel.send(`message: ${content} ,  sendAt: ${sendAt} ,  status:  ${status}`);
        }
    });
  


    app.get('/embed', async(req, res) => {
 
        const channel = await client.channels.fetch(process.env.ALLGEMEIN_CHAT_ID);
        const { title, description, color, fields } = req.body;

        const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor(color);

        fields.forEach(field => {
            if (!field.name || !field.value) {
                return res.status(400).send({ error: "Each field must have a name and a value" });
            }
            embed.addFields({ name: field.name, value: field.value, inline: field.inline || false });
        });

        await channel.send({ embeds: [embed] });


        res.status(200).send('Embed wurde gesendet');
       
    });


    

    

    app.listen(PORT, () => {
        console.log(`Express server running on port ${PORT}`);
    });


};

