import express from 'express';
import { getStreamToken } from '../controllers/chatControllers.js';
import { protectRoute } from '../middleware/auth.js';

const chatRoutes = express.Router();

chatRoutes.get('/token', protectRoute, getStreamToken);

export default chatRoutes;
