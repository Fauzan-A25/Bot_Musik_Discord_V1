const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("akan menghapus query lagu mu"),
    async execute(interaction, client) {
        const memberVC = interaction.member.voice.channel;
        
        let embed = new EmbedBuilder()
            .setDescription(` | You must be in a voice channel!`)
            .setColor('#FF0000'); // Optional: Menambahkan warna untuk embed
        if (!memberVC) return interaction.reply({ embeds: [embed] });

        const clientVC = interaction.guild.members.me.voice.channel;
        embed = new EmbedBuilder()
            .setDescription(` | I'm not on any voice channel!`)
            .setColor('#FF0000');
        if (!clientVC) return interaction.reply({ embeds: [embed] });

        embed = new EmbedBuilder()
            .setDescription(` | You must be in the same channel as ${interaction.client.user}!`)
            .setColor('#FF0000');
        if (memberVC !== clientVC) return interaction.reply({ embeds: [embed] });

        const queue = interaction.client.distube.getQueue(interaction);
        embed = new EmbedBuilder()
            .setDescription(` | There is no music playing!`)
            .setColor('#FF0000');
        if (!queue) return interaction.reply({ embeds: [embed] });

        interaction.client.distube.stop(interaction);

        embed = new EmbedBuilder()
            .setDescription("Queue musik telah dihapus!")
            .setColor('#00FF00'); // Optional: Menambahkan warna untuk embed
        await interaction.reply({ embeds: [embed] });

        const oldNotifications = await queue.textChannel.messages.fetch({ limit: 2 });
        oldNotifications.forEach(async (message) => {
            await message.delete().catch(console.error);
        });
    }
}
