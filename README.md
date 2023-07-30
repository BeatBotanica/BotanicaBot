# Discord Bot TypeScript Template

A simple TypeScript boilerplate for Discord bots, using <a href="https://discordjs.guide/">Discord.js</a>.

## Set Up a New Bot

* Fork the repository and rename `config/config.example.json` to `config/config.json`. 

* Place your bot token from the <a href="https://discord.com/developers">Discord Developer Portal</a> into `config/config.json`, as well as your bot's Client ID (visible in Discord with Developer Mode switched on).

* Run `npm i`, then start the bot with `npm run start`!

## Add a New Command

* Add the SlashCommandBuilder for your command in `commands/commandRegister.ts`.

* Make a file for your command (see `commands/exampleCommand.ts`) with an exported function to provide command functionality.

* Add a case for the command in the `commands/commandRegister.ts` switch (see lines 15-17). This tells the bot what to do when your command is executed.
