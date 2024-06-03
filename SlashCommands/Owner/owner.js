const { Owner } = require('../../config.json');
const db = require('pro.db');

module.exports = {
  name: 'أونر',
  description: 'لإضافة أونر جديد لقائمة الأونرز.',
  options: [{ name: 'الأونر', description: 'قم بتحديد الأونر', type: 6, required: true }],
  
  async execute(client, interaction) {

    if (!Owner.includes(interaction.user.id)) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const newOwner = interaction.options.getMember('الأونر');

    await db.push(`Owners`, newOwner.id);
    await interaction.reply({ content: `**✅ تم إضافة ${newOwner} إلى قائمة الأونرز بنجاح!**` });
    
  }
}