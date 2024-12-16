const jsonOperations = require('./JSONOperations');

const expressHandler = require('./expressHandler');


let isProcessing = false;

async function checkMessages(client) {

    console.log("nächste runde startet");
    if (isProcessing) return; 
    isProcessing = true;

    try {
        const messages = jsonOperations.getPendingMessages();
        console.log("Anzahl ausstehender Nachrichten:", messages.length);

        for (let message of messages) {
            console.log("Prüfe Nachricht mit Sendezeitpunkt:", message.sendAt);

            if (readyToSend(message)) {
                try {
                    console.log("Nachricht wird gesendet");
                    // Nachricht senden



                    ////Test

                    const channelId = process.env.ALLGEMEIN_CHAT_ID;      
                    const channel = await client.channels.fetch(channelId);
                    message.status = "done";
                    await channel.send(`message: ${message.content} ,  sendAt: ${message.sendAt} ,  status:  ${message.status}`);


                    /////
                    //message.status = "done"; // Status aktualisieren



                } catch (error) {
                    console.error("Fehler beim Senden der Nachricht:", error);
                }
            } else {
                console.log("Nachricht wird nicht gesendet");
            }
        }

        // Aktualisierte Nachrichten zurückschreiben
        await jsonOperations.saveMessages(messages);

        /// test löschen
        //jsonOperations.deleteMessageByStatus("done");
        ////
    } catch (error) {
        console.error("Fehler bei checkMessages:", error);
    } finally {
        isProcessing = false;
    }
}

function readyToSend(message) {
    let now = new Date();
    let messageDate = new Date(message.sendAt);

    let isPastAndPending = messageDate < now && message.status === "pending";

    let isTodayAndNearFuture =
        messageDate.getFullYear() === now.getFullYear() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getDate() === now.getDate() &&
        message.status === "pending" &&
        (messageDate - now <= 60000);

    if (isPastAndPending || isTodayAndNearFuture) {
        message.status = "in work";
        return true;
    }

    return false;
}


module.exports = checkMessages;
// Alle 60 Sekunden ausführen
//setInterval(checkMessages, 60 * 1000);



