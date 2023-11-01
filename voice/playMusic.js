const discord = require('discord.js'); //for setting
const { ButtonStyle } = require('discord.js');
const { Client, GatewayIntentBits, Partials, Intents, EmbedBuilder } = require("discord.js");
const ytdl = require('ytdl-core');
const fs = require('fs');
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

let presetObj = {};
let playing = false;


module.exports.addQueue = function(message) {
    // メッセージから動画URLだけを取り出す
    const url = message.content.split(' ')[1];
    console.log(url);
    if (!ytdl.validateURL(url)) return message.reply(`${url}は処理できません。`);
    // コマンドを実行したメンバーがいるボイスチャンネルを取得
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    loadPreset();
    console.log(presetObj);
    presetObj.queue.push(url);
    setPreset();
    console.log(presetObj);
    message.reply('キューに音楽を追加しました。');
}

module.exports.skipQueue = function(message) {
    // コマンドを実行したメンバーがいるボイスチャンネルを取得
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    loadPreset();
    console.log(presetObj);
    if (!presetObj.queue.length) return message.reply('キューに音楽がありません！');
    const text = presetObj.queue[0];
    presetObj.queue.shift();
    setPreset();
    console.log(presetObj);
    message.reply(`次の音楽の再生をスキップしました：\n${text}`);
}

module.exports.addPlayList = function(message) {
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    loadPreset();
    console.log(presetObj);
    const re = /[^\s]+/g;
    let scdstr = message.content.match(re);
    for (let i=1; i<scdstr.length; i++) {
      presetObj.playlist.push(scdstr[i]);
    }
    setPreset();
    console.log(presetObj);
    message.reply('プレイリストを追加しました。');
}

module.exports.removePlayList = function(message) {
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    loadPreset();
    console.log(presetObj);
    presetObj.playlist = [];
    setPreset();
    console.log(presetObj);
    message.reply('プレイリストを削除しました。');
}

module.exports.playMusic = async function(message) {
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    loadPreset();
    console.log(presetObj);
    if (!presetObj.queue.length) return message.reply('キューに音楽がありません！');
    if (playing) return message.reply('音楽を再生中です。');
    // チャンネルに参加
    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: true,
      selfMute: false,
    });
    const player = createAudioPlayer();
    connection.subscribe(player);
    // 動画の音源を取得
    while (presetObj.queue.length) {
      const url = presetObj.queue[0];
      presetObj.queue.shift();
      setPreset();
      console.log(presetObj);
      const stream = ytdl(ytdl.getURLVideoID(url), {
        filter: format => format.audioCodec === 'opus' && format.container === 'webm', //webm opus
        quality: 'lowest',
        highWaterMark: 32 * 1024 * 1024, // https://github.com/fent/node-ytdl-core/issues/902
      });
      let resource = createAudioResource(stream, {
        inputType: StreamType.WebmOpus,
        inlineVolume: true
      });
      resource.volume.setVolume(0.05);
      // 再生
      player.play(resource);
      playing = true;
      await entersState(player,AudioPlayerStatus.Playing, 10 * 1000);
      await entersState(player,AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
    }
    playing = false;
    // 再生が終了したら抜ける
    connection.destroy();
}

module.exports.playMusicList = async function(message) {
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    loadPreset();
    console.log(presetObj);
    console.log("readpreset");
    if (!presetObj.playlist.length) return message.reply('プレイリストがありません！');
    console.log("readplaylist");
    if (playing) return message.reply('音楽を再生中です。');
    // チャンネルに参加
    const connection = joinVoiceChannel({
      adapterCreator: channel.guild.voiceAdapterCreator,
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: true,
      selfMute: false,
    });
    const player = createAudioPlayer();
    connection.subscribe(player);
    // 動画の音源を取得
    const presetCopied = presetObj;
    while (presetCopied.playlist.length) {
      const url = presetCopied.playlist[0];
      presetCopied.playlist.shift();
      const stream = ytdl(ytdl.getURLVideoID(url), {
        filter: format => format.audioCodec === 'opus' && format.container === 'webm', //webm opus
        quality: 'lowest',
        highWaterMark: 32 * 1024 * 1024, // https://github.com/fent/node-ytdl-core/issues/902
      });
      const resource = createAudioResource(stream, {
        inputType: StreamType.WebmOpus
      });
      // 再生
      player.play(resource);
      playing = true;
      await entersState(player,AudioPlayerStatus.Playing, 10 * 1000);
      await entersState(player,AudioPlayerStatus.Idle, 24 * 60 * 60 * 1000);
    }
    playing = false;
    // 再生が終了したら抜ける
    connection.destroy();
}

module.exports.stopPlaying = function(message) {
    const channel = message.member.voice.channel;
    // コマンドを実行したメンバーがボイスチャンネルに入ってなければ処理を止める
    if (!channel) return message.reply('先にボイスチャンネルに参加してください！');
    playing = false;
    message.reply('再生状態を解除しました。');
}

function loadPreset() {
  try {
    const preset = JSON.parse( fs.readFileSync( "./voice/list.json", "utf8") ); 
    presetObj = preset;
  } catch (err) {
    console.error(err.message);
  }
}

function setPreset() {
  fs.writeFileSync('./voice/list.json', JSON.stringify(presetObj, null, 2), "utf-8", (err) => {
    if(err) {
      console.log(err);
    }
  });
}