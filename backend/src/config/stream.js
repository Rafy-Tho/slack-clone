import { StreamChat } from 'stream-chat';
import { ENV } from './env.js';

const streamClient = new StreamChat(
  ENV.STREAM_API_KEY,
  ENV.STREAM_SECRET_API_KEY,
);

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

export const addUserToPublicChannels = async (userId) => {
  const publicChannels = await streamClient.queryChannels({
    discoverable: true,
  });
  for (const channel of publicChannels) {
    await channel.addMembers(userId);
  }
};
