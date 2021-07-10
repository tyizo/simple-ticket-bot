const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "vote",
  run: async (client, message, args) => {
    const channel = client.channels.cache.find(
      (channel) => channel.name === "suggest"
    );
    channel.send(message);

    message.delete();
    const suggestion = args.join(" ");
    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .addField("New Suggestion By:", `${message.author}`)
      .addField("Suggestion:", suggestion)
      .setColor("RANDOM");
    await message.channel.send({ embed: embed }).then((embedMessage) => {
      embedMessage.react("✅");
      embedMessage.react("❌");
    });
    if (!args || args.length < 1) {
      message.delete();
    }
  },
};
