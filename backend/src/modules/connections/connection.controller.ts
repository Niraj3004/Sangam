import { Request, Response } from 'express';
import * as connectionService from './connection.service';
import { sendSuccess } from '../../utils/response';

export const requestConnection = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const { purpose, note } = req.body;
  const connection = await connectionService.requestConnection(req.user!.userId, userId, purpose, note);
  sendSuccess(res, connection, 201);
};

export const acceptConnection = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const connection = await connectionService.acceptConnection(req.user!.userId, userId);
  sendSuccess(res, connection, 200);
};

export const rejectConnection = async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const connection = await connectionService.rejectConnection(req.user!.userId, userId);
  sendSuccess(res, connection, 200);
};

export const getMyConnections = async (req: Request, res: Response) => {
  const connections = await connectionService.getMyConnections(req.user!.userId);
  sendSuccess(res, connections, 200);
};

export const getPendingRequests = async (req: Request, res: Response) => {
  const requests = await connectionService.getPendingRequests(req.user!.userId);
  sendSuccess(res, requests, 200);
};

export const getSuggestions = async (req: Request, res: Response) => {
  const suggestions = await connectionService.getSuggestions(req.user!.userId);
  sendSuccess(res, suggestions, 200);
};
