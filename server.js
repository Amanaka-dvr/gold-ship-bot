const http = require('http');//for setting
const querystring = require('querystring');//for setting
const discord = require('discord.js'); //for setting
const path = require('path'); //for showing address
const { ButtonStyle } = require('discord.js');
const { Client, Collection, GatewayIntentBits, Partials, Intents, EmbedBuilder } = require("discord.js");
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
const client = new Client({
  intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
	],
	partials: [
		Partials.User,
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.GuildScheduledEvent,
		Partials.ThreadMember,
	],
});
const crypto = require('crypto'); //to check hash value
const axiosBase = require("axios"); //to post other bot json

const DEFAULT_LANG = 'JA';
const AUTH_FILE = './package.json';

const Eris = require("eris"); //to read text message
const {VoiceText} = require('voice-text'); //to read text message
const {writeFileSync} = require('fs'); //to read text message
const fs = require('fs');

const fz = require('./factorization.js');
//const tr = require('./text-reader.js'); //cuz storage will be full cant work
const jinro = require('./jinro/jinro.js');
const voice = require('./voice/playMusic.js');

/*
* webhook bots;
* アグネスデジタル
* エアグルーヴ
* オグリキャップ
* サイレンススズカ
* サクラバクシンオー
* シンボリルドルフ
* スペシャルウィーク
* タマモクロス
* トウカイテイオー
* ナリタブライアン
*/
let charList = [];

let narikiri = "505846772069826571"

const debugChannelId = "933964587777286214";
const logChannelId = "934986946663559198";
const mainChannelId = "934139074560786482";
let readChannelId = "934378749321957376"; //934021714608799774//934378749321957376//939821864035966996//952853378524925992//972709506050031626
let readVCChannel = "918212991646859337"; //918212991646859337//933709595728289793//939821495683788800//952852953201532928

const password = "mintmotionmintmotionmintmotion";

let voiceList = [];
let voiceFlag = false;
let count = 0;

let auth_key = process.env.DEEPL_AUTH_KEY;

let emergency = false;
let banID = [];
let blackList = process.env.BLACK_LIST.split(' ');
console.log(blackList);

let canReply = true;
let jinroFrag = false;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`${filePath} に必要な "data" か "execute" がありません。`);
	}
}

http.createServer(function(req, res){
  if (req.method == 'POST') {
    var data = "";
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
      if(!data){
        console.log("No post data");
        res.end();
        return;
      }
      var dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        sendPeriodically(); //@@@@@@@@@@@@@@@@@@@@@@@
        reset(); //@@@@@@@@@@@@@@@@@@@@@@@
        res.end();
        return;
      }
      if(dataObject.type == "newMintLoveVideo"){
        let msgChannelId = debugChannelId;
        if(dataObject.debug !== undefined && dataObject.debug == "false"){
          msgChannelId = mainChannelId;
        }
        let msgMention = "<@910381775874834462>";
        let videoId = dataObject.url.replace("https://youtu.be/", "");
        let emb = {embed: {
          author: {
            name: "Mint Love",
            url: "https://www.youtube.com/c/MintLove",
            icon_url: "https://yt3.ggpht.com/YVVxpxQc7HCE0WXbxU0X53vkSrLTshjDH2FehQ5BsqwqseWKkEul3H7H5JL6UgZPtiI4NDjRVA=s176-c-k-c0x00ffffff-no-rj"
          },
          title: dataObject.title,
          url: dataObject.url,
          description: dataObject.description,
          color: 7506394,
          timestamp: new Date(),
          thumbnail: {
            url: "http://img.youtube.com/vi/" + videoId + "/mqdefault.jpg"
          }
        }};
        sendMsg(msgChannelId, msgMention + " の新着動画！", emb);
      }
      res.end();
    });
  }else if (req.method == 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord bot is active now \n');
  }
}).listen(3000);

client.on('ready', () =>{
  console.log('Bot準備完了～');
  client.user.setPresence({ activity: { name: "トーセンジョーダン" } });
  client.on("interactionCreate", (interaction) => onInteraction(interaction).catch(err => console.error(err)));
  //leadLine();
});

//connection.play(fs.createReadStream('voice.ogg'), { type: 'ogg/opus' });
/*
client.on('voiceStateUpdate', (oldGuildMember, newGuildMember) =>{
 if(oldGuildMember.voiceChannelID === undefined && newGuildMember.voiceChannelID !== undefined){
   if(client.channels.get(newGuildMember.voiceChannelID).members.size == 1){
     if (newGuildMember.voiceChannelID == 918212991646859337 || newGuildMember.voiceChannelID == 933709595728289793) {
       newGuildMember.voiceChannel.createInvite({"maxAge":"0"})
         .then(invite => sendMsg(
           mainChannelId, "<@" + newGuildMember.user.id +"> が通話を開始しました！\n" + invite.url
         ));
     }
   }
 }
});
*/

////////////server commands////////////

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`${interaction.commandName} が見つかりません。`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
	}
});

////////////message commands////////////

