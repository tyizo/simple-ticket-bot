const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
  disableEveryone: true,
  partials: ["MESSAGE", "USER", "REACTION"],
});
const config = require("./config.json");
const token = config.token;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
client.prefix = config.prefix;
const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("ok tyizo !");
});
server.listen(4000);

["handlers", "events"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.login(token);

client.once("ready", () => {
  const msg = new Discord.MessageEmbed()
    .setThumbnail(
      "https://cdn.discordapp.com/attachments/861287941544476702/863457169545232434/unknown.png"
    )
    .setAuthor(client.user.tag, client.user.avatarURL())
    .setTitle("**Open a Ticket | فتح تذكرة**")
    .setColor("RANDOM")
    .setDescription(
      "If you want to open a ticket click the 📩 reaction \n اذا كنت تريد فتح تذكره اضغط على 📩 و انتظر الرد"
    );
  const channel = client.channels.cache.find(
    (channel) => channel.name === "𝐓icket︳المساعده"
  );
  channel.send({ embed: msg }).then((rec) => {
    rec.react("📩");
  });
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (reaction.emoji.name === "📩") {
    reaction.users.remove(reaction.message.author.id);

    if (
      reaction.message.guild.channels.cache.find(
        (channel) => channel.name === `ticket-${reaction.message.author.id}`
      )
    ) {
      reaction.message.channel
        .send(
          "You already have a ticket, please close your exsisting ticket first before opening a new one!"
        )
        .then((msg) => msg.delete({ timeout: 2000 }));
    }

    reaction.message.guild.channels
      .create(`ticket-${reaction.message.author.id}`, {
        permissionOverwrites: [
          {
            id: reaction.message.author.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: reaction.message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
        type: "text",
      })
      .then((channel) => {
        const embed = new Discord.MessageEmbed()
          .setThumbnail(
            "https://cdn.discordapp.com/attachments/861287941544476702/863468803018063882/5-128.png"
          )
          .setColor("RANDOM")
          .setDescription(
            "**تم فتح التكت , اطرح مشكلتك ! \n\n Ticket is oped, what's your problem ?**"
          );
        channel.send(embed);
      });
  }
});
