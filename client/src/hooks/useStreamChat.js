import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getStreamToken } from '../lib/api';
import { StreamChat } from 'stream-chat';
import * as Sentry from '@sentry/react';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  const {
    data: token, // Renamed for clarity; api returns the token string directly
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ['streamToken', user?.id],
    queryFn: getStreamToken,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!token || !user?.id) return;

    let isMounted = true;
    const client = StreamChat.getInstance(STREAM_API_KEY);

    const initChat = async () => {
      // 1. If already connected as the correct user, just update state
      if (client.userID === user.id) {
        if (isMounted) setChatClient(client);
        return;
      }

      // 2. If connected as a different user, disconnect first
      if (client.userID) {
        await client.disconnectUser();
        if (!isMounted) return;
      }

      try {
        await client.connectUser(
          {
            id: user.id,
            name: user.fullName || user.id,
            image: user.imageUrl,
          },
          token,
        );

        if (isMounted) {
          setChatClient(client);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Stream Connection Error:', error);
          Sentry.captureException(error, {
            tags: { component: 'useStreamChat' },
            extra: { userId: user.id },
          });
          setChatClient(null);
        }
      }
    };

    initChat();

    return () => {
      isMounted = false;
      const disconnect = async () => {
        // 3. Only disconnect if connected as the current user
        if (client.userID === user.id) {
          await client.disconnectUser();
        }
      };
      disconnect();
    };
  }, [token, user?.id, user?.fullName, user?.imageUrl]);

  return { chatClient, tokenLoading, tokenError };
};
