const http = require('http');//for setting
const querystring = require('querystring');//for setting
const discord = require('discord.js'); //for setting
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});
const fs = require('fs');
//const AUTH_FILE = './package.json';

let canChangeConfig = true;

/*
------------------市民陣営---------------------
市民   占い師   霊能者   狩人
双子   女王   プリンセス   猫又   罠師   饒舌な狩人
医者   聖職者   賢者   魔女   暗殺者   わら人形
赤ずきん   巫女
偽占い師   占い師の弟子   貴族   独裁者   長老   市長
人狼キラー   ギャンブラー   名探偵   新聞配達
パン屋   狼憑き   番犬   病人   
呪われし者   生霊   奴隷   逃亡者   怪盗   家政婦   
ささやく双子   二丁拳銃   狼憑きの狩人   迷惑な狩人   
鉄の女   詩人   光の使徒   イタコ   神父   幸福の梟   
貴族の息子   テレパシスト

------------------人狼陣営---------------------
人狼   強欲な人狼   大狼   賢狼   能ある人狼
蘇る人狼   饒舌な人狼   一途な人狼   一匹狼
狂人   狂信者   ささやく狂人   反逆の狂人
狼少年   黒猫   サイコ   妖術師   爆弾狂   呪狼   
狼少女   新種の人狼   ギャンブル狂   闇の化身

------------------妖狐陣営---------------------
妖狐   子狐   背徳者   背信者   九尾の狐   
饒舌な妖狐   ささやく背教者

------------------恋人陣営---------------------
恋人   キューピット   悪女

-----------------サンタ陣営--------------------
サンタ   トナカイ

-----------------ゾンビ陣営--------------------
ゾンビ   ゾンビマニア   ささやくゾンビ博士

---------------その他第三陣営-------------------
殉教者   てるてる坊主   コウモリ男   ブタ男
純愛者   復讐者   天邪鬼   ねずみ娘

-------------------その他----------------------
酔っぱらい   疫病神   ジキルとハイド
*/
try {
  const roleConfig = JSON.parse( fs.readFileSync( "./jinro/roles.json", "utf8") ); 
} catch (err) {
  console.error(err.message);
}

let jinroData = {
  "config": {
    "dayTime": 10,
    "nightTime": 30,
    "canView": true,
    "canTalkInVote": true,
    "limitCOTimes": 1,
    "canSeeWhoVote": true,
    "randomKill": true,
    "canChangeTimeNumber": 0.5,
    "limitAddTime": 2,
    "ruleOf15sec": true,
    "villagerCanCO": false,
    "continuityGuard": true,
    "canDetectOnFirstDay": true 
  },
  "day": 0,
  "periodOfTime": 0,
  "time": 0,
  "player": [
    {"id": "", "live": true, "role": ""}
  ]
};

module.exports.setConfig = function(text) {
  if (canChangeConfig == false) {return;}
  
  let re = /[^\s]+/g;
  let rawtext = text.match(re);
  console.log(rawtext);
  if (rawtext.length == 5) {
    rawtext = [rawtext[0], rawtext[1], rawtext[2], "可", "可", 2, rawtext[3], "しない", "過半数", 2, "あり", "なし", "あり", rawtext[4]];
  }
  console.log(rawtext);
  //const jinroData = JSON.parse( fs.readFileSync( "./jinro.json", "utf8") );
  jinroData.config.dayTime = parseInt(rawtext[1]);
  jinroData.config.nightTime = parseInt(rawtext[2]);
  if (rawtext[3] == "可") {rawtext[3] = true;}
  else if (rawtext[3] == "不可") {rawtext[3] = false;}  
  jinroData.config.canView = rawtext[3];
  if (rawtext[4] == "可") {rawtext[4] = true;}
  else if (rawtext[4] == "不可") {rawtext[4] = false;}  
  jinroData.config.canTalkInVote = rawtext[4];
  jinroData.config.limitCOTimes = parseInt(rawtext[5]);
  if (rawtext[6] == "見せる") {rawtext[6] = true;}
  else if (rawtext[6] == "見せない") {rawtext[6] = false;}  
  jinroData.config.canSeeWhoVote = rawtext[6];
  if (rawtext[7] == "する") {rawtext[7] = true;}
  else if (rawtext[7] == "しない") {rawtext[7] = false;}  
  jinroData.config.randomKill = rawtext[7];
  if (rawtext[8] == "全員") {rawtext[8] = 1;}
  else if (rawtext[8] == "過半数") {rawtext[8] = 0.5;}
  else if (rawtext[8] == "なし") {rawtext[8] = 0;}
  jinroData.config.canChangeTimeNumber = rawtext[8];
  jinroData.config.limitAddTime = parseInt(rawtext[9]);
  if (rawtext[10] == "あり") {rawtext[10] = true;}
  else if (rawtext[10] == "なし") {rawtext[10] = false;}  
  jinroData.config.ruleOf15sec = rawtext[10];
  if (rawtext[11] == "あり") {rawtext[11] = true;}
  else if (rawtext[11] == "なし") {rawtext[11] = false;}  
  jinroData.config.villagerCanCO = rawtext[11];
  if (rawtext[12] == "あり") {rawtext[12] = true;}
  else if (rawtext[12] == "なし") {rawtext[12] = false;}  
  jinroData.config.continuityGuard = rawtext[12];
  if (rawtext[13] == "あり") {rawtext[13] = true;}
  else if (rawtext[13] == "なし") {rawtext[13] = false;}  
  jinroData.config.canDetectOnFirstDay = rawtext[13];
  console.log(jinroData);
  
  fs.writeFileSync('./jinro/jinro.json', JSON.stringify(jinroData, null, 2), "utf-8", (err) => {
    if(err) {
      console.log(err);
    }
  });
}

