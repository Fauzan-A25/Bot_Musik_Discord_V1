const { SlashCommandBuilder } = require ('@discordjs/builders');

module.exports = {
    data : new SlashCommandBuilder ()
    .setName('ping')
    .setDescription('Testing'),
    async execute(interaction) {
        await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
    },
};