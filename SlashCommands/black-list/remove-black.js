const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name:  'ازاله-حظر',
  description: 'إزالة شخص من قائمة الأشخاص المحظورين من استخدام أمر الشراء.',
  options: [
    {
      name: 'الشخص',
      description: 'الشخص الذي تريد إزالته من قائمة المحظورين.',
      type: 6, 
      required: true
    }
  ],
  async execute(client, interaction) {
    const userToRemove = interaction.options.get('الشخص').user;
    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const bannedUsers = await db.get('BannedUsers') || [];
    const index = bannedUsers.indexOf(userToRemove.id);
    if (index !== -1) {
      bannedUsers.splice(index, 1);
      await db.set('BannedUsers', bannedUsers);
      interaction.reply({ content: `**تمت إزالة <@${userToRemove.id}>من قائمة المحظورين.**`, ephemeral: true });
    } else {
      interaction.reply({ content: `**<@${userToRemove.id}> لم يتم إضافته إلى قائمة المحظورين من قبل.**`, ephemeral: true });
    }
  }
};