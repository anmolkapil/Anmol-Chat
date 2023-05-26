import './ChatPage.css';

import Sidebar from '../../components/Sidebar/Sidebar';
import ChatBox from '../../components/ChatBox/ChatBox';

import { useChat } from '../../context/ChatContext';

const ChatPage = () => {
  const { selectedRoom, selectedUser } = useChat();

  return (
    <div className="chatHome">
      <div className="chatContainer">
        <Sidebar />
        {selectedRoom || selectedUser ? (
          <ChatBox />
        ) : (
          <div className="select-room">
            Select a chat from the sidebar or create a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
