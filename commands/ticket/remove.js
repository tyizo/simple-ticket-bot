module.exports = {
  name: "remove",
  run: async (client, message) => {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) return;
    message.channel.delete();
  },
};
