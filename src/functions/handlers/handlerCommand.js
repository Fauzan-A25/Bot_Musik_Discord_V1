const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolder = fs.readdirSync("./src/commands");
        for (const folder of commandFolder) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Commands | Loaded: ${command.data.name}`);
            }
        }
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
                 body: client.commandArray,
            });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    };
};