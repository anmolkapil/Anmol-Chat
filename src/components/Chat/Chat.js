import './Chat.css';

import Room from './group.png';
import { useChat } from '../../context/ChatContext';

const formatTimestamp = (timestamp) => {
  const currentDate = new Date();
  const date = timestamp.toDate();

  // Check if the date is today
  if (date.toDateString() === currentDate.toDateString()) {
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  // Check if the date is yesterday
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Return the date in the desired format
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Chat = ({
  chatId,
  name,
  profilePic,
  latestMessage,
  timestamp,
  handleClick,
}) => {
  //const formattedTimestamp = formatTimestamp(timestamp);
  const { selectedUser, selectedRoom } = useChat();

  let classN;
  if (selectedUser) {
    classN = selectedUser?.id === chatId ? 'highlight' : '';
  } else {
    classN = selectedRoom?.id === chatId ? 'highlight' : '';
  }

  const truncatedText =
    latestMessage.length > 25
      ? latestMessage.slice(0, 25) + '...'
      : latestMessage;

  return (
    <div className={`chat ${classN}`} onClick={handleClick}>
      <div className="profile">
        {profilePic && <img src={profilePic} alt="User"></img>}
        <div className="info">
          <p className="name">{name}</p>
          <p className="latestMessage">{truncatedText}</p>
        </div>
      </div>

      {/* <div className="meta">
        <span>9:00PM</span>
      </div> */}
    </div>
  );
};

export default Chat;
