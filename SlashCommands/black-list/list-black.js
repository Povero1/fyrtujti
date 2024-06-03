const { EmbedBuilder } = require('discord.js');
const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'المحضورين',
  description: 'عرض منشن لجميع الأشخاص المحظورين من استخدام أمر الشراء.',
  async execute(client, interaction) {
    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const bannedUsers = await db.get('BannedUsers') || [];
    const bannedUsersMentions = bannedUsers.map(userId => `<@${userId}>`);

    if (bannedUsersMentions.length === 0) {
      return interaction.reply({ content: '**لا يوجد أي شخص محظور حالياً.**', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('قائمة الأشخاص المحظورين')
      .setDescription(bannedUsersMentions.join('\n'))
      .setColor('#000000');

    interaction.reply({ embeds: [embed]});
  }
};