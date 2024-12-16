module.exports = {
    name: 'test', // Der Name des Befehls, der mit /test aufgerufen wird
    description: 'Antwortet mit Halli Hallo!', // Eine kurze Beschreibung des Befehls
    callback: (client, interaction) => {
      interaction.reply('Halli Hallo!');
    },
  };
  