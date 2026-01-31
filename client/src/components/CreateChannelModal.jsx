import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';
import * as Sentry from '@sentry/react';
import toast from 'react-hot-toast';
import {
  AlignCenterIcon,
  HashIcon,
  LockIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';
const validateChannelName = (name) => {
  if (!name) {
    return 'Channel name is required';
  }
  if (name.length < 3) {
    return 'Channel name must be at least 3 characters long';
  }
  if (name.length > 20) {
    return 'Channel name must be at most 20 characters long';
  }
  return '';
};

function CreateChannelModal({ onClose }) {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams('');
  const { client, setActiveChannel } = useChatContext();
  console.log({ users, selectedMembers });
  // Fetch users when the client is available
  useEffect(() => {
    const getUser = async () => {
      if (!client?.user) return;
      setLoadingUsers(true);
      try {
        const response = await client.queryUsers(
          {
            id: { $ne: client.user.id },
          },
          { name: 1 },
          {
            limit: 100,
          },
        );
        setUsers(response.users || []);
      } catch (error) {
        Sentry.captureException(error, {
          tags: { component: 'CreateChannelModal' },
          extra: {
            context: 'fetch_users_for_channel',
          },
        });
        setError(error.message);
      } finally {
        setLoadingUsers(false);
      }
    };
    getUser();
  }, [client]);
  // Reset the form when the channel name changes
  useEffect(() => {
    setChannelName('');
    setChannelType('public');
    setDescription('');
    setError('');
    setSelectedMembers([]);
  }, []);
  useEffect(() => {
    if (channelType === 'public')
      setSelectedMembers(users?.map((user) => user.id));
    else setSelectedMembers([]);
  }, [channelType, users]);
  const handleChannelNameChange = (e) => {
    setChannelName(e.target.value);
    setError(validateChannelName(e.target.value));
  };
  const handleMemberChange = (id) => {
    if (selectedMembers.includes(id))
      setSelectedMembers(selectedMembers.filter((member) => member !== id));
    else setSelectedMembers([...selectedMembers, id]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const channelNameError = validateChannelName(channelName);
    if (channelNameError) setError(channelNameError);
    if (isCreating || !client?.user) return;
    setIsCreating(true);
    setError('');
    try {
      const channelId = channelName
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .slice(0, 20);
      const channelData = {
        name: channelId,
        created_by_id: client.user.id,
        members: [...selectedMembers, client.user.id],
      };
      if (description) channelData.description = description;
      if (channelType === 'private') {
        channelData.private = true;
        channelData.visibility = 'private';
      } else {
        channelData.visibility = 'public';
        channelData.discoverable = true;
      }
      const channel = client.channel('messaging', channelId, channelData);
      await channel.watch();
      setActiveChannel(channel);
      setSearchParams({ channel: channelId });
      toast.success(`Channel ${channelName} created successfully`);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <div className="create-channel-modal-overlay">
      <div className="create-channel-modal">
        <div className="create-channel-modal__header">
          <h2>Create a channel</h2>
          <button onClick={onClose} className="create-channel-modal__close">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {/* form */}
        <form className="create-channel-modal__form" onSubmit={handleSubmit}>
          {error && (
            <div className="form-error">
              <AlignCenterIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          <div className="form-group">
            {/* Channel name */}
            <div className="input-with-icon">
              <HashIcon className="w-4 h-4 input-icon" />
              <input
                id="channel-name"
                type="text"
                value={channelName}
                onChange={handleChannelNameChange}
                placeholder="e.g. general"
                required
                className={`form-input ${error ? 'form-input--error' : ''}`}
                maxLength={20}
              />
            </div>
            {channelName && (
              <div className="form-hint">
                Channel ID will be: #
                {channelName
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w-]+/g, '')
                  .slice(0, 20)}
              </div>
            )}
          </div>
          {/* Channel type */}
          <div className="form-group">
            <label htmlFor="channel-type">Channel type</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  id="public-channel"
                  type="radio"
                  name="channel-type"
                  value="public"
                  checked={channelType === 'public'}
                  onChange={() => setChannelType('public')}
                />
                <div className="radio-content">
                  <HashIcon className="w-4 h-4 radio-icon" />
                  <div className="radio-title">Public</div>
                  <div className="radio-description">
                    Anyone can join this channel
                  </div>
                </div>
              </label>
              <label className="radio-option">
                <input
                  id="private-channel"
                  type="radio"
                  name="channel-type"
                  value="private"
                  checked={channelType === 'private'}
                  onChange={() => setChannelType('private')}
                />
                <div className="radio-content">
                  <LockIcon className="w-4 h-4 radio-icon" />
                  <div className="radio-title">Private</div>
                  <div className="radio-description">
                    Only invited members can join this channel
                  </div>
                </div>
              </label>
            </div>
          </div>
          {/* add members */}
          {channelType === 'private' && (
            <div className="form-group">
              <label htmlFor="members">Add members</label>
              <div className="member-selection-header">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMembers(users?.map((user) => user.id))
                  }
                  disabled={loadingUsers || users.length === 0}
                  className="btn btn-secondary btn-small"
                >
                  <UserIcon className="w-4 h-4" />
                  Select members
                </button>
                <span className="selected-count">
                  {' '}
                  {selectedMembers.length} Selected
                </span>
              </div>
              <div className="members-list">
                {loadingUsers ? (
                  <div className="loading-spinner"></div>
                ) : users.length < 1 ? (
                  <p>No users found</p>
                ) : (
                  users.map((user) => (
                    <label
                      key={user.id}
                      className={`member-item ${
                        selectedMembers.includes(user.id) ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="member-checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={() => handleMemberChange(user.id)}
                      />
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="member-avatar"
                        />
                      ) : (
                        <div className="member-avatar member-avatar-placeholder">
                          <span>
                            {(user.name || user.id).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="member-name">
                        {user.name || user.id}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}
          {/* description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Add a description for the channel"
              rows={3}
            />
          </div>
          {/* action */}
          <div className="create-channel-modal__actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!channelName.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChannelModal;
