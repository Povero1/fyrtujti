const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'ازالة',
  description: 'لازالة البروجكت الموجود.',
  options: [
    { name: 'إسم_البروجكت', description: 'قم بكتابة إسم البروجكت الذي تريد إزالته.', type: 3, required: true }
  ],
  
  async execute(client, interaction) {

    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const productName = interaction.options.getString('إسم_البروجكت');

    const products = await db.get(`Products`);

    const productToRemove = products.find(product => product.productName === productName);

    if (!productToRemove) return interaction.reply({ content: `**البروجكت غير موجود.**`, ephemeral: true });

    db.set(`Products`, products.filter(product => product.productName !== productName));

    interaction.reply({ content: `**تم إزالة البروجكت بنجاح**` });
    
  }
}