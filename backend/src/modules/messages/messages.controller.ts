import { Request, Response } from 'express';
import * as messagesService from './messages.service';
import { sendSuccess } from '../../utils/response';

export const startConversation = async (req: Request, res: Response) => {
  const { recipientId } = req.body;
  const conversation = await messagesService.startConversation(req.user!.userId, recipientId);
  sendSuccess(res, conversation, 201);
};

export const getInbox = async (req: Request, res: Response) => {
  const conversations = await messagesService.getInbox(req.user!.userId);
  sendSuccess(res, conversations, 200);
};

export const getMessages = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const { page, limit } = req.query;
  const pageNum = page ? parseInt(page as string, 10) : 1;
  const limitNum = limit ? parseInt(limit as string, 10) : 20;

  const result = await messagesService.getMessages(conversationId, pageNum, limitNum);
  sendSuccess(res, result, 200);
};

export const sendMessage = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const { content } = req.body;
  const message = await messagesService.sendMessage(req.user!.userId, conversationId, content);
  sendSuccess(res, message, 201);
};

export const markAsRead = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const result = await messagesService.markAsRead(req.user!.userId, conversationId);
  sendSuccess(res, result, 200);
};
