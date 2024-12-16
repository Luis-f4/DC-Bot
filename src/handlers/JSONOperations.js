const fs = require("fs");
const filePath = "./src/handlers/messages.json";



function readMessages() {
    if (!fs.existsSync(filePath)) {
      return { counter: 0, messages: [] };
    }
    
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(data);
  
      
      if (typeof parsedData.counter === "number" && Array.isArray(parsedData.messages)) {
        return parsedData;
      } else {

        return { counter: 0, messages: [] };
      }
    } catch (error) {
      console.error("Fehler beim Lesen der Datei:", error);
      return { counter: 0, messages: [] };
    }
  }


function saveMessage(newMessage) {

  let messagesJSON = readMessages();

  messagesJSON.counter++;
  newMessage.id = messagesJSON.counter;
  messagesJSON.messages.push(newMessage);

  fs.writeFileSync(filePath, JSON.stringify(messagesJSON, null, 2));
 
}



function deleteMessageByStatus(status, ...weitereStati) {
  const messagesJSON = readMessages();

  const validStatuses = [status, ...weitereStati];


  const updatedMessages = messagesJSON.messages.filter(message => validStatuses.includes(message.status));

  
  messagesJSON.messages = updatedMessages;
  fs.writeFileSync(filePath, JSON.stringify(messagesJSON, null, 2));
}

  
/*
// Nachricht nach ID suchen
function getMessageById(id) {
  const messages = readMessages();
  return messages.find(message => message.id === id);
}
*/


function getPendingMessages() {
  const messagesJSON = readMessages();
  return messagesJSON.messages.filter(message => message.status === "pending");
}

function saveMessages(updatedMessages) {

  const messagesJSON = readMessages();
  messagesJSON.messages = updatedMessages;
  fs.writeFileSync(filePath, JSON.stringify(messagesJSON, null, 2));
}

module.exports = {
    readMessages,
    saveMessage,
    deleteMessageByStatus,
    getPendingMessages,
    saveMessages
  };