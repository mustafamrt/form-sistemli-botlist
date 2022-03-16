const { Client, Intents, Collection, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager, MessageButton, MessageActionRow } = require('discord.js');
const Discord = require("discord.js")
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Intents.FLAGS.GUILD_INTEGRATIONS,Intents.FLAGS.GUILD_WEBHOOKS,Intents.FLAGS.GUILD_INVITES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MESSAGE_TYPING,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const ayarlar = require("./ayarlar.json");
const db = require("nrc.db");
const message = require("./events/message");
require('dotenv').config();
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
	if(message.content === 'botlist') {
		const menu = new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setTitle("Narcos Code Botlist Sistemi")
		.setDescription(`
		Bot Ekletme Başvurusu İçin Aşağıdaki Butona Basınız.`)

		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('bot-başvuru')
		.setLabel('Bot Ekletmek İçin Tıkla')
		.setEmoji("🤖")
		.setStyle('SECONDARY'),
		
		);
		message.channel.send({
			embeds: [menu], components: [row]
		});
	}
});

const nrcmodal = new Modal() 
.setCustomId('narcos-botlist')
.setTitle('BotList Başvuru Formu')
.addComponents(
  new TextInputComponent() 
  .setCustomId('bot-id')
  .setLabel('Bot id yazınız')
  .setStyle('SHORT') 
  .setMinLength(18)
  .setMaxLength(18)
  .setPlaceholder('797904178223644672')
  .setRequired(true)
)
.addComponents(
	new TextInputComponent() 
	.setCustomId('bot-prefix')
	.setLabel('Prefix Yazınız')
	.setStyle('SHORT') 
	.setMinLength(1)
	.setPlaceholder('Örnek: n!')
	.setRequired(true)
  )
  .addComponents(
	new TextInputComponent() 
	.setCustomId('bot-onay')
	.setLabel('Top.gg Onaylımı?')
	.setStyle('SHORT') 
	.setMinLength(1)
	.setPlaceholder('evet / hayır')
	.setRequired(true)
  )
  .addComponents(
	new TextInputComponent() 
	.setCustomId('bot-hakkinda')
	.setLabel('Botunuzu Tanıtınız')
	.setMaxLength(500)
	.setStyle('LONG') 
	.setMinLength(1)
	.setPlaceholder('Şart değil ama tanıtırsanız daha hızlı onaylanır.')
  )


client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "bot-başvuru"){
		showModal(nrcmodal, {
			client: client, 
			interaction: interaction 
		  })
	}
	if(interaction.customId === "botred"){
		if(!interaction.member.roles.cache.has(ayarlar.botlistyetkilirol)) {
            return  interaction.reply({content: "Bu Komutu Kullanabilmek İçin Gerekli Yetkiye Sahip Değilsin!..", ephemeral: true});
     }
		const redform = new Modal() 
.setCustomId('narcos-botlist-red')
.setTitle('BotList Red Sebep Formu')
  .addComponents(
	new TextInputComponent() 
	.setCustomId('red-sebep')
	.setLabel('Reddetme Sebebinizi Belirtiniz.')
	.setStyle('LONG') 
	.setMinLength(1)
	.setMaxLength(500)
	.setPlaceholder('Botun Kullanıcı Sayısı Az \n Çok Fazla Emoji VB.')
	.setRequired(true)
  )
		showModal(redform, {
			client: client, 
			interaction: interaction 
		  })

		}




	if(interaction.customId === "botonay"){

		
        if(!interaction.member.roles.cache.has(ayarlar.botlistyetkilirol)) {
            return  interaction.reply({content: "Bu Komutu Kullanabilmek İçin Gerekli Yetkiye Sahip Değilsin!..", ephemeral: true});
     }

		let sahip = db.fetch(`onay-red-mesaj_${interaction.message.id}`)
		let botid = db.fetch(`bot_id_${sahip}`)

		const embed = new Discord.MessageEmbed()
		.setColor("RANDOM")
			.setDescription(`
		**${botid}** İD bot onaylandı.
		**Onaylayan Yetkili:** <@${interaction.user.id}> (${interaction.user.id})
		`)
		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('onaylandı')
		.setLabel('Bot Onaylandı')
		.setStyle('SUCCESS')
		.setDisabled(true)
		
		);
		await interaction.update({ embeds: [embed] , components: [row] });
		db.delete(`onay-red-mesaj_${interaction.message.id}`)
		db.delete(`bot_bilgi_${botid}`)
		db.delete(`bot_${botid}`)
		const embedd = new Discord.MessageEmbed()
		.setColor("GREEN")
		.setDescription(`
		<@${sahip}> isimli kullanıcının botu <@${interaction.user.id}> tarafından onaylandı.
		`)
		
		client.channels.cache.get(ayarlar['onay-red-log']).send({embeds:[embedd]})

	}

});


