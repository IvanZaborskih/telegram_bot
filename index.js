const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '5525704708:AAFwaIwWrR4TUHVjtOJgbpif5VjtfqVq1zY';

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9');
	const randomNumber = Math.floor(Math.random() * 10);
	chats.chatId = randomNumber;
	await bot.sendMessage(chatId, `Отгадывай!`, gameOptions);
};

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'Начальное приветствие' },
		{ command: '/info', description: 'Информация о пользователе' },
		{ command: '/game', description: 'Игра угадай число' }
	]);

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4ce/580/4ce58078-ce94-370f-8abb-836a56b5fa0b/1.webp');
			return await bot.sendMessage(chatId, 'Добро пожаловать, путник!');
		} else if (text === '/info') {
			return await bot.sendMessage(chatId, `Твое имя ${msg.from.first_name}`);
		} else if (text === '/game') {
			return startGame(chatId);
		}

		return bot.sendMessage(chatId, 'Я тебя не понимаю ;(');
	});

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;

		if (data == '/again') {
			return startGame(chatId);
		}

		if (data == chats.chatId) {
			return await bot.sendMessage(chatId, `Поздравляю, вы прошли игру:) Бот загадал число - ${chats.chatId}`, againOptions);
		} else {
			return await bot.sendMessage(chatId, `Упс, не повезло... Бот загадал цифру - ${chats.chatId}`, againOptions);
		}
	});
};

start();