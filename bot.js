const { Client, Intents, Collection, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Intents.FLAGS.GUILD_INTEGRATIONS,Intents.FLAGS.GUILD_WEBHOOKS,Intents.FLAGS.GUILD_INVITES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MESSAGE_TYPING,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const ayarlar = require("./ayarlar.json");
const db = require("nrc.db");
const message = require("./events/message");
const Discord = require("discord.js")
let prefix = ayarlar.prefix;

client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
  require(`./komutcalistirici`)(client);
}); 

client.on("ready", () => {
  require("./events/eventLoader")(client);
});






const { Modal, TextInputComponent, showModal } = require('discord-modals') 
const discordModals = require('discord-modals') 
discordModals(client); 



client.on('messageCreate', (message) => {
	if(message.content === '!ticaret-text') {
    if(!message.member.roles.cache.has(ayarlar.yetkilirol)) {
      return  message.reply({content: "Bu Komutu Kullanabilmek İçin Gerekli Yetkiye Sahip Değilsin!", ephemeral: true});
}
		const menu = new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setTitle("Narcos Code Ticaret Sistemi")
		.setDescription(`
		Satış Açmak İçin Formu Doldurunuz.`)

		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('ticaret-form')
		.setLabel('Form Doldur')
		.setStyle('SECONDARY'),
		
		);
		message.channel.send({
			embeds: [menu], components: [row]
		});
	}
});


const nrcred = new Modal() 
.setCustomId('ticaret-form-red')
.setTitle('Red Sebep Formu')
  .addComponents(
	new TextInputComponent() 
	.setCustomId('urun-red')
	.setLabel('Reddetme Sebebini Yaz')
	.setStyle('SHORT') 
	.setMinLength(1)
	.setPlaceholder('Redetme sebebi yazın')
	.setRequired(true)
  )

  const nrconay = new Modal() 
  .setCustomId('ticaret-form-onay')
  .setTitle('Onaylama Formu')
    .addComponents(
    new TextInputComponent() 
    .setCustomId('kanal-id')
    .setLabel('Gönderilecek Kanal İD Yazın')
    .setStyle('SHORT') 
    .setMinLength(1)
    .setPlaceholder('örnk; 130509813471')
    .setRequired(true)
    )
const nrcmodal = new Modal() 
.setCustomId('ticaret-form-doldur')
.setTitle('Ticaret Başvuru Formu')
  .addComponents(
	new TextInputComponent() 
	.setCustomId('urun-ad')
	.setLabel('Ürün Adı')
	.setStyle('SHORT') 
	.setMinLength(1)
	.setPlaceholder('Örn: Spotfy Pre')
	.setRequired(true)
  )
  .addComponents(
    new TextInputComponent() 
    .setCustomId('urun-tip')
    .setLabel('Ürün Tip')
    .setStyle('SHORT') 
    .setMinLength(1)
    .setPlaceholder('Hesap/İtem/Sosyal Medya birini yazınız')
    .setRequired(true)
    )
  .addComponents(
    new TextInputComponent() 
    .setCustomId('urun-fiyat')
    .setLabel('Ürün Fiyat')
    .setStyle('SHORT') 
    .setMinLength(1)
    .setPlaceholder('Örn: 10TL')
    .setRequired(true)
    )
    .addComponents(
      new TextInputComponent() 
      .setCustomId('urun-acıklama')
      .setLabel('Ürün Açıklama')
      .setStyle('LONG') 
      .setMinLength(1)
      .setPlaceholder('örn: Ürünümün özellikleri şudur budur')
      .setRequired(true)
      )
      .addComponents(
        new TextInputComponent() 
        .setCustomId('urun-goruntu')
        .setLabel('Ürün İle Alakalı Görüntüler')
        .setStyle('LONG') 
        .setMinLength(1)
        .setPlaceholder('Hızlı Resim gibi sitelere yükleyerek buraya linkini atınız.')
        .setRequired(true)
        )
client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "ticaret-form"){


		showModal(nrcmodal, {
			client: client, 
			interaction: interaction 
		  })
      return
	}
  if(!interaction.member.roles.cache.has(ayarlar.yetkilirol)) {
    return  interaction.reply({content: "Bu Komutu Kullanabilmek İçin Gerekli Yetkiye Sahip Değilsin!", ephemeral: true});
}
  if(interaction.customId === "ticaret-red"){
		showModal(nrcred, {
			client: client, 
			interaction: interaction 
		  })
	}



if(interaction.customId === "ticaret-onay"){
  showModal(nrconay, {
    client: client, 
    interaction: interaction 
    })
}
});


