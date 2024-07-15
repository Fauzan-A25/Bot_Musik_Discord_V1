const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("bot akan keluar ke discordmu"),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        .setColor(`DarkBlue`)
        .setDescription(`Done Leaves, Thanks for using this bot`)
        client.distube.voices.leave(interaction)
        interaction.reply({ embeds : [embed]})
    }
  }