client.on('messageCreate', async message => {
  if(message.author.id == client.user.id || message.author.bot){
    return;
  }

  ////////////security commands////////////
  
  for (let i=0; i<banID.length; i++) {
    if (message.author.id == banID[i]) {
      message.delete();
      return;
    }
  }
  
  if(message.author.id == 786914493640081438){
    if (message.content.startsWith('!kick') && message.guild) {
   	 if (message.mentions.members.size !== 1) return message.channel.send('キックするメンバーを1人指定してください')
     const member = message.mentions.members.first();
     if (!member.kickable) return message.channel.send('このユーザーをキックすることができません')
     
     //await member.kick();
     
     message.channel.send(`${member.user.tag}をキックしました`)
    }
    
    if (message.content.startsWith('!timeout') && message.guild) {
   	 if (message.mentions.members.size !== 1) return message.channel.send('タイムアウトするメンバーを1人指定してください');
     const member = message.mentions.members.first();
     banID.push(member.id);
     console.log(member.id,banID);
     message.channel.send(`${member.user.tag}をタイムアウトしました`);
    }
    if (message.content.startsWith('!rmtimeout') && message.guild) {
   	 if (message.mentions.members.size !== 1) return message.channel.send('解除するメンバーを1人指定してください');
     const member = message.mentions.members.first();
     for (let i=0; i<banID.length; i++) {
      if (member.id == banID[i]) {
       banID = banID.filter(item => (item.match(banID[i])) == null);
       console.log(banID);
      }
     }
     message.channel.send(`${member.user.tag}のタイムアウトを解除しました`);
    }
    
    if (message.content.match(/!explosion/)) {
      let re = /[^\s]+/g;
      let scdstr = message.content.match(re);
      let scd = scdstr.map(str=>parseInt(str,10));
      scd[1] = scd[1] || 1;
      console.log(scd[1]);
      const messages = await message.channel.messages.fetch({ limit: scd[1] });
      const filtered = messages.filter(message => message.author.id == 933850580441497621); //in case of filtering
      message.channel.bulkDelete(messages);//filtered);
    };
  }
  
  for (let i=0; i<blackList.length; i++) {
    if (message.author.id == blackList[i]){
      let caution_text = "【要注意人物の発言です】";
      let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
      sendMsg(logChannelId, text);
    }
  }
  if (message.content.match(/ﾀﾋね|56すぞ/)){
    let caution_text = "【禁止用語が含まれています】";
    let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
    sendMsg(logChannelId, text);
    return;
  }
  if (message.content.match(/http/)){
    let caution_text = "[外部サイトへのリンクが含まれています]";
    let text = caution_text+"\nuser:　"+message.member.displayName+"\nuserID:　"+message.author.id+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
    sendMsg(logChannelId, text);
    // return; --> temporary enabled for music command
  }

  // delete command

  if(message.content.match(/[!！]緊急/)){
    const role = message.guild.roles.find(roles => roles.name === '生徒会');
    if (!message.member.roles.has(role.id)) {
      return;
    }
    sendReply(message, "設定しました");
    emergency = true;
    return;
  }
  if(message.content.match(/[!！]緊急解除/)){
    const role = message.guild.roles.find(roles => roles.name === '生徒会');
    if (!message.member.roles.has(role.id)) {
      return;
    }
    sendReply(message, "解除しました");
    emergency = false;
    return;
  }
  if (true) {//message.author.id == 786914493640081438){
    if (emergency == true) {
    message.delete();
    return;
    }
  }

  ////////////FOR MAINTAINANCE ONLY////////////
  /*
  if(message.author.id != 786914493640081438){
    return;
  }
  //*/
  
  ////////////narikiri commands////////////
  
  if(message.content.match(/\!解除/) && message.channel.id == 937522865354473522){
    await loadInpJson();
    const id = message.author.id;
    const index = charList.findIndex((num) => num[0] == id);
    if (index == -1) return sendReply(message, "既に役がありません");
    if (charList[index][1] == message.author.id) {
      charList[index][0] = "";
      await setInpJson();
      sendReply(message, "解除しました");
      return;
    }
    charList[index][0] = charList[index][1];
    await setInpJson();
    sendReply(message, "解除しました");
    return;
  }
  
  //管理者用コマンド
  
  if(message.content.match(/!遠隔送信/) && message.author.id == 786914493640081438){
    await loadInpJson();
    const re = /[^( |　)]+/g;
    const str = message.content.match(re);
    const name_ja = str[1];
    const text = str[2];
    const charaData = charList.find((num) => num[4] == name_ja);
    if (charaData == undefined) return sendReply(message, `${name_ja}は在籍していません。`);
    const data = {
      method : 'post',
      type : 'sendRawText',
      content : text,
      muteHttpExceptions : true
    };
    doApi(charaData[2], data);
    message.delete();
    return;
  }
  
  if (message.content.match(/!編集/) && message.author.id == 786914493640081438) {
    const re = /[^( |　)]+/g;
    const str = message.content.match(re);
    const messageId = str[1];
    const text = str[2];
    const channel = client.channels.cache.get("937260648218361856");
    const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find(wh => wh.token);
    const embed = new EmbedBuilder()
	    .setTitle('Some Title')
	    .setColor(0x00FFFF);
    console.log("used testfor");
    console.log(messageId);
    console.log(client.channels.cache.get("937260648218361856").messages);
    console.log(client.channels.cache.get("937260648218361856").messages.fetch(messageId));
    const messageSub = await webhook.editMessage(messageId, {
	    content: text,
	    //username: 'some-username',
	    //avatarURL: 'https://i.imgur.com/AfFp7pu.png',
	    //embeds: [embed],
    });
    //client.channels.cache.get("937260648218361856").messages.fetch(messageId).then(msg => msg.edit(text));
    return;
  }
  
  if (message.content.match(/!詳細編集/) && message.author.id == 786914493640081438) {
    const re = /[^( |　)]+/g;
    const str = message.content.match(re);
    const messageId = str[1];
    const text = str[2];
    const color = str[3];
    const title = str[4];
    const description = str[5];
    const channel = client.channels.cache.get("937260648218361856");
    const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find(wh => wh.token);
    const embed = new EmbedBuilder()
	    .setTitle(title)
	    .setColor(color)
      .setDescription(description);
    const messageSub = await webhook.editMessage(messageId, {
	    content: text,
	    //username: 'some-username',
	    //avatarURL: 'https://i.imgur.com/AfFp7pu.png',
	    embeds: [embed],
    });
    //client.channels.cache.get("937260648218361856").messages.fetch(messageId).then(msg => msg.edit(text));
    return;
  }
  
  if(message.content.match(/!呼出/) && message.channel.id == 937522865354473522){
    await loadInpJson();
    const re = /[^\s]+/g;
    const str = message.content.match(re);
    const name_ja = str[1];
    const charaData = charList.find((num) => num[4] == name_ja);
    if (charaData == undefined) return sendReply(message, `${name_ja}は在籍していません。`);
    const data = {
      method : 'post',
      type : 'wake',
      muteHttpExceptions : true
    };
    if (charaData[5]) return sendReply(message, `${charaData[4]}は呼び出せません。`);
    doApi(charaData[2], data);
    sendReply(message, `${charaData[4]}を呼び出しています……`)
    return;
  }

  if(message.content.match(/!設定/) && message.channel.id == 937522865354473522){
    await loadInpJson();
    const re = /[^\s]+/g;
    const str = message.content.match(re);
    const name_ja = str[1];
    if (name_ja == undefined) return sendReply(message, `担当名を入力してください。`);
    const index = charList.findIndex((num) => num[4] == name_ja);
    if (index == -1) return sendReply(message, `${name_ja}は在籍していません。`);
    if (charList.some((num) => num[0] == message.author.id)) {
      const originIndex =  charList.findIndex((num) => num[0] == message.author.id);
      const originNameJa = charList[originIndex][4];
      sendReply(message, `担当を ${originNameJa} から ${name_ja} に更新します。`);
      if (charList[originIndex][1] == message.author.id) {
        charList[originIndex][0] = "";
      } else {
        charList[originIndex][0] = charList[originIndex][1];
      }
    }
    charList[index][0] = message.author.id;
    await setInpJson();
    sendReply(message, "設定しました");
    return;
  }

  if(message.content.match(/!担当/) && message.channel.id == 937522865354473522){
    await loadInpJson();
    const re = /[^\s]+/g;
    const str = message.content.match(re);
    const name_ja = str[1];
    if (name_ja == undefined) return sendReply(message, `担当名を入力してください。`);
    const charaData = charList.find((num) => num[4] == name_ja);
    if (charaData == undefined) return sendReply(message, `${name_ja}は在籍していません。`);
    const id = charaData[0];
    const guild = client.guilds.cache.find((g) => g.id === "918212991135125556");
    if (id == "") return sendReply(message, `${charaData[4]}は担当がいません。`);
    const user = await guild.members.fetch(id);
    console.log(user);
    sendReply(message, `${charaData[4]}の担当は${user.displayName}です。`)
    return;
  }

  if(message.channel.id == 937260648218361856){
    await loadInpJson();
    const id = message.author.id;
    const charaData = charList.find((num) => num[0] == id);
    console.log(charaData);
    console.log(charaData[2]);
    if (charaData == undefined) {
      let caution_text = "【演者でない人による投稿です】";
      let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
      sendMsg(logChannelId, text);
      message.delete();
      return;
    }
    const data = {
      method : 'post',
      type : 'sendRawText',
      content : message.content,
      muteHttpExceptions : true
    };
    console.log(charaData[2], data);
    doApi(charaData[2], data);
    message.delete();
    return;
  }
  
  if(message.content.match(/\!ゴルシになる/) && message.channel.id == 937522865354473522){
    sendReply(message, "設定しました");
    narikiri = message.author.id;
    return;
  }
  if(message.content.match(/\!今のゴルシ/) && message.channel.id == 937522865354473522){
    let text = "<@" + narikiri + ">";
    sendReply(message, text);
    return;
  }
  /*
  if(message.author.id == 786914493640081438){
    sendMsg(message.channel.id, message.content);
    message.delete();
    return;
  }*/
  if (message.author.id == narikiri && message.channel.id == 937260648218361856){
    const file = message.attachments.first();
    let text = message.content + "\n";
    sendMsg(message.channel.id, text);
    if (!file) {
      message.delete();
      return;
    }
    if (!file.height && !file.width){
      sendMsg(message.channel.id, text);
      message.delete();
      return;
    }
    message.channel.send({
      embed: {
        image: {
          url: file.url
        }
      }
    })
    message.delete();
    return;
  }

  ////////////voice commands////////////
  /*
  if (message.content.match(/!join/)){
    tr.join(message);
    return;
  }
  if (message.content.match(/!setch/)){
    readChannelId = message.channel.id;
    console.log(message.channel.displayName);
    return;
  }
  if (message.content.match(/!play/)){
    voiceFlag = true;
    return;
  }
  if (message.content.match(/!stop/)){
    voiceFlag = false;
    return;
  }
  if (message.channel.id == readChannelId){
    tr.readText(message);
  }
  */
  if (message.content.match(/!addq/)){
    voice.addQueue(message);
  }
  if (message.content.match(/!skip/)){
    voice.skipQueue(message);
  }
  if (message.content.match(/!addp/)){
    voice.addPlayList(message);
  }
  if (message.content.match(/!rmp/)){
    voice.remove.PlayList(message);
  }
  if (message.content.match(/!pm/)){
    voice.playMusic(message);
  }
  if (message.content.match(/!pl/)){
    voice.playMusicList(message);
  }
  if (message.content.match(/!unlock/)){
    voice.stopPlaying(message);
  }
  
  
  ////////////reaction commands////////////
  
  
  if (message.author.id !== client.user.id || message.author.bot){
    let isPOWER = false;
    if (message.author.id == 696698066597838849){
      message.react('933971549361414174')
      .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
      .catch(console.error);
      isPOWER = true;
    }
    if (message.author.id == 910381775874834462){
      message.react('933971549361414174')
      .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
      .catch(console.error);
      isPOWER = true;
    }
    if (!isPOWER) {
      if (message.content.match(/[pPｐＰ9][oOｏＯ0０〇][wWｗＷ][eEｅＥ3][rRｒＲ]|[ぱパ][わワクﾜｸゎヮ][一ー－―‐～₋⁻—￣ー＿]/)) {
        console.log("next")
        if (message.content.match(/[pPｐＰ][oOｏＯ0０〇][wWｗＷ][eEｅＥ][rRｒＲ](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|[ぱパ][わワクﾜｸ][一ー－―‐～₋⁻—￣ー](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|ミントモーション殿下/)) {
          console.log("tochk")
          message.react('933971549361414174')
          .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
          .catch(console.error);
          return;
        } else {
          console.log("orhere")
          sendReply(message, "殿下を無礼るなぁ！");
          return;
  　    }
      }
    }
  }
  
  ////////////server message commands////////////
  
  /*
  if(message.isMemberMentioned(client.user)){
    sendReply(message, "おう！なんか用か？");
    return;
  }
  */
  if (message.content.match(/564\s-?\d+\s-?\d+\s-?\d+/)){
    const text = fz.factorization(message.content);
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/ゴルシ、お金ちょうだい/)){
    let text = "120億で足りるか？";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/ゴルシおはよう/)){
    let text = "おはよーございまーす";
    sendReply(message, text);
    return;
  }
  if (message.content.match(/ゴルシおやすみ/)){
    let text = "良い夢見ろよ！";
    sendReply(message, text);
    return;
  }
  if (message.content.match(/Hey Siri/)){
    let text = "私はGorusiです";
    sendReply(message, text);
    return;
  }
  if (message.content.match(/念力|^念$/)){
    let text = "ふんにゃか～はんにゃか～";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/ウマといえば/)){
    let text = "Just a Way";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/!えいえい/)){
    let text = "むん";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/暇/)){
    let text = "暇ならゴルシちゃんと遊ぼうぜ！";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/火星の天気/)){
    let text = "猛烈な砂嵐\n最高気温-4℃\n最低気温-95℃";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/現在のJPレート/)){
    let rate = 0+Math.random();
    let text = "1JPT="+rate+"¥";
    sendMsg(message.channel.id, text);
    return;
  }
  
  if (message.content.match(/現在のゴルジptレート/)){
    let rate = 1+Math.random()*0.1;
    let text = "1GJP="+rate+"¥";
    sendMsg(message.channel.id, text);
    return;
  }
  
  if (message.content.match(/入室日/)){
    const id = message.author.id;
    const guild = client.guilds.cache.find((g) => g.id === "918212991135125556");
    const user = await guild.members.fetch(id);
    const timestamp = user.joinedTimestamp;
    const utc = new Date(timestamp);
    utc.setHours(utc.getHours() + 9);
    const date = utc.toLocaleString("ja");
    sendReply(message, `あなたは\n${date}\nにこのサーバーに来ました。`);
    return;
  }
  
  if (message.content.match(/今日の運勢/)){ // && message.author.id == 786914493640081438 ){
    
    //sendReply(message, "只今メンテナンス中です");
    //return;

    /* Embed 例
    {embed: {
        author: {
          name: "author name",
          url: "https://discordapp.com", // nameプロパティのテキストに紐付けられるURL
          icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        title: "タイトル",
        url: "https://discordapp.com", // titleプロパティのテキストに紐付けられるURL
        description: "This is description. [URLを埋め込むことも出来る](https://discordapp.com)\n" +
                 "***embedの中でもMarkDownを利用できます***",
        color: 7506394,
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "©️ example | footer text"
        },
        thumbnail: {
          url: "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        image: {
        url: "https://cdn.discordapp.com/embed/avatars/0.png"
        },
        fields: [
          {
            name: "field :one:",
            value: "*ここはfield 1の内容だよ*"
          },
          {
            name: "field :two:",
            value: "~~ここはfield 2の内容だよ~~"
          },
          {
            name: "field :three:",
            value: "__ここはfield 3の内容だよ__"
          },
          {
            name: "inline field :cat:",
            value: "`これはinlineのfieldだよ`",
            inline: true
          },
          {
            name: "inline field :dog:",
            value: "[これもinlineのfieldだよ](https://discordapp.com)",
            inline: true
          }
        ]
      }}
    */
    /*
    usedUser.name.push(message.author.id);
    let usedUserData = { "date": usedUser.date, "name": usedUser.name };
    fs.writeFileSync('./omikuzi.json', JSON.stringify(usedUserData, null, 2), "utf-8", (err) => {
      if(err) {
        console.log(err);
      }
    });
    //return;
    
    let val = Math.random();
    let text = "";
    let luckval = 0;
    //let weight = [0, 0, 0, 0, 0 ,0 ,0 ,0 ,1.0];
    let weight = [0.001, 0.009, 0.02, 0.07, 0.20, 0.50, 0.10, 0.07, 0.03];
    let luck = ["ミラクルゴルゴル吉", "ゴル吉", "大吉", "吉", "中吉", "小吉", "凶", "大凶", "💩"];
    let explanation = ["\n一年分の運使ったな！", "\n帯馬券当たるぞ！", "\nおーすげー！良いことあるぞ～", "\nかなり運良いぞ！", "\n10連で最高レア出るぞ！", "\nまあまあだな！", "\nう～ん家にこもってたほうが良いぞ！", "\n救いはありません！", "\n鳥のフン食らったり、側溝に落ちたり、ドブに突っ込んだり、物壊れたり、最低保証だったりもう最悪だぞ！"]; 
    for (let i = 0; i < weight.length; i++) {
      luckval += weight[i];
      if (val < luckval) {
        text = luck[i] + explanation[i];
        break;
      }
    }
    //text = "OUT OF SERVICE";
    sendMsg(message.channel.id, text);
    return;
    */

    let usedUser = JSON.parse( fs.readFileSync( "./omikuzi.json", "utf8") );
    for (let i=0; i<usedUser.name.length; i++) {
      if (message.author.id == usedUser.name[i]) {
        sendReply(message, "おみくじは一日一回まで！");
        return;
      }
    }
    usedUser.name.push(message.author.id);
    let usedUserData = { "date": usedUser.date, "name": usedUser.name };
    fs.writeFileSync('./omikuzi.json', JSON.stringify(usedUserData, null, 2), "utf-8", (err) => {
      if(err) {
        console.log(err);
      }
    });

    let embedContent = {
        author: {
          name: "ゴールドシップ",
          icon_url: "https://cdn.discordapp.com/avatars/933850580441497621/b8881916b0e86aa40c0914307c6a306c.png?size=4096"
        },
        title: `${message.member.displayName} の うまみくじ`,
        description: "今日の運勢を占ってみるのか！？",
        color: 7506394,
        timestamp: new Date(),
        thumbnail: {
          url: "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item13.png"
        }
    };
    const embedMsg = await message.channel.send({ embeds: [embedContent]});     //, components: [new discord.ActionRowBuilder().addComponents(button1)]});
    
    setTimeout(function() {
      embedContent.description = "あいつに聞いてみようぜ！";
      embedMsg.edit({ embeds: [embedContent]})
    }, 2000);
    setTimeout(function() {
      embedContent.author.name = "マチカネフクキタル";
      embedContent.author.icon_url = "https://lh3.googleusercontent.com/vi-vu8EV0hbgGH9yRhmMl-euftAA_U9_TumQ3TOfZ9t0YPWXHbPwsgydbpdgaYmOnUtXqxn59TaHE1nGwFfUBK8W-rBsXh39MdUpBkblvGY=rw";
      embedContent.description = "おみくじですね！";
      embedMsg.edit({ embeds: [embedContent]})
    }, 5000);
    setTimeout(function() {
      embedContent.description = "はんにゃか〜…！ふんにゃか〜…！";
      embedMsg.edit({ embeds: [embedContent]})
    }, 7000);
    setTimeout(function() {
      embedContent.description = "出ましたっ！";
      embedMsg.edit({ embeds: [embedContent]})
    }, 9000);
    let val = Math.random();
    let text = "";
    let image = "";
    let luckval = 0;
    //let weight = [0, 0, 0, 0, 0 ,0 ,0 ,0 ,1.0];
    let weight = [0.001, 0.009, 0.02, 0.07, 0.20, 0.50, 0.10, 0.07, 0.03];
    let luck = ["\nスーパースペシャル特大吉！", "\n超吉！", "\n大吉！", "\n吉！", "\n中吉！", "\n小吉！", "\n末吉！", "\n凶！", "\n大凶！"];
    let explanation = ["\n運勢が限界突破しています！神がかっていますね！", "\n向かうところ敵なし！どんな勝負にも勝てそうです！", "\nおお！開運パワー全開ですね！", "\nスピリチュアルパワーがみなぎっています！", "\nなかなかラッキーですね！", "\nどっちつかずですが、普通が一番です！", "\n家で休んでいたほうが良さそうです……", "\nこ、これは…厄落とししないとぉ〜！", "\n靴ひもが切れたり、側溝に落ちたり、黒猫を見かけたり、物が壊れたり、最低保証だったりもう救いはありません～！"];
    let thumbnail = [
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png", 
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png", 
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item12.png", 
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item23.png", 
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item23.png", 
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item24.png", 
      "https://img.gamewith.jp/article_tools/uma-musume/gacha/i_item24.png", 
      "https://img.gamewith.jp/article_tools%2Fuma-musume%2Fgacha%2Ffukubiki_5.png", 
      "https://img.gamewith.jp/article_tools%2Fuma-musume%2Fgacha%2Ffukubiki_5.png"
    ];
    for (let i = 0; i < weight.length; i++) {
      luckval += weight[i];
      if (val < luckval) {
        text = luck[i] + explanation[i];
        image = thumbnail[i];
        break;
      }
    }
    return setTimeout(function() {
      embedContent.description = "出ましたっ！" + text;
      embedContent.thumbnail.url = image;
      embedMsg.edit({ embeds: [embedContent]});
    }, 10000);
    
  }
  if (message.content.match(/!apex武器縛り/)) {
    
    if (message.author.id == 464354759881523211) {
      
      var randoms = [];
      
      var min = 0, max = 16;
 
      
      
      for(let i = min; i <= max; i++){
        while(true){
          var tmp = intRandom(min, max);
          if(!randoms.includes(tmp)){
            randoms.push(tmp);
            break;
          }
        }
      }
    
      
      for(let i = 1; i <= 4; i++){
          var tmp = intRandom(min, max);
          randoms.push(tmp);
      }
 
     
      function intRandom(min, max){
        return Math.floor( Math.random() * (max - min + 1)) + min;
      }
    
      const weapons = [
      "ディボーション", //1
      "ランページ", //2
      "クレーバー", //3
      "チャージライフル", //4
      "センチネル", //5
      "ロングボウ", //6
      "マスティフ", //7
      "P2020", //8
      "トリプルテイク", //9
      "30-30リピーター", //10
      "ボセック", //11
      "ミニガン", //12
      "改造センチネル", //13
      "アークスター", //14
      "フラググレネード", //15
      "テルミット", //16
      "素手" //17
      ];
      const val1 = randoms[0];
      const val2 = randoms[1];
      const val3 = randoms[2];
      const val4 = randoms[3];
      const text = `<@${message.author.id}>の使用可能な武器は、${weapons[val1]}、${weapons[val2]}、${weapons[val3]}、${weapons[val4]}です。`;
      sendReply(message, text);
      return;
    }
    
    if (message.author.id == 852923175406141460) {
      
      var randoms = [];
      
      var min = 0, max = 12;
 
      
      
      for(let i = min; i <= max; i++){
        while(true){
          var tmp = intRandom(min, max);
          if(!randoms.includes(tmp)){
            randoms.push(tmp);
            break;
          }
        }
      }
    
      
      for(let i = 1; i <= 4; i++){
          var tmp = intRandom(min, max);
          randoms.push(tmp);
      }
 
     
      function intRandom(min, max){
        return Math.floor( Math.random() * (max - min + 1)) + min;
      }
    
      const weapons = [
      "ディボーション", //1
      "ランページ", //2
      "クレーバー", //3
      "チャージライフル", //4
      "P2020", //5
      "トリプルテイク", //6
      "ボセック", //7
      "ミニガン", //8
      "改造センチネル", //9
      "アークスター", //10
      "フラググレネード", //11
      "テルミット", //12
      "素手" //13
      ];
      const val1 = randoms[0];
      const val2 = randoms[1];
      const val3 = randoms[2];
      const val4 = randoms[3];
      const text = `<@${message.author.id}>の使用可能な武器は、${weapons[val1]}、${weapons[val2]}、${weapons[val3]}、${weapons[val4]}です。`;
      sendReply(message, text);
      return;
    }
    
    /** 重複チェック用配列 */
    var randoms = [];
    /** 最小値と最大値 */
    var min = 0, max = 33;
 
    /** 重複チェックしながら乱数作成 */
    /**
    for(let i = min; i <= max; i++){
      while(true){
        var tmp = intRandom(min, max);
        if(!randoms.includes(tmp)){
          randoms.push(tmp);
          break;
        }
      }
    }*/
    
    /** 重複チェックせずに乱数作成 */
    for(let i = 1; i <= 4; i++){
        var tmp = intRandom(min, max);
        randoms.push(tmp);
    }
 
    /** min以上max以下の整数値の乱数を返す */
    function intRandom(min, max){
      return Math.floor( Math.random() * (max - min + 1)) + min;
    }
    
    const weapons = [
      "ヘムロック", //1
      "フラットライン", //2
      "ハボック", //3
      "R301", //4
      "プラウラー", //5
      "ボルト", //6
      "R99", //7
      "オルタネーター", //8
      "CAR", //9
      "スピットファイア", //10
      "L-STAR", //11
      "ディボーション", //12
      "ランページ", //13
      "クレーバー", //14
      "チャージライフル", //15
      "センチネル", //16
      "ロングボウ", //17
      "ピースキーパー", //18
      "モザンビーク", //19
      "マスティフ", //20
      "EVA-8", //21
      "ウイングマン", //22
      "RE-45", //23
      "P2020", //24
      "トリプルテイク", //25
      "G7スカウト", //26
      "30-30リピーター", //27
      "ボセック", //28
      "ミニガン", //29
      "改造センチネル", //30
      "アークスター", //31
      "フラググレネード", //32
      "テルミット", //33
      "素手" //34
    ];
    const val1 = randoms[0];
    const val2 = randoms[1];
    const val3 = randoms[2];
    const val4 = randoms[3];
    const text = `<@${message.author.id}>の使用可能な武器は、${weapons[val1]}、${weapons[val2]}、${weapons[val3]}、${weapons[val4]}です。`;
    sendReply(message, text);
  }
  if (message.content.match(/\!はい/)) {
    let val = Math.random();
    if (canReply == false) {
      const text = "回答受付を終了しました";
      sendReply(message, text);
    }
    if (val<0.4 && canReply==true) {
      canReply = false;
      const text = "回答権を獲得しました";
      sendReply(message, text);
    } else {
      message.delete();
    }
    console.log("¥¥");
    return;
  }
  if (message.content.match(/\!どうぞ/)) {
    canReply=true;
  }
  if (message.content.match(/肉食いたい/)) {
    let text = "https://pbs.twimg.com/media/FJSqkGTaAAE8g5r?format=jpg&name=medium";
    sendMsg(message.channel.id, text);
    return;
  }
  if (message.content.match(/テスト用/)) {
  /*  const test = message.member.voice.channel.join().then(value => {
      console.log(value);
      return value;
    });
    console.log(test);*/
    const c = client.channels.cache.get("918212991646859337").members.size;
    console.log(c);
    jinro.test(message, "piyo");
  }
  if (message.content.match(/!testfor/)) {
    /*
    const params1 = new URLSearchParams(); //ウマ娘
    params1.append("d", "fp");
  
    const button1 = new discord.ButtonBuilder()
      .setCustomId(params1.toString())
      .setStyle(ButtonStyle.Primary)
      .setLabel("おみくじ")
      .setEmoji("🥠");
    */
   const test = message.content;
  }
  if (message.channel.id == 967022248223440916){
    if (message.content.match(/!部屋設定/)) {
      jinro.setConfig(message.content);
    }
    if (message.content.match(/!参加者/)) {
      jinro.players(message);
    }
    if (message.content.match(/!役職/)) {
      jinro.roles(message);
    }
    if (message.content.match(/!確認/)) {
      jinro.chkConfig(message);
    }
    if (message.content.match(/!開始/)) {
      jinro.startGame();
    }
  }
});

