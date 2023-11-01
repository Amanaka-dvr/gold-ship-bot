const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('advertise')
		.setDescription('定期的な広告用メッセージの送信設定')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('任意の名前を設定してください。')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option
            .setName('minutes')
            .setDescription('投稿間隔を5分単位で入力してください。')
            .setRequired(true)
        )
        .addChannelOption(option =>
            option
            .setName('channel')
            .setDescription('投稿先のチャンネルを一つ指定してください。')
            .setRequired(true)
        )
        /*
        .addStringOption(option =>
            option
                .setName('channel')
                .setDescription('投稿先のチャンネルを一つ指定してください。')
                .setRequired(true) 
                .addChoices(
                    {name:'フリートーク', value:'918212991646859336'},
                    {name:'大喜利・クイズ', value:'934662355772669992'},
                    {name:'舞台袖', value:'937522865354473522'},
                    {name:'お絵描き雑談', value:'977429385042862080'},
                    {name:'聞き専', value:'934021714608799774'},
                    {name:'聞き専2', value:'934378749321957376'},
                    {name:'聞き専3', value:'939821864035966996'},
                    {name:'イベント(配信)聞き専', value:'952853378524925992'},
                    {name:'イベント(参加型1)聞き専', value:'1009496624743075860'},
                    {name:'イベント(参加型2)聞き専', value:'1085593999244537887'},
                    {name:'ラジオ聞き専', value:'959428435976024125'}
                )
        )
        */
        .addStringOption(option =>
            option
                .setName('content')
                .setDescription('送信内容を入力してください。')
                .setRequired(true) 
        ),
	async execute(interaction) {
        const configs = JSON.parse( fs.readFileSync( "./sendPeriodically.json", "utf8") );
        
        const name = interaction.options.get("name");
        const names = configs.config.map(el => el[0]);
        if (names.includes(name.value)) {
            return interaction.reply({ content: "同名の設定が既にあります。名前を変更してください。", ephemeral: true });
        }
        const minutes = interaction.options.get("minutes");
        let interval = parseInt(minutes.value / 5) || 1;
        if (interval < 0) interval = -(interval);
        const channel_m = interaction.options.get("channel");
        const channel = channel_m.value.replace(/[^0-9]/g, '');
        const content = interaction.options.get("content");
        const addedConfig = [name.value, interval, 1, channel, content.value, true];
        
        let configList = configs.config;
        configList.push(addedConfig);
        const json = {
            "template": "['name', 'interval', 'time', 'channel_id', 'content', 'isSending']",
            "config": configList
        }
        fs.writeFileSync('./sendPeriodically.json', JSON.stringify(json, null, 2), "utf-8", (err) => {
            if(err) {
                console.log(err);
            }
        });
		await interaction.reply({ content: "設定が完了しました。", ephemeral: true });
	},
};