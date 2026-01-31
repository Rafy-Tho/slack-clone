import { SignInButton, UserButton } from '@clerk/clerk-react';
import '../styles/stream-chat-theme.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat';
import PageLoader from '../components/PageLoader';
import { ErrorMessage } from '../components/ErrorMassage';
import {
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  Channel,
} from 'stream-chat-react';
import { PlusIcon } from 'lucide-react';
import CreateChannelModal from '../components/CreateChannelModal';
function HomePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { chatClient, tokenError, tokenLoading } = useStreamChat();
  useEffect(() => {
    if (!chatClient) return;
    const channelId = searchParams.get('channel');
    if (!channelId) return;
    const channel = chatClient.channel('messaging', channelId);
    channel.watch().then(() => {
      setActiveChannel(channel);
    });
  }, [chatClient, searchParams]);
  if (tokenError)
    return (
      <ErrorMessage
        title="Token Error"
        message={tokenError.message}
        onRetry={() => setSearchParams({})}
      />
    );
  if (tokenLoading) return <PageLoader />;
  if (!chatClient) return null;
  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">
          {/* left side */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              {/* header */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="logo" className="brand-logo" />
                  <span className="brand-name">Slap</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>
              {/* channels */}
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="create-channel-btn"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span className="text-sm">Create Channel</span>
                  </button>
                </div>
                {/* channels list */}
              </div>
            </div>
          </div>
          {/* right side */}
          <div className="chat-main">
            <Channel
              channel={activeChannel}
              setActiveChannel={setActiveChannel}
            >
              <Window>
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
        {isCreateModalOpen && (
          <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </Chat>
    </div>
  );
}

export default HomePage;