////////////translation commands////////////

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.channel.topic) return;
  
  ////////////FOR MAINTAINANCE ONLY////////////
  /*
  if(message.author.id != 786914493640081438){
    return;
  }
  //*/
  
  const translationConfig = message.channel.topic.trim().match(/deepl-translate\((.+)\)/);
  if (!translationConfig) return;

  const target_lang = translationConfig[1];
  if (!target_lang) return;
  
  const post = (message, lang) => {
    return axiosBase.post('https://api-free.deepl.com/v2/translate?' +
    'auth_key=' + auth_key +'&' + 
    'text=' + encodeURIComponent(message) + '&' +
    'target_lang=' + lang);
  }
  
  const send = (message, translations) => {
    const embed = new EmbedBuilder()
    .setAuthor({name: message.author.username, iconURL: message.author.avatarURL() })
    .setColor(0xff0000)
    .setDescription(
      translations.map(t => {
        let text = '`' + t.lang + ':` ' + t.translations[0].text;
        if (t.translations.length > 1) {
          text += ' (';
          text += t.translations.slice(1).map(others =>
            (others.detected_source_language + ': ' + others.text ))
            .join(', ');
          text += ')';
        }
        return text;
      })
      .join('\n'));
    message.channel.send({ embeds: [embed] });
  }

  post(message.content, target_lang)
  .then(response => {
    // if source text's language was same as target language, text was translated into default language.
    if (response.data.translations.length === 1 &&
        response.data.translations[0].detected_source_language === target_lang) {
      post(message.content, DEFAULT_LANG)
      .then(retry => {
        send(message, [ { lang: DEFAULT_LANG, translations: retry.data.translations } ]);
      })
    
    // if souce text's language was neither target language nor default language
    // add default language translation.
    } else if (
      response.data.translations[0].detected_source_language !== target_lang
      &&
      response.data.translations[0].detected_source_language !== DEFAULT_LANG) {
      post(message.content, DEFAULT_LANG)
      .then(retry => {
        send(message,
          [
            {
              lang: target_lang,
              translations: response.data.translations
            },
            {
              lang: DEFAULT_LANG,
              translations: retry.data.translations
            }
          ]);
      })
    
    // text was translated into target language.
    } else {
      send(message, [ { lang: target_lang, translations: response.data.translations } ]);
    }
  })
});

