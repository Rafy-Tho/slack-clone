import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { Component, useEffect, useState } from 'react';
import { getStreamToken } from '../lib/api';
import StreamChat from 'stream-chat';
import * as Sentry from '@sentry/browser';
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);
  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user.id,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !user) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: user.id,
          name: user.fullName,
          image: user.imageUrl,
        });
        setChatClient(client);
      } catch (error) {
        console.log(error);
        Sentry.captureException(error, {
          tags: { component: 'useStreamChat' },
          extra: {
            context: 'stream_chat-connection',
            userId: user?.id,
            streamApiKey: STREAM_API_KEY ? 'present' : 'missing',
          },
        });
      }
    };
    initChat();
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
        setChatClient(null);
      }
    };
  }, [tokenData, user, chatClient]);
  return { chatClient, tokenLoading, tokenError };
};
