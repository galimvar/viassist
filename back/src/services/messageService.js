import * as messageModel from "../models/messageModel.js";

export async function getMessagesByDate(date) {
	const messages = await messageModel.findMessagesByDate(date);
	return messages;
}