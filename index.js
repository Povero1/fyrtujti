const { Client, Collection, Partials, GatewayIntentBits , EmbedBuilder } = require('discord.js');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Token, ClientID } = require("./config.json");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)]
});

console.log(`
░██████╗░ ███████╗ ███╗░░██╗ ███████╗ ██████╗░ ░█████╗░ ██╗░░░░░   ██████╗░ ██████╗░ ░█████╗░ ░██████╗░ ░██████╗
██╔════╝░ ██╔════╝ ████╗░██║ ██╔════╝ ██╔══██╗ ██╔══██╗ ██║░░░░░   ██╔══██╗ ██╔══██╗ ██╔══██╗ ██╔════╝░ ██╔════╝
██║░░██╗░ █████╗░░ ██╔██╗██║ █████╗░░ ██████╔╝ ███████║ ██║░░░░░   ██████╔╝ ██████╔╝ ██║░░██║ ██║░░██╗░ ╚█████╗░
██║░░╚██╗ ██╔══╝░░ ██║╚████║ ██╔══╝░░ ██╔══██╗ ██╔══██║ ██║░░░░░   ██╔═══╝░ ██╔══██╗ ██║░░██║ ██║░░╚██╗ ░╚═══██╗
╚██████╔╝ ███████╗ ██║░╚███║ ███████╗ ██║░░██║ ██║░░██║ ███████╗   ██║░░░░░ ██║░░██║ ╚█████╔╝ ╚██████╔╝ ██████╔╝
░╚═════╝░ ╚══════╝ ╚═╝░░╚══╝ ╚══════╝ ╚═╝░░╚═╝ ╚═╝░░╚═╝ ╚══════╝   ╚═╝░░░░░ ╚═╝░░╚═╝ ░╚════╝░ ░╚═════╝░ ╚═════╝░
`);

/* ---------------------------------------- Handling ---------------------------------------- */
client.login(Token);
module.exports = client;
client.commands = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();
['commands', 'events', 'slash'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

/* ---------------------------------------- Register SlashCmd ---------------------------------------- */
const commands = client.slashCommands.map(({ execute, ...data }) => data);
const rest = new REST({ version: '10' }).setToken(Token);
  rest.put(  
    Routes.applicationCommands(ClientID), { body: commands },
  ).catch(console.error)

/* ---------------------------------------- Read Modal ---------------------------------------- */

const db = require('pro.db');

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'updateProduct') {
  
    const oldName = interaction.fields.getTextInputValue('oldName');
    const newName = interaction.fields.getTextInputValue('newName');
    const newPrice = interaction.fields.getTextInputValue('newPrice');
    const newLink = interaction.fields.getTextInputValue('newLink');

    const foundProducts = await db.get(`Products`, { productName: oldName });

    let theProductName;
    if (Array.isArray(foundProducts) && foundProducts.length > 0) {
          
      const selectedProduct = foundProducts.find(product => product.productName === oldName);
      if (selectedProduct) {
        theProductName = selectedProduct.productName;
      } else {
        return interaction.reply({ content: `** قم بإدخال إسم منتج صحيح**`, ephemeral: true });
      }
    }

    if(isNaN(newPrice)) return interaction.reply({ content: `**قم إدخال سعر المنتج بطريقة صحيحة.**`, ephemeral:true });

    const checkData = await db.get(`Products`);
    const removingProduct = checkData.filter(re => re.productName !== theProductName);
    await db.set(`Products`, removingProduct);

    await db.push(`Products`, {
      productName: newName,
      productPrice: newPrice,
      productLink: newLink
    });

    interaction.reply({ content: `** تم تعديل المنتج بنجاح**` });

  }
});

/* ---------------------------------------- Help Interaction ---------------------------------------- */
client.on("interactionCreate" , async(interaction) => {
  if(interaction.customId == "helpSelect"){
    if(interaction.values[0] == "helpGeneral"){
      const embed = new EmbedBuilder()
                          .setAuthor({ name : client.user.username , iconURL : client.user.displayAvatarURL()})
                          .addFields(
                            {name : `\`/هيلب\`` , value : `لعرض اوامر البوت`},
                            {name : `\`/بنج\`` , value : `لرؤية بنج البوت`},
                            {name : `\`/شراء\`` , value : `لشراء بروجكت من البروجكتات الموجودة`},
                          )
                          .setFooter({ text : 'تم تطويره من قبل : General Progs' , iconURL : interaction.user.displayAvatarURL()})
                          .setThumbnail(interaction.guild.iconURL())
                          .setColor('#000000');
      await interaction.message.edit({embeds : [embed]})
      await interaction.deferUpdate();
    }else if(interaction.values[0] == "helpOwner"){
      const embed = new EmbedBuilder()
                          .setAuthor({ name : client.user.username , iconURL : client.user.displayAvatarURL()})
                          .addFields(
                            {name : `\`/اونر\`` , value : `لإضافة أونر جديد لقائمة الأونرز.`}
                          )
                          .setFooter({ text : 'تم تطويره من قبل : General Progs' , iconURL : interaction.user.displayAvatarURL()})
                          .setThumbnail(interaction.guild.iconURL())
                          .setColor('#000000');
      await interaction.message.edit({embeds : [embed]})
      await interaction.deferUpdate();
    }else if(interaction.values[0] == "helpAdmin"){
      const embed = new EmbedBuilder()
                          .setAuthor({ name : client.user.username , iconURL : client.user.displayAvatarURL()})
                          .addFields(
                            {name : `\`/تسطيب\`` , value : `لتحديد حساب البنك و البروبوت`},
                            {name : `\`/اضافة\`` , value : `لاضافة بروجكت جديد`},
                            {name : `\`/ازالة\`` , value : `لازالة بروجكت موجود`},
                            {name : `\`/بروجكتات\`` , value : `لعرض جميع البروجكتات مع اسمائهم و اسعارهم و روابطهم`},
                            {name : `\`/تعديل\`` , value : `لعمل تعديل على بروجكت ما`},
                            {name : `\`/حظر\`` , value : `إضافة شخص إلى قائمة الأشخاص المحظورين من استخدام أمر الشراء`},
                            {name : `\`/ازاله-حظر\`` , value : `إزالة شخص من قائمة الأشخاص المحظورين من استخدام أمر الشراء`},
                            {name : `\`/المحضورين\`` , value : `عرض منشن لجميع الأشخاص المحظورين من استخدام أمر الشراء`},

                          )
                          .setFooter({ text : 'تم تطويره من قبل : General Progs' , iconURL : interaction.user.displayAvatarURL()})
                          .setThumbnail(interaction.guild.iconURL())
                          .setColor('#000000');
      await interaction.message.edit({embeds : [embed]})
      await interaction.deferUpdate();
    }
  }
})


//nodejs-events
process.on("unhandledRejection", e => { 
  console.log(e)
}) 
process.on("uncaughtException", e => { 
  console.log(e)
})  
process.on("uncaughtExceptionMonitor", e => { 
  console.log(e)
})