import { StreamChat } from 'stream-chat';
import { ENV } from './env.js';

const streamClient = new StreamChat(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export const upsertUser = async (userData) => {
  try {
    await streamClient.upsertUser(userData);
    console.log('User upserted');
    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await streamClient.deleteUser(userId);
    console.log('User deleted');
  } catch (error) {
    console.log(error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdString = userId.toString();
    const token = streamClient.createToken(userIdString);
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};
