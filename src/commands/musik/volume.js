const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createPlaySongEmbed } = require("../../utils/song.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Mengubah ke volume yang anda inginkan")
    .addNumberOption((option) =>
      option
        .setName("jumlah")
        .setDescription("Jumlah volume yang ingin Anda ubah. Contoh: 10")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    // Mendapatkan saluran suara pengguna
    const queue = client.distube.getQueue(interaction);
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "Anda harus berada di saluran suara untuk menggunakan perintah ini!"
            ),
        ],
        ephemeral: true,
      });
    }

    // Mendapatkan player dari client manager
    const player = client.distube.getQueue(interaction.guild.id);
    if (!player || !player.playing) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("Tidak ada musik yang sedang diputar."),
        ],
        ephemeral: true,
      });
    }

    const vol = interaction.options.getNumber("jumlah");

    // Memeriksa apakah volume valid
    if (!vol || vol < 1 || vol > 125) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setDescription(
              `:loud_sound: | Volume saat ini **${player.volume}**`
            ),
        ],
        ephemeral: true,
      });
    }

    // Mengatur volume player
    player.setVolume(vol);
    const song = queue.songs[0];
    const { playSongEmbed, row } = createPlaySongEmbed(song, queue, client);
    const oldNotifications = await queue.textChannel.messages.fetch({
      limit: 1,
    });
    oldNotifications.forEach(async (message) => {
      await message.delete().catch(console.error);
    });
    interaction.reply({ embeds: [playSongEmbed], components: [row] });
  },
};
