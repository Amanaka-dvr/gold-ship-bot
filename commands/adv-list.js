const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adv-list')
		.setDescription('広告メッセージ機能の設定の一覧'),
	async execute(interaction) {
        const configs = JSON.parse( fs.readFileSync( "./sendPeriodically.json", "utf8") );
        let configsList = [];
        for (let txt of configs.config) {
            let isSending = "";
            if (txt[5]) {
                isSending = "起動中";
            } else {
                isSending = "停止中";
            }
            const template = `\n名前： ${txt[0]} \n間隔： ${txt[1]*5} \n 送信先： <#${txt[3]}> \n 送信内容： ${txt[4]} \n 状態： ${isSending}`;
            configsList.push(template);
        }
        if (configsList.length === 0) configsList = "設定が存在しません。";
		await interaction.reply({ content: configsList.toString(), ephemeral: true });
	},
};