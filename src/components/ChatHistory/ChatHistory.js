import './ChatHistory.css';

import Message from '../Message/Message';

import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const ChatHistory = () => {
  const { currentUser } = useAuth();
  const { selectedRoom, selectedUser, messages } = useChat();

  return (
    <div className="message-list">
      {messages[selectedRoom?.id || selectedUser?.id] &&
        messages[selectedRoom?.id || selectedUser?.id].map((message, index) => {
          const isLast = index === messages.length - 1;
          const noTail =
            !isLast &&
            messages[selectedRoom?.id || selectedUser?.id][index + 1]
              ?.senderName === message.senderName;
          return (
            <Message
              key={index}
              text={message.text}
              senderName={message.senderName}
              currentUser={currentUser}
              noTail={noTail}
            />
          );
        })}
    </div>
  );
};

export default ChatHistory;