client.on('modalSubmit',async (modal) => {
if(modal.customId === "ticaret-form-onay"){
  const row1 = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('ti')
		.setLabel('İşlem Tamamlandı')
		.setStyle('PRIMARY')
    .setDisabled(true),
		);


   let add =  db.fetch(`urun_ad_${modal.message.id}`)
   let tipp = db.fetch(`urun_tip_${modal.message.id}`)
   let fiyatt =  db.fetch(`urun_fiyat_${modal.message.id}`)
   let acıklamaa = db.fetch(`urun_acıklama_${modal.message.id}`)
   let goruntuu =  db.fetch(`urun_goruntu_${modal.message.id}`)
   let sahip = db.fetch(`urun_sahip_${modal.message.id}`)

   const embedd = new Discord.MessageEmbed()
   .setColor("RANDOM")
   .setDescription(`<@${sahip}>tarafından yapılmış olan ticaret başvurusu <@${modal.user.id}> tarafından onaylandı*`)
   modal.message.edit({embeds:[embedd],components:[row1]})

   await modal.deferReply({ ephemeral: true })
   modal.followUp({ content: `Başarılı Bir Şekilde onaylandı`, ephemeral: true })
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`

    > **Ürün Sahibi:** <@${sahip}>

    **Ürün Adı:** \`${add}\`
    **Ürün Tipi:** \`${tipp}\`
    **Ürün Fiyat:** \`${fiyatt}\`
    **Ürün Açıklama;**
    \`\`\`\ ${acıklamaa}\`\`\`\
    **Ürün Görüntüleri;**
    ${goruntuu}
    
    > Not: Dolandırılmamak için aracılık talebinde bulunabilirsin 
    `)
    let user = client.users.cache.get(sahip)
    user.send(`Yapmış Olduğunuz Ticaret Başvurusu Onaylandı 
    Onaylayan Yetkili: <@${modal.user.id}>`).catch(err => {
      modal.channel.send(`<@${user.id}> isimli kullanıcının dm si kapalı olduğu için yazamadım.`)
    })
    client.channels.cache.get(ayarlar['red-onay-log']).send(`${sahip}, yapmış olduğu ticaret başvurusu onaylandı`)
    client.channels.cache.get(modal.getTextInputValue('kanal-id')).send(`<@${sahip}>`).catch(err => {
      modal.followUp({ content: `Yazmış olduğunuz id li kanal bulunamadı`, ephemeral: true })
    })
    client.channels.cache.get(modal.getTextInputValue('kanal-id')).send({embeds:[embed]})
    db.delete(`urun_ad_${modal.message.id}`)
    db.delete(`urun_tip_${modal.message.id}`)
    db.delete(`urun_fiyat_${modal.message.id}`)
    db.delete(`urun_acıklama_${modal.message.id}`)
    db.delete(`urun_goruntu_${modal.message.id}`)
   db.delete(`urun_sahip_${modal.message.id}`)

}



	if(modal.customId === 'ticaret-form-red'){
    db.delete(`urun_ad_${modal.message.id}`)
    db.delete(`urun_tip_${modal.message.id}`)
    db.delete(`urun_fiyat_${modal.message.id}`)
    db.delete(`urun_acıklama_${modal.message.id}`)
    db.delete(`urun_goruntu_${modal.message.id}`)
   let kisi =  db.fetch(`urun_sahip_${modal.message.id}`)
   db.delete(`urun_sahip_${modal.message.id}`)
   let user = client.users.cache.get(kisi)

   await modal.deferReply({ ephemeral: true })
   
   const row1 = new MessageActionRow()
   .addComponents(
   new MessageButton()
   .setCustomId('ti')
   .setLabel('İşlem Reddedldi')
   .setStyle('PRIMARY')
   .setDisabled(true),
   );
   let sebep = modal.getTextInputValue('urun-red')
   const embed = new Discord.MessageEmbed()
   .setColor("RANDOM")
   .setDescription(`<@${kisi}> tarafından yapılan ticaret başvurusu <@${modal.user.id}> tarafından reddedildi
   Reddedilme Sebebi: **${sebep}**`)
   user.send(`Yapmış Olduğunuz Ticaret Başvurusu Reddedildi Reddeden Yetkili: <@${modal.user.id}>
   sebep: ${sebep}`).catch(err => {
     modal.channel.send(`<@${user.id}> isimli kullanıcının dm si kapalı olduğu için yazamadım.`)
   })
   client.channels.cache.get(ayarlar['red-onay-log']).send(`${kisi}, yapmış olduğu ticaret başvurusu reddedildi
   sebep: **${sebep}**`)
   modal.message.edit({embeds: [embed],components:[row1]})
   modal.followUp({ content: `Başarılı Bir Şekilde reddedildi`, ephemeral: true })
  }

	if(modal.customId === 'ticaret-form-doldur'){
  

 
    const ad = modal.getTextInputValue('urun-ad')
    const tip = modal.getTextInputValue('urun-tip')
    const fiyat = modal.getTextInputValue('urun-fiyat')
    const acıklama = modal.getTextInputValue('urun-acıklama')
    const goruntu = modal.getTextInputValue('urun-goruntu')
		
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setDescription(`
    > Ürün Ekleyen: <@${modal.user.id}> \`${modal.user.username}${modal.user.tag}\`

    > Ürün Bilgileri;
    **Ürün Adı:** \`${ad}\`
    **Ürün Tip:** \`${tip}\`
    **Ürün Fiyat:** \`${fiyat}\`
    **Ürün Açıklama;**
    \`\`\`${acıklama}\`\`\`
    Ürün Görüntüleri;
    ${goruntu}
    `)
    await modal.deferReply({ ephemeral: true })
    modal.followUp({ content: `Başarılı Bir Şekilde Talep Açıldı`, ephemeral: true })
    const row1 = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('ticaret-onay')
		.setLabel('Onayla')
		.setStyle('SUCCESS'),
    new MessageButton()
		.setCustomId('ticaret-red')
		.setLabel('Reddet')
		.setStyle('DANGER'),


		
		);
    client.channels.cache.get(ayarlar['ticaret-log']).send(`<@&${ayarlar.yetkilirol}>`)
    client.channels.cache.get(ayarlar['ticaret-log']).send({embeds:[embed], components: [row1]}).then(msg => {
      console.log(msg.id)
      db.set(`urun_ad_${msg.id}`, ad)
      db.set(`urun_tip_${msg.id}`,tip)
      db.set(`urun_fiyat_${msg.id}`, fiyat)
      db.set(`urun_acıklama_${msg.id}`, acıklama)
      db.set(`urun_goruntu_${msg.id}`, goruntu)
      db.set(`urun_sahip_${msg.id}`, modal.user.id)
    })



	}

  })













client.login(ayarlar.token);
