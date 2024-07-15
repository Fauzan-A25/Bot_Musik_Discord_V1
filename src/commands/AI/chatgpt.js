const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require('openai');
const config = require('./../../config.json'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Ajukan pertanyaan ke AI')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Pertanyaan Anda untuk AI')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        console.log('Kunci API:', config.openai_key);

        const openai = new OpenAI({
            apiKey: config.openai_key 
        });

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'Anda sedang berbicara dengan ChatGPT.',
                    },
                    {
                        role: 'user',
                        content: interaction.options.getString('prompt'), // Mengambil input dari pengguna
                    },
                ],
            });

            await interaction.reply(response.choices[0].message.content); // Mengirim balasan ke Discord
        } catch (error) {
            console.error('OpenAi error:', error); // Debugging: Log kesalahan
            if (error.code === 'insufficient_quota') {
                await interaction.reply('Kuota API OpenAI telah terlampaui. Silakan coba lagi nanti atau hubungi admin bot.');
            } else {
                await interaction.reply('Terjadi kesalahan saat memproses permintaan Anda.');
            }
        }
    }
};
