const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder ,ButtonBuilder} = require('discord.js');
const db = require('pro.db');

module.exports = {
  name: 'شراء',
  description: `لشراء بروجكت من الموجودين`,
  
  async execute(client, interaction) {
    const bannedUsers = await db.get('BannedUsers') || [];
    if (bannedUsers.includes(interaction.user.id)) {
      return interaction.reply({ content: '**لا يمكنك استخدام هذا الأمر لأنك في القائمة السوداء.**', ephemeral: true });
    }
    const products = await db.get(`Products`);
    if (!products) return interaction.reply({ content: `**لا يوجد أي بروجكت حاليا**` });

    const Embed = new EmbedBuilder()
    .setAuthor({ name : client.user.username , iconURL : client.user.displayAvatarURL()})
      .setDescription(`**لرؤية البروجكتات الموجودة قم بفتح المنيو أسفل الرسالة**`)
      .setFooter({ text : interaction.user.username , iconURL : interaction.user.displayAvatarURL()})
      .setThumbnail(interaction.guild.iconURL())
      .setColor('#000000')
    const Menu = new ActionRowBuilder()
      
    const productOptions = products.map((product, index) => ({
      label: product.productName,
      value: product.productName,
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('buyProduct')
      .setPlaceholder('إضغط هنا لإضهار البروجكتات')
      .addOptions(productOptions);
      
    Menu.addComponents(selectMenu);

    const messageProduct = await interaction.reply({ embeds: [Embed], components: [Menu] });

    const filter = interaction => interaction.isMessageComponent() && interaction.customId === 'buyProduct' && interaction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, maxComponents: 1, time: 60000 });

    collector.on('collect', async (interaction) => {

      if (interaction.customId === 'buyProduct') {

        const selectedProductId = interaction.values[0];

        const foundProducts = db.get(`Products`, { productName: selectedProductId });

        let theProductPrice; let theProductLink;

        if (Array.isArray(foundProducts) && foundProducts.length > 0) {
          const selectedProduct = foundProducts.find(product => product.productName === selectedProductId);
          if (selectedProduct) {
            theProductPrice = selectedProduct.productPrice;
            theProductLink = selectedProduct.productLink;
          }
        }
      
        const productPrice = parseFloat(theProductPrice);
        const productPrice_Total = Math.floor(productPrice * (20 / 19) + 1);

        const BankId = await db.get(`BankId`);
        const ProBotId = await db.get(`ProBotId`);

        await messageProduct.edit({ content: `**يجب عليك التحويل ف اسرع وقت**\n \`\`\`#credit ${BankId} ${productPrice_Total} \`\`\``, embeds:[], components: [] });
        const filter = (m) => m.author.bot && m.author.id == `${ProBotId}` && m.content.includes(":moneybag:") && m.content.split("$").slice(-1)[0].split("`")[0] == `${productPrice}` && m.mentions.members.first().id == `${BankId}`;
        await interaction.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] }).then(async (collected) => {

          interaction.user.send({ content: `**البروجكت : ${theProductLink} **` }).then(async m => {
            await messageProduct.edit({ content: `**تم إرسال البروجكت إلى خاصك بنجاح**`, embeds:[], components:[] })
            
          }).catch(async err => {
            return await messageProduct.edit({ content: `** خاصك مقفل لم أستطع إرسال البروجكت قم بالتواصل مع أحد الأونرز للحصول على البروجكت**`, embeds:[], components:[] })
          });

        }).catch(async () => {
          await messageProduct.edit({ content: `**تم إلغاء العملية**`, embeds:[], components:[] })          
        });

      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        await messageProduct.edit({ content: `**تم إلغاء العملية**`, embeds:[], components:[] });
      }
    });

  }
}