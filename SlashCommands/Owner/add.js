const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'اضافة',
  description: 'لإضافة بروجكت جديد.',
  options: [
    { name: 'إسم_البروجكت', description: 'قم بكتابة إسم البروجكت الذي تريد إضافته.', type: 3, required: true },
    { name: 'سعر-البروجكت', description: 'قم بإدخال سعر البروجكت الذي تريد إضافته.', type: 3, required: true },
    { name: 'رابط-البروجكت', description: 'قم بإدخال رابط البروجكت الذي تريد إضافته.', type: 3, required: true }
  ],
  
  async execute(client, interaction) {

    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const productName = interaction.options.getString('إسم_البروجكت');
    const productPrice = interaction.options.getString('سعر-البروجكت');
    const productLink = interaction.options.getString('رابط-البروجكت');

    if(isNaN(productPrice)) return interaction.reply({ content: `**قم إدخال سعر البروجكت بطريقة صحيحة.**`, ephemeral:true });

    db.push(`Products`, {
      productName: productName,
      productPrice: productPrice,
      productLink: productLink
    });

    interaction.reply({ content: `**تم إضافة البروجكت بنجاح**` });
    
  }
}