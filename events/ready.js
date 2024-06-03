const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {

    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`بيع بروجكتات`, {type:"PLAYING"})
    client.user.setStatus('dnd'); // idle, dnd, online, invisible
  }
};