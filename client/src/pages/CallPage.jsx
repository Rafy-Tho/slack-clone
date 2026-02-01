import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

import { getStreamToken } from '../lib/api';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const { user, isLoaded } = useUser();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { data: token } = useQuery({
    queryKey: ['streamToken', user?.id],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  useEffect(() => {
    if (!token || !user || !callId) return;

    let isMounted = true;
    let videoClient;
    let callInstance;

    const initCall = async () => {
      try {
        videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.fullName || user.id,
            image: user.imageUrl,
          },
          token: token,
        });

        callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true });

        if (isMounted) {
          setClient(videoClient);
          setCall(callInstance);
          setIsConnecting(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error init call:', error);
          toast.error('Cannot connect to the call.');
          setIsConnecting(false);
        }
      }
    };

    initCall();

    return () => {
      isMounted = false;
      if (callInstance) {
        // We generally don't await in cleanup, but we can trigger the leave
        callInstance
          .leave()
          .catch((err) => console.error('Error leaving call', err));
      }
      if (videoClient) {
        videoClient
          .disconnectUser()
          .catch((err) => console.error('Error disconnecting user', err));
      }
    };
  }, [token, user, callId]);

  if (isConnecting || !isLoaded) {
    return (
      <div className="h-screen flex justify-center items-center">
        Connecting to call...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-4xl mx-auto">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();
  const navigate = useNavigate();

  // Redirect to home if the user has left the call
  if (callingState === CallingState.LEFT) {
    // Using setTimeout to avoid render-cycle updates if this happens during render
    setTimeout(() => navigate('/'), 0);
    return (
      <div className="h-screen flex justify-center items-center">
        Leaving call...
      </div>
    );
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
