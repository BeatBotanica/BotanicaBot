import { CommandInteraction } from "discord.js";

// Function to call when command is entered in Discord
export const doExampleCommand = (interaction: CommandInteraction) => {
  const author = interaction.member.user;
  interaction.reply(`Hello ${author}!`);
};
