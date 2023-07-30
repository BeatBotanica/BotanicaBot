import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Events } from "discord.js";
import { UnrecognizedCommandMessage } from "../constants/const.js";
import { bot } from "../main.js";
import { doFind } from "./find.js";

// Functions called by commands

bot.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction as CommandInteraction;

  switch (command.commandName) {
    case "find":
      doFind(command);
      break;
    default:
      command.reply(`${UnrecognizedCommandMessage} ${command.user}`);
  }
});

// Commands

export const exampleCommand = new SlashCommandBuilder()
  .setName("find")
  .setDescription("Find a song that contains samples");
