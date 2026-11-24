import * as messageModel from '../models/messageModel.js';

export async function getMessagesByDate(date, beneficiaireId) {
	const messages = await messageModel.findMessagesByDate(date, beneficiaireId);
	return messages;
}
