const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'تسطيب',
  description: 'لتحديد حساب البنك و البروبوت',
  options: [
    { name: 'الحساب', description: 'قم بإختيار حساب البنك أو قم بوضع أيدي الحساب.', type: 6, required: true },
    { name: 'البروبوت', description: 'قم بوضع أيدي البروبوت.', type: 6, required: true }
  ],
  
  async execute(client, interaction) {

    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const BankId = interaction.options.getMember('الحساب');
    const ProBotId = interaction.options.getMember('البروبوت');

    db.set(`BankId`, BankId.id);
    db.set(`ProBotId`, ProBotId.id);

    interaction.reply({ content: `**تم تحديد حساب التحويل و البروبوت بنجاح**` });
    
  }
}