client.on('modalSubmit',async (modal) => {

	if(modal.customId === 'narcos-botlist-red'){

		let sahip = db.fetch(`onay-red-mesaj_${modal.message.id}`)
		const aciklama = modal.getTextInputValue('red-sebep')
		
		const embed = new Discord.MessageEmbed()
		.setColor("RED")
		.setDescription(`
		<@${sahip}> isimli kullanıcının botu <@${modal.user.id}> tarafından reddedildi.
		> Sebep: **${aciklama}**
		`)
		await modal.deferReply({ ephemeral: true })
 		modal.followUp({ content: `Başarılı Bir Şekilde Reddedildi.`, ephemeral: true })
		client.channels.cache.get(ayarlar['onay-red-log']).send({embeds:[embed]})

		let botid = db.fetch(`bot_id_${sahip}`)
		db.delete(`bot_id_${sahip}`)
		db.delete(`onay-red-mesaj_${modal.message.id}`)
		db.delete(`bot_bilgi_${botid}`)
		db.delete(`bot_${botid}`)

		const embedd = new Discord.MessageEmbed()
		.setColor("RED")
			.setDescription(`
		**${botid}** İD bot Reddedildi.
		**Reddeden Yetkili:** <@${modal.user.id}> (${modal.user.id})
		> Sebep: **${aciklama}**
		`)
		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('reddedildi')
		.setLabel('Bot Reddedildi')
		.setStyle('DANGER')
		.setDisabled(true)
		
		);
		client.channels.cache.get(ayarlar.botlog).messages.edit(modal.message.id, {embeds: [embedd], components: [row]})
	}

	if(modal.customId === 'narcos-botlist'){
		const botid = modal.getTextInputValue('bot-id')
		const botprefix = modal.getTextInputValue('bot-prefix')
		const topgg = modal.getTextInputValue('bot-onay')
		const aciklama = modal.getTextInputValue('bot-hakkinda')
		let kontrol = db.fetch(`bot_id_${modal.user.id}`)
		await modal.deferReply({ ephemeral: true })
		if(kontrol) return  modal.followUp({ content: `Zaten Başvuru Yapmışsın Onaylanmasını Bekleyiniz.`, ephemeral: true })
		let kontrol2 = db.fetch(`bot_${botid}`)
		if(kontrol2) return  modal.followUp({ content: `Bu Bot Zaten Sistemimizde Var.`, ephemeral: true })
		db.set(`bot_id_${modal.user.id}`, botid)
		db.set(`bot_${botid}`, modal.user.id)
		db.set(`bot_bilgi_${botid}`, [])
		db.push(`bot_bilgi_${botid}`, botprefix)
		db.push(`bot_bilgi_${botid}`, topgg)
		db.push(`bot_bilgi_${botid}`, aciklama ? aciklama : "açıklama bulunamadı")
		modal.followUp({ content: `Başarılı Bir Şekilde Ekleme Talebi Açıldı`, ephemeral: true })

		const row = new MessageActionRow()
		.addComponents(
		new MessageButton()
		.setCustomId('botonay')
		.setLabel('Botu Onayla')
		.setStyle('SUCCESS'),
		
		new MessageButton()
		.setCustomId('botred')
		.setLabel('Botu Reddet')
		.setStyle('DANGER'),

		new MessageButton()
		.setURL(`https://discord.com/oauth2/authorize?client_id=${botid}&guild_id=${modal.message.guildId}&scope=bot&permissions=0`)
		.setLabel('0 Perm Davet')
		.setStyle('LINK'),

		new MessageButton()
		.setURL(`https://discord.com/oauth2/authorize?client_id=${botid}&guild_id=${modal.message.guildId}&scope=bot&permissions=0`)
		.setLabel('8 Perm Davet')
		.setStyle('LINK'),
		);

		const embed = new Discord.MessageEmbed()
		.setColor("RANDOM")
		.setDescription(`
		> **Bot Bilgileri;**

		**İD:** \`\`\`\ ${botid}\`\`\`\
		**Prefix:** \`\`\`\ ${botprefix}\`\`\`\
		**Top.gg Onaylımı?** \`\`\`\ ${topgg} \`\`\`\
		**Açıklama;**
		\`\`\`\ ${aciklama ? aciklama: "Açıklama Bulunamadı."} \`\`\`\

		> **Kullanıcı Bilgileri;**

		**İD:** \`${modal.user.id} ${modal.user.username}\`
		**Etiket:** <@${modal.user.id}>
		`)
		.setImage("https://cdn.discordapp.com/attachments/944638752398147614/946733355565731840/standard_3.gif")
		client.channels.cache.get(ayarlar.botlog).send({embeds:[embed],components: [row]}).then(c => {
			db.set(`onay-red-mesaj_${c.id}`, modal.user.id)
		})
		
	  
	}  
  })



  client.on('guildMemberRemove',async (member) => {

	let kontrol = db.fetch(`bot_id_${member.id}`)

	if(!kontrol) return

	let user = member.guild.members.cache.get(kontrol)
	console.log(user)
	user.ban({reason: "Sahibi Sunucudan Çıktı"})
	const embed = new Discord.MessageEmbed()
	.setColor("RANDOM")
	.setDescription(`${member}, sunucudan çıktı botunuda sunucudan banladım`)
	client.channels.cache.get(ayarlar['cikti-log']).send({embeds:[embed]})

  })

client.login(ayarlar.token);
