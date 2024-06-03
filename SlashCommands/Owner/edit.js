const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const db = require('pro.db');
const { Owner } = require('../../config.json');

module.exports = {
  name: 'تعديل',
  description: 'لعمل تعديل على البروجكت ما',
  
  async execute(client, interaction) {

    const Owners = await db.get(`Owners`) || [];

    if (!Owner.includes(interaction.user.id) && (!Array.isArray(Owners) || !Owners.includes(interaction.user.id))) return interaction.reply({ content: `**ليس لديك صلاحية لإستعمال الأمر.**`, ephemeral: true });


    const modal = new ModalBuilder()
		  .setCustomId('updateProduct')
		  .setTitle('تعديل البروجكت');

    const oldProductName = new TextInputBuilder()
		  .setCustomId('oldName') .setLabel('قم بإدخال الإسم القديم للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

	  const newProductName = new TextInputBuilder()
		  .setCustomId('newName') .setLabel('قم بإدخال الإسم الجديد للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

    const newProductPrice = new TextInputBuilder()
		  .setCustomId('newPrice') .setLabel('قم بإدخال السعر الجديد للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

    const newProductLink = new TextInputBuilder()
		  .setCustomId('newLink') .setLabel('قم بإدخال الرابط الجديد للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

    const oldName = new ActionRowBuilder().addComponents(oldProductName);
    const newName = new ActionRowBuilder().addComponents(newProductName);
    const newPrice = new ActionRowBuilder().addComponents(newProductPrice);
    const newLink = new ActionRowBuilder().addComponents(newProductLink);

	  modal.addComponents(oldName, newName, newPrice, newLink);
	  await interaction.showModal(modal);
    
  }
}