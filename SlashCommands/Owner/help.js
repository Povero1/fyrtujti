const { EmbedBuilder, Message , StringSelectMenuBuilder , StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
  /**
     * @param {Client} client 
     * @param {interaction} interaction
     */
module.exports = {
  name: 'هيلب',
  description: 'عرض اوامر البوت',
  async execute(client, interaction) {
     const embed = new EmbedBuilder()
      .setAuthor({ name : client.user.username , iconURL : client.user.displayAvatarURL()})
      .setDescription('اختر من القائمة التالية القسم المناسب')
      .setFooter({ text : 'تم تطويره من قبل : General Progs' , iconURL : interaction.user.displayAvatarURL()})
      .setThumbnail(interaction.guild.iconURL())
      .setColor('#000000');

      const select = new StringSelectMenuBuilder()
			.setCustomId('helpSelect')
			.setPlaceholder('اختر القسم المناسب')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('عام')
					.setValue('helpGeneral'),
        new StringSelectMenuOptionBuilder()
					.setLabel('ادمن')
					.setValue('helpAdmin'),
				new StringSelectMenuOptionBuilder()
					.setLabel('اونر')
					.setValue('helpOwner'),
			);

    const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('الدعم الفني').setStyle(ButtonStyle.Link).setURL('https://discord.gg/g-p'))
		const row2 = new ActionRowBuilder().addComponents(select);
    await interaction.reply({ embeds: [embed] , components : [row2 , row1]});
  }
};