client.on('messageUpdate', (oldMessage, newMessage) => {
  if (newMessage.author.id == client.user.id || newMessage.author.bot){
    return;
  }
  if (newMessage.author.id !== client.user.id || newMessage.author.bot){
    let isPOWER = false;
    if (newMessage.author.id == 696698066597838849){
      newMessage.react('933971549361414174')
      .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
      .catch(console.error);
      isPOWER = true;
    }
    if (newMessage.author.id == 910381775874834462){
      newMessage.react('933971549361414174')
      .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
      .catch(console.error);
      isPOWER = true;
    }
    console.log("here");
      if (newMessage.content.match(/[pPｐＰ][oOｏＯ0０〇][wWｗＷ][eEｅＥ][rRｒＲ]|[ぱパ][わワクﾜｸ][一ー－―‐～₋⁻—￣ー]/)) {
        console.log("next")
        if (newMessage.content.match(/[pPｐＰ][oOｏＯ0０〇][wWｗＷ][eEｅＥ][rRｒＲ](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|[ぱパ][わワクﾜｸ][一ー－―‐～₋⁻—￣ー](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|ミントモーション殿下/)) {
          console.log("tochk")
          newMessage.react('933971549361414174')
          .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
          .catch(console.error);
          return;
        } else {
          console.log("orhere")
          sendReply(newMessage, "殿下を無礼るなぁ！");
          return;
  　    }
      }
  }
});

client.on('guildMemberRemove', member => {
  sendMsg(logChannelId, "退出"); 
  sendMsg(logChannelId, member.user.tag); 
})

  ////////////DM message commands////////////

client.on('messageCreate', message => {
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }

  let DMText = `${message.author.username}:\n${message.content}`;

  if (message.guild === null) {
    //sendDM("786914493640081438", DMText);
    //jinro.catchDM(message)
  }
});


  ////////////function definitions////////////

if(process.env.DISCORD_BOT_TOKEN == undefined){
 console.log('DISCORD_BOT_TOKENが設定されていません。');
 process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );

function sendReply(message, text){
  message.reply(text)
    .then(console.log("リプライ送信: " + text))
    .catch(console.error);
}

function sendMsg(channelId, text, option={}){
 return client.channels.cache.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}

async function sendDM(userID, text) {
  const user = await client.users.fetch(userID);
	user.send(text);
}

async function loadInpJson() {
  try {
    const preset = JSON.parse( fs.readFileSync( "./inpersonate.json", "utf8") ); 
    charList = preset.charList;
  } catch (err) {
    console.error(err.message);
  }
}

async function setInpJson() {
  const json = {
    "template": "['current_id', 'default_id', 'url', 'name_en', 'name_ja', default_flag, 'original_url']",
    "charList": charList
  }
  fs.writeFileSync('./inpersonate.json', JSON.stringify(json, null, 2), "utf-8", (err) => {
    if(err) {
      console.log(err);
    }
  });
}

const doApi = async (url, data) => {
  const axios = axiosBase.create({
    //baseURL: "https://inky-electric-ladybug.glitch.me",//https://script.google.com",
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "json",
  });
  console.log("in here");
  axios.post(url, data)
  .then((response) => console.log(response.data + "hello! here"))
  .catch(console.error);
};

const syncTimeout = ( ms ) => {
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      console.log(`waiting ${ms} ms...`);
      resolve();
    }, ms);
  });
}

