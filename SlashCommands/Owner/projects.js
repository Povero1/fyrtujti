const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'بروجكتات',
  description: 'عرض جميع البروجكتات مع أسمائهم وأسعارهم وروابطهم.',
  async execute(client, interaction) {
    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });

    const products = await db.get(`Products`);
    if (!products || products.length === 0) {
      return interaction.reply({ content: `**لا توجد بيانات متاحة حالياً.**`, ephemeral: true });
    } else {
      let response = '**بروجكتات متاحة:**\n';
      products.forEach(product => {
        response += `- **الاسم :${product.productName}** \n- **السعر :${product.productPrice}** \n- **الرابط :**${product.productLink}\n------------------\n`;
      });
      return interaction.reply({ content: response, ephemeral: true });
    }
  }
}