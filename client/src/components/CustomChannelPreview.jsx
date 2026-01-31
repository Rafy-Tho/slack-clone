import { HashIcon } from 'lucide-react';

function CustomChannelPreview({ channel, activeChannel, setActiveChannel }) {
  const isActive = activeChannel && activeChannel?.id === channel.id;
  const isDM =
    channel.data.member_count === 2 && channel.data.id.includes('user_');
  if (isDM) return null;
  const unreadCount = channel.unreadCount;
  return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={`str-chat__channel-preview-messenger transition-colors flex items-center w-full text-left px-4 py-4 rounded-lg mb-1 font-medium hover:bg-blue-50/80 min-h-9 ${isActive ? '!bg-black/20 !hover:bg-black/20 border-l-8 border-purple-500 shadow-lg text-blue-900' : ''}`}
    >
      <HashIcon className="mr-2 w-4 h-4 text-gray-300 " />
      <span className="str-str-chat__channel-preview-messenger-name flex-1">
        {channel.data.id}
      </span>

      {unreadCount > 0 && (
        <span className="str-chat__channel-preview-messenger-unread-count bg-red-500 text-white text-xs font-bold px-2 rounded-full ml-2">
          {unreadCount}
        </span>
      )}
    </button>
  );
}

export default CustomChannelPreview;