//role prepare commands

async function prepareRole() {
  const guild = await client.guilds.fetch("918212991135125556");
  /** @type {Discord.TextChannel} */
  const channel = await guild.channels.fetch("1030773911836696597");

  const params1 = new URLSearchParams(); //ウマ娘
  params1.append("d", "rp");
  params1.append("rid", "1030744003743842354");
  const params2 = new URLSearchParams(); //マイクラ
  params2.append("d", "rp");
  params2.append("rid", "1030773031062212691");
  const params3 = new URLSearchParams(); //FPS
  params3.append("d", "rp");
  params3.append("rid", "1030772094604152903");
  const params4 = new URLSearchParams(); //イベント
  params4.append("d", "rp");
  params4.append("rid", "1030769676315271270");
  const params5 = new URLSearchParams(); //イラスト
  params5.append("d", "rp");
  params5.append("rid", "1031884882386898944");
  
  const button1 = new discord.ButtonBuilder()
    .setCustomId(params1.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel("ウマ娘/UmaMusume")
    .setEmoji("🐎");
  const button2 = new discord.ButtonBuilder()
    .setCustomId(params2.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel("マイクラ/MineCraft")
    .setEmoji("⛏");
  const button3 = new discord.ButtonBuilder()
    .setCustomId(params3.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel("FPS")
    .setEmoji("🔫");
  const button4 = new discord.ButtonBuilder()
    .setCustomId(params4.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel("イベント/event")
    .setEmoji("🎪");
  const button5 = new discord.ButtonBuilder()
    .setCustomId(params5.toString())
    .setStyle(ButtonStyle.Primary)
    .setLabel("イラスト/illustration")
    .setEmoji("🎨");

  await channel.send({
    content: "以下のロールを用いてイベントや企画、新着情報などをメンションにて通知予定です。The following roles will be used to announce events, projects, and new information.",
    components: [
      new discord.ActionRowBuilder().addComponents(button1),
      new discord.ActionRowBuilder().addComponents(button2),
      new discord.ActionRowBuilder().addComponents(button3),
      new discord.ActionRowBuilder().addComponents(button4),
      new discord.ActionRowBuilder().addComponents(button5)
    ]
  });
}
//prepareRole().catch(err => console.error(err));

//role give commands

async function handleError(err, { interaction, role_id, role_mention }) {
  if (err instanceof discord.DiscordAPIError) {
    switch (err.code) {
      case 10011:
        await interaction.followUp(`役職の付与に失敗しました。\n付与しようとした役職(id: \`${role_id}\`)は存在しません。\n(サーバ管理者へ連絡してください。)`);
        return;
      case 50013:
        await interaction.followUp(
          `${role_mention}の付与に失敗しました。\nBotに十分な権限がありません。\n(サーバ管理者へ連絡してください。)`,
        );
        return;
    }

  }
  interaction.followUp(`${role_mention}の付与に失敗しました。\n時間をおいてやり直してください。`).catch(() => { });
  throw err;
}
/**
 * 
 * @param {discord.ButtonInteraction} interaction 
 * @param {URLSearchParams} params 
 * @returns 
 */
async function rolePanel(interaction, params) {
  /** @type {discord.Snowflake} */
  const role_id = params.get("rid");
  await interaction.deferReply({
    ephemeral: true
  });
  const guild = await interaction.guild.fetch();
  // APIからのメンバーオブジェクト(discord.jsのGuildMemberでないもの)がそのまま渡ってくることがあるのでfetchすることで確実にGuildMemberとする。
  // interaction.member.user.idでなければならない。なぜならば、APIInteractionGuildMemberはid を直接持たないからである。
  const member = await guild.members.fetch(interaction.member.user.id,{
    force: true // intentsによってはGuildMemberUpdateが配信されないため
  });
  const role_mention = `<@&${role_id}>`;
  if (member.roles.resolve(role_id)) {
    await interaction.followUp(`すでに、${role_mention}を持っています。`);
    return;
  }
  try {
    await member.roles.add(role_id);
  } catch (err) {
    await handleError(err, { interaction, role_id, role_mention });
    return;
  }
  await interaction.followUp({
    content: `${role_mention} を付与しました。`
  });
}
const buttons = {
  rp: rolePanel
};
/**
 * 
 * @param {discord.Interaction} interaction 
 */
async function onInteraction(interaction) {
  if (!interaction.isButton()) {
    return;
  }
  const params = new URLSearchParams(interaction.customId);
  await buttons[params.get("d")](interaction, params);
}

//report commands

async function sendPeriodically(){
  const configs = JSON.parse( fs.readFileSync( "./sendPeriodically.json", "utf8") );
  let configList = configs.config;
  console.log(configList);
  for (let config of configList) {
    console.log(config);
    if (config[5]) {
      if (config[2] >= config[1]) {
        let ms = config[1] * 300000;
        const channel_id = config[3];
        const content = config[4];
        const msgSent = await sendMsg(channel_id, content);
        config[2] = 1;
        const json = {
          "template": "['name', 'interval', 'time', 'channel_id', 'content', 'isSending']",
          "config": configList
        }
        console.log(json);
        fs.writeFileSync('./sendPeriodically.json', JSON.stringify(json, null, 2), "utf-8", (err) => {
          if(err) {
            console.log(err);
          }
        });
        await syncTimeout(ms);
        await msgSent.delete();
        console.log(config);
      } else {
        config[2] ++
        console.log(config);
      }
    }
  }
  const json = {
    "template": "['name', 'interval', 'time', 'channel_id', 'content', 'isSending']",
    "config": configList
  }
  console.log(json);
  fs.writeFileSync('./sendPeriodically.json', JSON.stringify(json, null, 2), "utf-8", (err) => {
    if(err) {
      console.log(err);
    }
  });
}

//reset json data

function reset() {
  var today = new Date();
  console.log(today);
  today.setHours(today.getHours() + 9);
  const date = today.getDate();
  const omikuji = JSON.parse( fs.readFileSync( "./omikuzi.json", "utf8") );
  const omikujiDate = omikuji.date;
  console.log(date, omikujiDate);
  if (date == omikujiDate) return;
  let usedUserData = { "date": date, "name": [] };
  fs.writeFileSync('./omikuzi.json', JSON.stringify(usedUserData, null, 2), "utf-8", (err) => {
    if(err) {
      console.log(err);
    }
  });
}