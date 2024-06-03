const {Client, Message, EmbedBuilder,} = require('discord.js');
module.exports = {
    name: 'بنج',
    description: 'لرويه بنق البوت',

    /**
     * @param {Client} client 
     * @param {interaction} interaction
     */
    async execute(client, interaction) {
        const _1 = `\``;
        const _P = `Bot Ping :`;
        const _R =  _1 + client.ws.ping + `ms` + _1 ;
        const _A = `Api Latency :`;
        const _RR = _1 + client.ws.ping + `ms` + _1;
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        const _U = `Uptime :`;
        const _RRR = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        const ping = new EmbedBuilder()
        .setAuthor({ name : client.user.username , iconURL : client.user.displayAvatarURL()})
        .setDescription(`**${_P} ${_R}\n${_A} ${_RR}\n${_U} ${_RRR}**`)
        .setFooter({ text : interaction.user.username , iconURL : interaction.user.displayAvatarURL()})
        .setThumbnail(interaction.guild.iconURL())
        .setColor('#000000');
        interaction.reply({embeds: [ping]})      
    
    },
};