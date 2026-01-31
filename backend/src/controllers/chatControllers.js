import { generateStreamToken } from '../config/stream.js';

export const getStreamToken = async (req, res) => {
  try {
    const { userId } = req.auth();
    const token = generateStreamToken(userId);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
