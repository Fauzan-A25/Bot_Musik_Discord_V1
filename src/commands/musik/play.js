const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Memutar musik")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Isi dengan nama lagu atau URL yang ingin diputar")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();
    const args = interaction.options.getString("query");
    const memberVC = interaction.member.voice.channel;

    // Embed untuk member tidak ada di voice channel
    let embed = new EmbedBuilder()
      .setDescription(
        `🚫 | Anda harus berada di voice channel untuk memutar musik!`
      )
      .setColor("Red");

    if (!memberVC) {
      return interaction.editReply({ embeds: [embed] });
    }

    // Embed jika bot sudah ada di voice channel lain
    embed = new EmbedBuilder()
      .setDescription(
        `🚫 | Anda harus berada di channel yang sama dengan bot untuk memutar musik!`
      )
      .setColor("Red");

    const clientVC = interaction.guild.members.me.voice.channel;
    if (clientVC && clientVC !== memberVC) {
      return interaction.editReply({ embeds: [embed] });
    }

    // Fungsi untuk mencoba memutar musik hingga maksimal 2 kali
    const maxRetries = 2; // Batas maksimal pengulangan
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
      attempt++;
      try {
        await client.distube.play(memberVC, args, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
        });

        // Embed saat musik mulai diputar
        embed = new EmbedBuilder()
          .setDescription(`🎶 | Sedang memutar: **${args}**`)
          .setColor("Green");

        await interaction.editReply({ embeds: [embed] });
        success = true; // Berhenti jika berhasil memutar lagu
      } catch (error) {
        console.error(`Percobaan ${attempt} gagal:`, error);

        // Jika lagu tidak ditemukan pada percobaan pertama, coba sekali lagi
        if (error.errorCode === "CANNOT_RESOLVE_SONG") {
          if (attempt === maxRetries) {
            // Jika sudah mencoba 2 kali dan tetap gagal, kirim pesan kesalahan
            embed = new EmbedBuilder()
              .setDescription(
                `🚫 | Lagu tidak ditemukan setelah ${maxRetries} kali percobaan. Coba gunakan judul atau URL yang berbeda.`
              )
              .setColor("Red");

            return interaction.editReply({ embeds: [embed] });
          }
        } else {
          // Jika ada error lain, kirim pesan kesalahan
          embed = new EmbedBuilder()
            .setDescription(
              `🚫 | Terjadi kesalahan saat mencoba memutar musik: ${error.message}`
            )
            .setColor("Red");

          return interaction.editReply({ embeds: [embed] });
        }
      }
    }
  },
};
