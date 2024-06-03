const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'حظر',
  description: 'إضافة شخص إلى قائمة الأشخاص المحظورين من استخدام أمر الشراء.',
  options: [
    {
      name: 'الشخص',
      description: 'الشخص الذي تريد إضافته إلى قائمة المحظورين.',
      type: 6, 
      required: true
    }
  ],
  async execute(client, interaction) {
    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });
    
    const userToAdd = interaction.options.get('الشخص').user;

    await db.push('BannedUsers', userToAdd.id);

    interaction.reply({ content: `**تمت إضافة  <@${userToAdd.id}> إلى قائمة المحظورين.**`, ephemeral: true });
  }
};