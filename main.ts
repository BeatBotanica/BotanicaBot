// =============================================================
// || Discord Bot Template for TypeScript                     ||
// =============================================================
// || AUTHOR: Harley Welsby, https://github.com/harleywelsby  ||
// =============================================================

import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import config from "./config/config.json" assert { type: "json" };
import {
  CommandRegisterLocation,
  ErrorFailedToCreateBot,
  LoggedInMessage,
  RefreshingSlashCommandsMessage,
} from "./constants/const.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - False positive fr this code works idk why it's complaining
import getRandomLyric, { RandomLyric } from "bb_random_lyrics";

export const bot: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
});
const commands: string[] = [];

// Load commands into Discord.js from ./commands
import(CommandRegisterLocation).then((slashCommandBuilders) => {
  Object.keys(slashCommandBuilders).forEach((key) => {
    commands.push(slashCommandBuilders[key].toJSON());
  });

  // Refresh slash commands on startup
  const rest = new REST({ version: "10" }).setToken(config.Token);
  (async () => {
    try {
      console.log(RefreshingSlashCommandsMessage);

      await rest.put(Routes.applicationCommands(config.ClientId), {
        body: commands,
      });
    } catch (error) {
      console.error(error);
    }
  })();

  // Function to set the random lyric as the bot's activity
  const setRandomLyricAsActivity = () => {
    const randomLyric: RandomLyric = getRandomLyric();
    const activityMessage = `🎵 ${randomLyric.lyric} 🎵`;

    if (bot.user) {
      bot.user.setActivity(activityMessage, { type: ActivityType.Listening });
    }
  };

  // Login
  bot.on(Events.ClientReady, () => {
    console.log(LoggedInMessage);

    if (!bot.user) {
      console.error(ErrorFailedToCreateBot);
    }

    // Custom activity - displays in the members side bar in the server
    setRandomLyricAsActivity();

    setInterval(() => {
      setRandomLyricAsActivity();
    }, 600000); // Update activity every 10 minutes
  });

  bot.login(config.Token);
});
