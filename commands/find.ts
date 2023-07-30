import { CommandInteraction, MessageReaction, User, Message } from "discord.js";
import axios from "axios";

const resultsMap = new Map<string, { title: string; artist: string; id:string}[]>();

async function getSamples(id: string) {
  const res = await axios.get(
    `https://rangi.beatbotanica.com/api/samples?id=${id}`
  );
  return JSON.stringify(res.data);
}

async function getSearchResults(query: string) {
  const res = await axios.get(
    `https://rangi.beatbotanica.com/api/search?q=${query}&num=4`
  );
  return res.data;
}

async function handleReactionAdd(reaction: MessageReaction, user: User, message: Message) {
  if (user.bot) return;

  let reactionIndex = 0;

  if (reaction.message.content.startsWith("Showing results for ")) {
    if (reaction.emoji.name === "1️⃣") {
      reactionIndex = 0;
    } else if (reaction.emoji.name === "2️⃣") {
      reactionIndex = 1;
    } else if (reaction.emoji.name === "3️⃣") {
      reactionIndex = 2;
    } else if (reaction.emoji.name === "4️⃣") {
      reactionIndex = 3;
    }
    const results = resultsMap.get(message.interaction.id);
    const result = results[reactionIndex];
    const samples = await getSamples(result.id);
    const reply = await reaction.message.reply(`Loading samples for ${result.title}...`);

    // Prepare the formatted message content and embeds
    const formattedSamples = JSON.parse(samples);
    if (formattedSamples.length === 0) {
      reply.edit("No samples found.");
      return;
    }
    const embeds = [];

    formattedSamples.forEach((sample) => {
      const sampleContent =
        `  Title: ${sample.title}\n` +
        `  Artist: ${sample.artist}\n` +
        `  Year: ${sample.year}\n`;

      const embed = {
        description: sampleContent,
        image: {
          url: sample.imgUrl,
        },
      };

      embeds.push(embed);
    });

    // Edit the loading message with the formatted samples content and images
    embeds.forEach((embed) => {
      reply.channel.send({ embeds: [embed] });
    });
  }
}


export const doFind = async (interaction: CommandInteraction) => {
  const author = interaction.member?.user;
  const query = interaction.options.get("query")?.value as string;

  if (!author) {
    interaction.reply("Unable to get user information.");
    return;
  }

  if (!query) {
    interaction.reply("Please provide a search query.");
    return;
  }

  try {
    const results = await getSearchResults(query);
    resultsMap.set(interaction.id, results);
    let text = `Showing results for ${query}\n`;

    results.forEach((result: { title: string; artist: string }, index: number) => {
      text += `${index + 1}: ${result.title} by ${result.artist}\n`;
    });

    const resultsMessage: Message | undefined = await interaction.reply({
      content: text,
      fetchReply: true,
  });

    if (results.length > 0 && resultsMessage) {
      resultsMessage.react("1️⃣");
      resultsMessage.react("2️⃣");
      resultsMessage.react("3️⃣");
      resultsMessage.react("4️⃣");
    }

    // Set up reaction collector for handling reactions
    const filter = (reaction: MessageReaction, user: User) => {
      return (
        user.id === interaction.user.id &&
        ["1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name)
      );
    };

    const collector = resultsMessage.createReactionCollector({ filter, time: 60000 });

    collector.on("collect", (reaction, user) => {
      handleReactionAdd(reaction, user, resultsMessage);
    });

    collector.on("end", () => {
      // Collector has ended, you can do any cleanup if needed
    });
    
  } catch (err) {
    interaction.reply(
      "Something went wrong. Please make sure to use the following format if you haven't: /find <search query>\n" +
        err.toString()
    );
  }
};