module.exports.players = function(message) {
  if (canChangeConfig == false) {return;}
  
  let playerConfig = [];
  jinroData = JSON.parse( fs.readFileSync( "./jinro/jinro.json", "utf8") );
  console.log(jinroData);
  message.mentions.members.each((e)=>{
    let playerTemplate = {"id": e.id, "live": true, "role": ""};
    playerConfig.push(playerTemplate);
  });
  jinroData.player = playerConfig;
  fs.writeFileSync('./jinro/jinro.json', JSON.stringify(jinroData, null, 2), "utf-8", (err) => {
    if(err) {
      console.log(err);
    }
  });
}

module.exports.roles = function(message) {
  let re = /[^\s]+/g;
  let rawtext = message.content.match(re);
  let count = 0;
  for (let i=1; i<rawtext.length; i++) {
    for (let j=0; j<roleConfig.length; j++) {
      if (rawtext[i] == roleConfig[j]) {
        count++;
      }
    }
  }
  if (count == rawtext.length - 1) {
    if (count == jinroData.player.length) {
      let playerConfig = [];
      rawtext.shift();
      console.log(rawtext);
      shuffle(rawtext);
      jinroData.player.forEach((e)=>{
        let playerTemplate = {"id": e.id, "live": true, "role": rawtext.shift()};
        console.log(playerTemplate);
        playerConfig.push(playerTemplate);
      });
      jinroData.player = playerConfig;
      fs.writeFileSync('./jinro/jinro.json', JSON.stringify(jinroData, null, 2), "utf-8", (err) => {
        if(err) {
          console.log(err);
        }
      });
    } else {
      const text = "役職の数が間違っています";
      sendMsg(message.channel.id, text);
    }
    //set each player roles
  } else {
    const text = "役職名が間違っています";
    sendMsg(message.channel.id, text);
  }
}

module.exports.chkConfig = function(message) {
  loadGame();
  
  let configList = new Array(13);
  let players = "";
  const playerList = jinroData.player.map(obj => obj.id);
  console.log(playerList);
  
  configList[0] = jinroData.config.dayTime;
  configList[1] = jinroData.config.nightTime;
  if (jinroData.config.canView == true) {configList[2] = "可";}
  else if (jinroData.config.canView == false) {configList[2] = "不可";}  
  if (jinroData.config.canTalkInVote == true) {configList[3] = "可";}
  else if (jinroData.config.canTalkInVote == false) {configList[3] = "不可";}  
  configList[4] = jinroData.config.limitCOTimes;
  if (jinroData.config.canSeeWhoVote == true) {configList[5] = "見せる";}
  else if (jinroData.config.canSeeWhoVote == false) {configList[5] = "見せない";}  
  if (jinroData.config.randomKill == true) {configList[6] = "する";}
  else if (jinroData.config.randomKill == false) {configList[6] = "しない";}  
  if (jinroData.config.canChangeTimeNumber == 1) {configList[7] = "全員";}
  else if (jinroData.config.canChangeTimeNumber == 0.5) {configList[7] = "過半数";}
  else if (jinroData.config.canChangeTimeNumber == 0) {configList[7] = "なし";}
  configList[8] = jinroData.config.limitAddTime;
  if (jinroData.config.ruleOf15sec == true) {configList[9] = "あり";}
  else if (jinroData.config.ruleOf15sec == false) {configList[9] = "なし";}  
  if (jinroData.config.villagerCanCO == true) {configList[10] = "あり";}
  else if (jinroData.config.villagerCanCO == false) {configList[10] = "なし";}   
  if (jinroData.config.continuityGuard == true) {configList[11] = "あり";}
  else if (jinroData.config.continuityGuard == false) {configList[11] = "なし";}  
  if (jinroData.config.canDetectOnFirstDay == true) {configList[12] = "あり";}
  else if (jinroData.config.canDetectOnFirstDay == false) {configList[12] = "なし";}  
  
  for (let a of playerList) {
    players = players.concat("<@", a, ">");
  }
  
  let configTable = `
. 昼の長さ: ${configList[0]}
  夜の長さ: ${configList[1]}
  観戦: ${configList[2]}
  投票時の会話: ${configList[3]}
  CO回数制限: ${configList[4]}
  投票先: ${configList[5]}
  投票同数ランダム処刑: ${configList[6]}
  時短・延長成立人数: ${configList[7]}
  時短延長回数: ${configList[8]}
  15秒ルール: ${configList[9]}
  市民騙り: ${configList[10]}
  連続ガード: ${configList[11]}
  初日占い: ${configList[12]}
  参加者:
  ${players}
  `;
  sendMsg(message.channel.id, configTable, );
}

