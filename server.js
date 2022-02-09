const http = require('http');//for setting
const querystring = require('querystring');//for setting
const discord = require('discord.js'); //for setting
const crypto = require('crypto'); //to check hash value
const axiosBase = require("axios"); //to post other bot json
const Eris = require("eris"); //to read text message
const {VoiceText} = require('voice-text'); //to read text message
const {writeFileSync} = require('fs'); //to read text message
//const Tokens = require('./tokens.js'); //to read text message
const client = new discord.Client();
//const voiceText = new discord.VoiceText();
const shiritori = require('./lib/shiritori');
//const command = require('./lib/command');
const password = "mintmotionmintmotionmintmotion";
const debugChannelId = "933964587777286214";
const logChannelId = "934986946663559198";
const mainChannelId = "934139074560786482";
var connection = null;
var textBuffer = [];
const ChannelName = 'text_to_voice';
var userVoice = {};
const VoiceTable = ['hikari', 'haruka', 'takeru', 'santa', 'bear', 'show'];
let emergency = false;
let narikiri = "505846772069826571";

const doApi = async (url, data) => {
  const axios = axiosBase.create({
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    responseType: "json",
});

  console.log(data);
  try{
    axios.post(url, data);
  } catch (error) {
    console.log("Error message: " + error.message);
  }
};

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
        leadLine();
        res.end();
        return;
      }
      
      if(dataObject.hash === undefined || dataObject.nonce === undefined){
        console.log("undefined hash");
        res.end();
        return;
      }else{
        let serverHash = crypto.createHash('sha256').update(password + Math.floor(dataObject.nonce)).digest('hex');
        if(String(dataObject.hash) != serverHash){
          console.log("invalid hash");
          res.end();
          return;
        }else{
          console.log("nonce:" + Math.floor(dataObject.nonce));
          console.log("hash ok");
        }
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

var options = {};
try {
    options = require('./options')
}catch(e){};
client.on('ready', () =>{
  console.log('Bot準備完了～');
  client.user.setPresence({ activity: { name: 'げーむ' } });
  //leadLine();
  //client.guilds.get('918212991135125556').channels.get('933964587777286214').fetchMessages().then((a) => {console.log(a.get("940822001071833108"))});
  /*
  client.guilds.channels.catch.forEach(channel => {
      if (channel.id == 934986946663559198 || channel.id == 933964587777286214 || channel.id == 934338954260512829) {
            sendMsg(channel.id, "test");
      }
  });
   
   client.guilds.forEach((guild) => {
        var flag = true;
        guild.channels.forEach((channel) => {
            if (channel.name === ChannelName) {
                flag = false;
            }
        })
        if (flag) {
            var parent = guild.channels.forEach((channel) => {
                return channel.name === 'Text Channels'
            })
            guild.createChannel(ChannelName);//, 0, '', parent.id);
        }
    })
    */
});

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

/*
client.on('message', message =>{
  if (message.author.id == 910381775874834462){
    let react = message.guild.emojis.get('933971549361414174');
    message.react(react)
      .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
      .catch(console.error);
  }
});
*/

client.on('message', message =>{
  if (message.content.match(/!会長を呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(SYMBOLI_RUDOLF, data);
    return;
  }
  if (message.content.match(/!グルーヴを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(AIR_GROOVE, data);
    return;
  }
  if (message.content.match(/!ブライアンを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(NARITA_BRIAN, data);
    return;
  }
  if (message.content.match(/!テイオーを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(TOKAI_TEIO, data);
    return;
  }
  if (message.content.match(/!マックイーンを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(MEJIRO_MCQUEEN, data);
    return;
  }
  if (message.content.match(/!スぺを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(SPECIAL_WEEK, data);
    return;
  }
  if (message.content.match(/!スズカを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(SILENCE_SUZUKA, data);
    return;
  }
  if (message.content.match(/!ウオッカを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(VODKA, data);
    return;
  }
  if (message.content.match(/!ダスカを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(DAIWA_SCARLET, data);
    return;
  }
  if (message.content.match(/!ネイチャを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(NICE_NATURE, data);
    return;
  }
  if (message.content.match(/!殿下を呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(FINE_MOTION, data);
    return;
  }
  if (message.content.match(/!タマを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(TAMAMO_CROSS, data);
    return;
  }
  if (message.content.match(/!ターボを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(TWIN_TURBO, data);
    return;
  }
  if (message.content.match(/!ファル子を呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(SMART_FALCON, data);
    return;
  }
  if (message.content.match(/!フラッシュを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(EISHIN_FLASH, data);
    return;
  }
  if (message.content.match(/!タイキを呼ぶ/) && message.channel.id == 937522865354473522){
    const data = {
   'contentType' : 'application/json; charset=utf-8',
   'method' : 'post',
   'payload' : {
     'type':'wake'
   },
   'muteHttpExceptions': true
   };
    doApi(TAIKI_SHUTTLE, data);
    return;
  }
});

client.on('message', message =>{
  if (message.author.id == client.user.id || message.author.bot){
    return;
  }
  if (message.author.id == 910381775874834462){
    return;
  }
  if (message.author.id !== client.user.id || message.author.bot){
      if (message.content.match(/[mMｍ][iIｉ][nNｎ][tTｔ]|[ミみﾐ三≡][ンんﾝソｿ][トとﾄ卜]|310/)) {
        if (message.content.match(/[mMｍ][iIｉ][nNｎ][tTｔ](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|[ミみﾐ三][ンんﾝソｿ][トとﾄ卜](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|ミントモーション殿下/)) {
          let react = message.guild.emojis.get('933971549361414174');
          message.react(react)
          .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
          .catch(console.error);
          return;
        } else {
          sendReply(message, "殿下を無礼るなぁ！");
          return;
  　    }
      }
  }
});

client.on('message', async message => {
   // !purge コマンドが実行されたら
  if (message.author.id == 786914493640081438) {
   if (message.content === '!purge') {
     // コマンドが送信されたチャンネルから直近100件(上限)メッセージを取得する
     const messages = await message.channel.fetchMessages({ limit: 3 })
     // ボット以外が送信したメッセージを抽出
     const filtered = messages.filter(message => message.author.id == 933850580441497621)//!message.content.match(/大樹のウロ/))
     // それらのメッセージを一括削除
     message.channel.bulkDelete(filtered)
   };
  }
 });

client.on('message', message => {
  if(message.author.id == client.user.id || message.author.bot){
    return;
  }
  //934004004189503509
  if (message.author.id == 785813870929117204){
    let caution_text = "【要注意人物の発言です】";
    let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
    sendMsg(logChannelId, text);
    return;
  }
  if (message.author.id == 907907754344214548){
    let caution_text = "【要注意人物の発言です】";
    let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
    sendMsg(logChannelId, text);
    return;
  }
  if (message.content.match(/ﾀﾋね|56すぞ/)){
    let caution_text = "【禁止用語が含まれています】";
    let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
    sendMsg(logChannelId, text);
    return;
  }
  if (message.content.match(/http/)){
    let caution_text = "[外部サイトへのリンクが含まれています]";
    let text = caution_text+"\nuser:　"+message.member.displayName+"\nchannel:　<#"+message.channel.id+">\ntext:\n"+message.content+"\n";
    sendMsg(logChannelId, text);
    return;
  }
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
  if (true){//message.author.id == 786914493640081438){
    if (emergency == true) {
    message.delete();
    return;
    }
  }
  /*
  if (message.author.id == 786914493640081438) {
    const msgJson = {
        "content": message.content,
        "embed": "",
        "message_reference": {
            "message_id": message.id
        },
        "allowed_mentions": {
            "replied_user": "False"
        }
    };
    message.reply(JSON.stringify(msgJson));
    console.log(message.reference.id);
    return;
  }*/
  if(message.content.match(/\!ゴルシモード/) && message.channel.id == 937522865354473522){
    sendReply(message, "設定しました");
    narikiri = message.author.id;
    return;
  }
  if(message.content.match(/\!解除/) && message.channel.id == 937522865354473522){
    if (message.author.id == narikiri) {
      sendReply(message, "解除しました");
      narikiri = "不在";
    }
    return;
  };
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
  /*
  if(message.isMemberMentioned(client.user)){
    sendReply(message, "おう！なんか用か？");
    return;
  }
  */
  if (message.content.match(/564\s-?\d+\s-?\d+\s-?\d+/)){
    let re = /[^\s]+/g;
    let scdstr = message.content.match(re);
    let scd = scdstr.map(str=>parseInt(str,10));
    let text = scd;
    const a = scd[1];
    const b = scd[2];
    const c = scd[3];
    let A = 0;
    let B = 0;
    let C = 0;
    let D = 0;
    let E = 0;
    let F = 0;
    let G = 0;
    let H = 0;
    let I = 0;
    let J = 0;
    let K = 0;
    let L = 0;
    let M = 0;
    let N = 0;
    
    const checkInt = (a,b,c) => {
    a = parseInt(a);
    b = parseInt(b);
    c = parseInt(c);
    if (a===0||b===0||c===0) {
        specialCase(a,b,c);
    }else{
        calc(a,b,c);
    }
}

const specialCase = (a,b,c) => {
    var sign = "";
    if (a<0) {a = -a; b = -b; c = -c; var sign = '-';}
    if (a===0 && b===0 && c===0) {text = 0;}
    if (a===0 && b===0 && c!==0) {text = c;}
    if (a===0 && b!==0 && c===0) {text = changeMinus(b)+'x';}
    if (a!==0 && b===0 && c===0) {text = sign+changeToBlank(a)+'x²';}
    if (a===0 && b!==0 && c!==0) {text = changeMinus(b)+'x'+changeToPlus(c);}
    if (a!==0 && b!==0 && c===0) {
        let str = makeCoefficient(a,b);
        text = `${sign}${changeToBlank(str[2])}x(${str[0]}x${changeToPlus(str[1])})`;
    }
    if (a!==0 && b===0 && c!==0) {
        let subA = a;
        console.log(a,c);
        [a,c] = reduction2(a,c);
        M = subA / a;
        let i = "";
        if (c>0) i = 'i';
        else c = -c;
        let inRoot = a;
        let irrationalNum = factorOut(inRoot);
        let [aOutRoot,aInRoot] = [irrationalNum[0],irrationalNum[1]];
        inRoot = c;
        irrationalNum = factorOut(inRoot);
        let [cOutRoot,cInRoot] = [irrationalNum[0],irrationalNum[1]];
        console.log(aInRoot,cInRoot);
        let coefficient = 1;
        [aOutRoot,cOutRoot,coefficient] = makeCoefficient(aOutRoot,cOutRoot);
        M *= coefficient || 1;
        M = changeToBlank(M);
        console.log(aInRoot,aOutRoot,cInRoot,cOutRoot,coefficient);
        text = `${sign}${M}(${changeToBlank(aOutRoot)}${changeRoot(aInRoot)}x+${changeToBlank(cOutRoot)}${changeRoot(cInRoot)}${i})(${changeToBlank(aOutRoot)}${changeRoot(aInRoot)}x-${changeToBlank(cOutRoot)}${changeRoot(cInRoot)}${i})`
    }
}

const changeToBlank = x => {
    if (x===1) x = "";
    return x;
}

const changeToMinus = x => {
    if (x===-1) x = '-';
    return x;
}

const changeToPlus = x => {
    if (x>0) x = '+'+x;
    return x;
}

const changeMinus = x => {
    x = changeToBlank(x);
    x = changeToMinus(x);
    return x;
}

const changeSign = x => {
    x = changeToBlank(x);
    x = changeToPlus(x);
    return x;
}

const changeRoot = x => {
    if (x===1) x = "";
    if (x!=1&&x!=0) x = "√"+x;
    return x;
}

const makeCoefficient = (a,b) => {
    var coefficient = 1;
    for (let x = 2;x <= a && x <= Math.abs(b);){
        if (a%x === 0 && b%x === 0){
            a /= x;
            b /= x;
            coefficient *= x;
        }else{
            x++;
        }
    }
    if (a===1) a = "";
    if (coefficient===1) coefficient = "";
    return [a,b,coefficient];
}

const checkCoefficient = (A,G,a,M) => {
    console.log(A,G,a,M); 
    if (A*G>a) {
        let numerator = a*M;
        let denominator = A*G;
        console.log(numerator,denominator,a,M);
        [numerator,denominator] = reduction2(numerator,denominator);
        console.log(numerator,denominator);
        numerator===1&&denominator===1 ? M = 1
        :denominator===1 ? M = numerator
        :M = `${numerator}/${denominator}`;
        console.log(M);
        return M;
    }else if (A*G<a) {
        let numerator = a;
        let denominator = A*G*M;
        [numerator,denominator] = reduction2(numerator,denominator);
        numerator===1&&denominator===1 ? M = 1
        :denominator===1 ? M = numerator
        :M = `${numerator}/${denominator}`;
        console.log(M);
        return M;
    }else{
        console.log(M);
        return M;
    }
}

const calc = (a,b,c) => {
    console.log(a,b,c);
    if (a<0) {a = -a; b = -b; c = -c; N = 1;}
    let subA = a;
    console.log(a,b,c);
    [a,b,c] = reduction(a,b,c);
    M = subA / a;
    console.log(M,a,b,c);
    let imaginaryNum = 0;
    let numerator = -b;
    let denominator = 2*a;
    b**2-4*a*c>0 ? calcPlus(a,b,c,imaginaryNum,numerator,denominator,M,N)
    :b**2-4*a*c<0 ? calcMinus(a,b,c,imaginaryNum,numerator,denominator,M,N)
    :calcZero(a,imaginaryNum,numerator,denominator,M,N)
}

const calcZero = (a,imaginaryNum,numerator,denominator,M,N) => {
    let outRoot = 0;
    let fraction = "";
    console.log(numerator,denominator,outRoot);
    fraction = reduction(numerator,denominator,outRoot);
    console.log(fraction);
    let coefficient = makeCoefficient(fraction[1],fraction[0]);
    console.log(coefficient);
    A = 1;
    G = 1;
    A *= coefficient[0] || 1;
    B = -coefficient[1];
    C = 0;
    D = 0;
    E = 0;
    F = imaginaryNum;
    G *= coefficient[0] || 1;
    H = -coefficient[1];
    I = 0;
    J = 0;
    K = 0;
    L = imaginaryNum;
    M = checkCoefficient(A,G,a,M);
    setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
}

const calcPlus = (a,b,c,imaginaryNum,numerator,denominator,M,N) => {
    console.log(a,b,c,imaginaryNum,numerator,denominator,M,N);
    let inRoot = b**2-4*a*c;
    let partOfRoot = "";
    partOfRoot = factorOut(inRoot);
    let outRoot = partOfRoot[0];
    inRoot = partOfRoot[1]
    console.log(outRoot,inRoot);
    if (inRoot!==1) {
        let fraction = "";
        fraction = reduction(numerator,denominator,outRoot);
        console.log(fraction);
        A = 1;
        G = 1;
        A *= fraction[1];
        B = -fraction[0];
        C = 1;
        D = fraction[2];
        E = inRoot;
        F = imaginaryNum;
        G *= fraction[1];
        H = -fraction[0];
        I = 1;
        J = fraction[2];
        K = inRoot;
        L = imaginaryNum;
        M = checkCoefficient(A,G,a,M);
        console.log(N);
        setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
    }else{
        let inRoot = b**2-4*a*c;
        let partOfRoot = "";
        partOfRoot = factorOut(inRoot);
        let outRoot = partOfRoot[0];
        inRoot = partOfRoot[1]
        console.log(outRoot,inRoot);
        let first = b + outRoot;
        let second = b - outRoot;
        let firstFraction = reduction2(first,denominator);
        console.log(firstFraction);
        let firstCoefficient = makeCoefficient(firstFraction[1],firstFraction[0]);
        console.log(firstCoefficient);
        let secondFraction = reduction (second,denominator,0);
        let secondCoefficient = makeCoefficient(secondFraction[1],secondFraction[0]);
        A = firstCoefficient[0] || 1;
        B = firstCoefficient[1];
        [C,D,E,F] = [0,0,0,0];
        G = secondCoefficient[0] || 1;
        H = secondCoefficient[1];
        [I,J,K,L] = [0,0,0,0];
        M = checkCoefficient(A,G,a,M);
        setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
    }
}

const calcMinus = (a,b,c,imaginaryNum,numerator,denominator,M,N) => {
    imaginaryNum = 1;
    let inRoot = 4*a*c-b**2;
    let partOfRoot = "";
    partOfRoot = factorOut(inRoot);
    let outRoot = partOfRoot[0];
    inRoot = partOfRoot[1]
    console.log(outRoot,inRoot);
    let fraction = "";
    fraction = reduction(numerator,denominator,outRoot);
    console.log(fraction);
    A = 1;
    G = 1;
    A *= fraction[1];
    B = -fraction[0];
    C = 1;
    D = fraction[2];
    E = inRoot;
    F = imaginaryNum;
    G *= fraction[1];
    H = -fraction[0];
    I = 1;
    J = fraction[2];
    K = inRoot;
    L = imaginaryNum;
    M = checkCoefficient(A,G,a,M);
    setAnswer(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
}

const factorOut = (inRoot) => {
    let outRoot = 1;
    console.log(outRoot,inRoot);
    for (let x = 2;x <= inRoot;) {
        if (inRoot%x**2 === 0) {
            outRoot *= x;
            inRoot /= x**2;
            console.log(x,outRoot,inRoot);
        }else{
            x++;
        }
        if (x>=100000) {
            inRoot = '???';
            alert('PC保護のため計算を中止しました。これにより、根号内のくくり出しは行われません。');
        }
        console.log(x);
    }
    console.log(outRoot,inRoot);
    return [outRoot,inRoot];
}

const reduction2 = (numerator,denominator) => {
    console.log(numerator,denominator);
    for (let x = 2;x <= Math.abs(numerator) && x <= Math.abs(denominator);) {
        if (numerator%x === 0 && denominator%x === 0) {
            numerator /= x;
            denominator /= x;
            console.log(x,numerator,denominator);
        }else{
            x++;
        }
        if (x>=65537) {
            numerator = '???';
            denominator = '???';
        }
        console.log(x);
    }
    return [numerator,denominator];
}

const reduction = (numerator,denominator,outRoot) => {
    console.log(numerator,denominator,outRoot);
    for (let x = 2;x <= Math.abs(numerator) && x <= Math.abs(denominator) && x <= outRoot;) {
        if (numerator%x === 0 && denominator%x === 0 && outRoot%x === 0) {
            numerator /= x;
            denominator /= x;
            outRoot /= x;
            console.log(x,numerator,denominator,outRoot);
        }else{
            x++;
        }
        if (x>=65537) {
            outRoot = '???';
        }
        console.log(x);
    }
    return [numerator,denominator,outRoot];
}

const setAnswer = (A,B,C,D,E,F,G,H,I,J,K,L,M,N) => {
    console.log(A,B,C,D,E,F,G,H,I,J,K,L,M,N);
    if (A==1) A = "";
    if (B>0) B = '+'+B;
    if (B==0) B = "";
    if (C==1) C = '+';
    if (C==0) C = "";
    if (D==1||D==0) D = "";
    if (E==1||E==0) E = "";
    if (E!=1&&E!=0) E = "√"+E;
    if (F==1) F = 'i';
    if (F==0) F = "";
    if (G==1) G = "";
    if (H>0) H = '+'+H;
    if (H==0) H = "";
    if (I==1) I = '-';
    if (I==0) I = "";
    if (J==1||J==0) J = "";
    if (K==1||K==0) K = "";
    if (K!=1&&K!=0) K = "√"+K;
    if (L==1) L = 'i';
    if (L==0) L = "";
    if (M==1) M = "";
    if (N==1) N = '-';
    if (N==0) N = "";
    let answer = N+M+'('+A+'x'+B+C+D+E+F+')('+G+'x'+H+I+J+K+L+')';
    text = answer;
}

    checkInt(a,b,c);
    sendMsg(message.channel.id, text);
    return;
  }
  
  /*
  if(message.channel.id == debugChannelId) {
        shiritori(message);
        return;
  }
  */
  
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
  }
  if (message.content.match(/ウマといえば/)){
    let text = "Just a Way";
    sendMsg(message.channel.id, text);
  }
  if (message.content.match(/えいえい/)){
    let text = "むん";
    sendMsg(message.channel.id, text);
  }
  if (message.content.match(/暇/)){
    let text = "暇ならゴルシちゃんと遊ぼうぜ！";
    sendMsg(message.channel.id, text);
  }
  if (message.content.match(/火星の天気/)){
    let text = "猛烈な砂嵐\n最高気温-4℃\n最低気温-95℃";
    sendMsg(message.channel.id, text);
  }
  if (message.content.match(/現在のJPレート/)){
    let rate = 0+Math.random();
    let text = "1JPT="+rate+"¥";
    sendMsg(message.channel.id, text);
  }
  
  if (message.content.match(/現在のゴルジptレート/)){
    let rate = 1+Math.random()*0.1;
    let text = "1GJP="+rate+"¥";
    sendMsg(message.channel.id, text);
  }
  if (message.content.match(/今日の運勢|明日の運勢/)){
    let val = Math.random();
    let text = "";
    let luckval = 0;
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
    sendMsg(message.channel.id, text);
    return;
  }
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.id == client.user.id || newMessage.author.bot){
    return;
  }
  if (newMessage.author.id == 910381775874834462){
    return;
  }
  if (newMessage.author.id !== client.user.id || newMessage.author.bot){
      if (newMessage.content.match(/[mMｍ][iIｉ][nNｎ][tTｔ]|[ミみﾐ三≡][ンんﾝソｿ][トとﾄ卜]|310/)) {
        if (newMessage.content.match(/[mMｍ][iIｉ][nNｎ][tTｔ](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|[ミみﾐ三][ンんﾝソｿ][トとﾄ卜](さん|サン|ｻﾝ|さま|サマ|ｻﾏ|様|殿下|殿|氏|王|陛下)|ミントモーション殿下/)) {
          let react = newMessage.guild.emojis.get('933971549361414174');
          newMessage.react(react)
          .then(message => console.log("リアクション: <:A1_so_good:933971549361414174>"))
          .catch(console.error);
          return;
        } else {
          sendReply(newMessage, "殿下を無礼るなぁ！");
          return;
  　    }
      }
  }
});

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
 return client.channels.get(channelId).send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}
 
 async function leadLine(){
    const reply1 = await sendMsg("918212991646859336", "ここはフリートーク部屋だぞ！\n<#933715386367639562>に記載のルールを守って楽しもうな！\nThis is a channel where you can talk freely.\nPlease follow the rules written <#933715386367639562> and have fun!");
    const reply2 = await sendMsg("934430288233238559", "ここはフリートーク部屋だぞ！\n<#933715386367639562>に記載のルールを守って楽しもうな！\nThis is a channel where you can talk freely.\nPlease follow the rules written <#933715386367639562> and have fun!");
   const reply3 = await sendMsg("933942014737776650", "ここはお絵描き部屋だ！\n<#933715386367639562>に記載のルールを守って楽しもうな！\nThis is a channel where you post your drawings.\nPlease follow the rules written <#933715386367639562> and have fun!");
    await reply1.delete(25000);
    await reply2.delete(25000);
    await reply3.delete(25000);
  }
