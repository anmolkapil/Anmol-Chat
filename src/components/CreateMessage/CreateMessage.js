import './CreateMessage.css';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

const CreateMessage = () => {
  const { currentUser } = useAuth();
  const { selectedRoom, selectedUser } = useChat();

  const messagesRef = selectedRoom
    ? collection(db, 'rooms', selectedRoom.id, 'messages')
    : collection(db, 'privatechats', selectedUser.id, 'messages');
  const [newMessage, setNewMessage] = useState('');
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    try {
      await addDoc(messagesRef, {
        text: newMessage,
        senderName: currentUser.displayName,
        senderUid: currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="createMessage">
      <input
        className="textarea"
        type="text"
        placeholder="Type a message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default CreateMessage;