module.exports.startGame = async function() {
  canChangeConfig = false;
  
  loadGame();
  
  let configList = new Array(13);
  let players = "";
  const playerList = jinroData.player.map(obj => obj.id);
  console.log(playerList);
  
  configList[0] = jinroData.config.dayTime;
  configList[1] = jinroData.config.nightTime;
  if (jinroData.config.canView == true) {configList[2] = "可";}
  else if (jinroData.config.canView == false) {configList[2] = "不可";}  
  if (jinroData.config.canTalkInVote == true) {configList[3] = "可";}
  else if (jinroData.config.canTalkInVote == false) {configList[3] = "不可";}  
  configList[4] = jinroData.config.limitCOTimes;
  if (jinroData.config.canSeeWhoVote == true) {configList[5] = "見せる";}
  else if (jinroData.config.canSeeWhoVote == false) {configList[5] = "見せない";}  
  if (jinroData.config.randomKill == true) {configList[6] = "する";}
  else if (jinroData.config.randomKill == false) {configList[6] = "しない";}  
  if (jinroData.config.canChangeTimeNumber == 1) {configList[7] = "全員";}
  else if (jinroData.config.canChangeTimeNumber == 0.5) {configList[7] = "過半数";}
  else if (jinroData.config.canChangeTimeNumber == 0) {configList[7] = "なし";}
  configList[8] = jinroData.config.limitAddTime;
  if (jinroData.config.ruleOf15sec == true) {configList[9] = "あり";}
  else if (jinroData.config.ruleOf15sec == false) {configList[9] = "なし";}  
  if (jinroData.config.villagerCanCO == true) {configList[10] = "あり";}
  else if (jinroData.config.villagerCanCO == false) {configList[10] = "なし";}   
  if (jinroData.config.continuityGuard == true) {configList[11] = "あり";}
  else if (jinroData.config.continuityGuard == false) {configList[11] = "なし";}  
  if (jinroData.config.canDetectOnFirstDay == true) {configList[12] = "あり";}
  else if (jinroData.config.canDetectOnFirstDay == false) {configList[12] = "なし";}  
  
  for (let a of playerList) {
    players = players.concat("<@", a, ">");
  }
  
  let configTable = `
. 昼の長さ: ${configList[0]}
  夜の長さ: ${configList[1]}
  観戦: ${configList[2]}
  投票時の会話: ${configList[3]}
  CO回数制限: ${configList[4]}
  投票先: ${configList[5]}
  投票同数ランダム処刑: ${configList[6]}
  時短・延長成立人数: ${configList[7]}
  時短延長回数: ${configList[8]}
  15秒ルール: ${configList[9]}
  市民騙り: ${configList[10]}
  連続ガード: ${configList[11]}
  初日占い: ${configList[12]}
  参加者:
  ${players}
  `;
  sendMsg('965798600070291486', configTable, );
}

module.exports.test = function(message, text) {
  console.log(message.channel.id);
  const channelID = message.channel.id;
  const ch = message.guild.channels.cache.find(c => c.id == channelID);
  const customerchannel = client.channels.cache.get(channelID);
  const cch = client.channels.cache.find(c => c.id == channelID);
  console.log(customerchannel);
  console.log("---------------------------------------------------------");
  console.log(cch);
  ch.send("ohayo")
  /*
  return customerchannel.send(text)
    .then(console.log("メッセージ送信: " + text ))
    .catch(console.error);*/
  sendMsg(channelID, text);
  sendDM("786914493640081438", "よお！ゴルシちゃんだぞ！");
  sendDM("505846772069826571", "よお！ゴルシちゃんだぞ！");

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
/*
function sendDM(userID, text) {
  const user = client.users.cache.get(userID);
	user.send(text);
}
*/
const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const loadGame = () => {
  try{
    jinroData = JSON.parse( fs.readFileSync( "./jinro/jinro.json", "utf8") );
  } catch(err) {
    jinroData = {};
    console.error(err.message);
  }
}