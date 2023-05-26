import './ChatBox.css';

import ChatHistory from '../ChatHistory/ChatHistory';
import CreateMessage from '../CreateMessage/CreateMessage';

import { useChat } from '../../context/ChatContext';

const ChatBox = () => {
  const { selectedRoom, selectedUser, leaveChat, leaveRoom } = useChat();
  const handleClick = () => {
    if (selectedRoom) leaveRoom(selectedRoom);
    else leaveChat(selectedUser);
  };
  return (
    <div className="chatBox">
      <div className="chatUser">
        <div className="photoname">
          {selectedUser?.profilePic && (
            <img
              className="photo"
              src={selectedUser?.profilePic}
              alt="User"
            ></img>
          )}

          <div className="chatname">
            {selectedRoom?.name || selectedUser?.name}
          </div>
        </div>
        <button className="leaveButton" onClick={handleClick}>
          Leave
        </button>
      </div>
      <ChatHistory />
      <CreateMessage />
    </div>
  );
};

export default ChatBox;
