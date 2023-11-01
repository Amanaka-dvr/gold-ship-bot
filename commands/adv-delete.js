const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('adv-delete')
		.setDescription('広告メッセージ機能の削除')
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('設定時に指定した名前を入力してください。')
                .setRequired(true)
        ),
	async execute(interaction) {
        const configs = JSON.parse( fs.readFileSync( "./sendPeriodically.json", "utf8") );
        const name = interaction.options.get("name");
        const names = configs.config.map(el => el[0]);
        console.log(name, "\n", names);
        if (names.includes(name.value) === false) {
            return interaction.reply({ content: "その名前の設定は存在しません。", ephemeral: true });
        } else {
            configs.config = configs.config.filter(arr => arr[0] !== name.value);
        }

        fs.writeFileSync('./sendPeriodically.json', JSON.stringify(configs, null, 2), "utf-8", (err) => {
            if(err) {
                console.log(err);
            }
        });
		await interaction.reply({ content: "設定を削除しました。", ephemeral: true });
	},
};