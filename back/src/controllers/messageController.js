import * as messageService from "../services/messageService.js";

export async function listMessages(req, res) {
	const messages = await messageService.getMessagesByDate();
	return res.status(200).json(messages);
}