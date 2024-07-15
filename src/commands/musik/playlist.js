const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("memilih playlist yg ada")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("silahkan pilih playlist yg disediakan")
                .addChoices(
                    {name: 'Fauzan Playlist',value: 'https://www.youtube.com/playlist?list=PLNgdpFisZkJKmWoIFOnqOroFIU4XsAA5N'},
                    {name: 'ardo playlis',value: 'https://www.youtube.com/playlist?list=PLmR6YT9bZuRYRAVXk25AGQeMJF1qupmuB'}
                )
                .setRequired(true),
        ),
    async execute(interaction, client) {
        await interaction.deferReply();
        const args = interaction.options.getString('mode')
        const memberVC = interaction.member.voice.channel;
        let embed = new EmbedBuilder()
        .setDescription(` | You must be in a voice channel!`)
        if (!memberVC) return interaction.reply({ embeds : [embed] });

        const clientVC = interaction.guild.members.me.voice.channel;
        embed = new EmbedBuilder()
        .setDescription(` | You must be in the same channel as!`)
        if (clientVC && clientVC !== memberVC) return interaction.reply({ embeds : [embed] })
        try{
        await client.distube.play(memberVC, args, {
            member: interaction.member,
            textChannel: interaction.channel
        });
        embed = new EmbedBuilder()
        .setDescription("Request Accepted")
        .setColor(`Green`)
        return interaction.editReply({ embeds : [embed] })
    } catch (error) {
        console.log(error)
    }
    }
}